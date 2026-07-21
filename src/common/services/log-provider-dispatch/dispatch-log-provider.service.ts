import { Injectable } from '@nestjs/common';
import { BuildApiCredentialConnectionDataDtoIn } from '../../../modules/api-credentials/services/build-api-credential-connection-data/dtos/build-api-credential-connection-data.dto-in';
import { BuildApiCredentialConnectionDataService } from '../../../modules/api-credentials/services/build-api-credential-connection-data/build-api-credential-connection-data.service';
import { DispatchLogProviderDtoIn } from './dtos/dispatch-log-provider.dto-in';
import { DispatchLogProviderDtoOut } from './dtos/dispatch-log-provider.dto-out';

@Injectable()
export class DispatchLogProviderService {
  constructor(
    private readonly buildApiCredentialConnectionDataService: BuildApiCredentialConnectionDataService,
  ) {}

  async exec(
    dtoIn: DispatchLogProviderDtoIn,
  ): Promise<DispatchLogProviderDtoOut> {
    try {
      const connectionData =
        await this.buildApiCredentialConnectionDataService.exec(
          new BuildApiCredentialConnectionDataDtoIn('siplug-log-api'),
        );

      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      if (connectionData.token.trim() !== '') {
        headers.Authorization = `${connectionData.tokenPrefix} ${connectionData.token}`;
      }

      if (connectionData.origin && connectionData.origin.trim() !== '') {
        headers.Origin = connectionData.origin;
      }

      for (const [headerName, headerValue] of Object.entries(
        connectionData.headers,
      )) {
        if (headerName.trim() === '') {
          continue;
        }

        headers[headerName] = String(headerValue);
      }

      const payload = {
        app_name: dtoIn.appName,
        app_env: dtoIn.appEnv,
        app_file: dtoIn.appFile,
        use_case: dtoIn.useCase,
        type: dtoIn.type,
        message: dtoIn.message,
        trace: dtoIn.trace,
        config: dtoIn.config,
      };

      console.info(
        JSON.stringify(
          {
            service: 'DispatchLogProviderService',
            event: 'request',
            url: connectionData.url,
            useCase: dtoIn.useCase,
            appName: dtoIn.appName,
            appEnv: dtoIn.appEnv,
            hasAuthorization: Boolean(headers.Authorization),
            origin: headers.Origin ?? null,
          },
          null,
          2,
        ),
      );

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        connectionData.timeoutSeconds * 1000,
      );

      const response = await fetch(connectionData.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const responseText = await response.text();
      const body = this.parseResponseBody(responseText);

      const success = connectionData.expectedStatusCodes.includes(
        response.status,
      );

      console.info(
        JSON.stringify(
          {
            service: 'DispatchLogProviderService',
            event: 'response',
            success,
            statusCode: response.status,
            body,
          },
          null,
          2,
        ),
      );

      return new DispatchLogProviderDtoOut(success, response.status, body);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on dispatch log provider';

      console.error(
        JSON.stringify(
          {
            service: 'DispatchLogProviderService',
            event: 'exception',
            message,
          },
          null,
          2,
        ),
      );

      return new DispatchLogProviderDtoOut(false, 0, {
        message,
      });
    }
  }

  private parseResponseBody(responseText: string): Record<string, unknown> {
    try {
      const parsed = JSON.parse(responseText) as unknown;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }

      return {
        raw: parsed,
      };
    } catch {
      return {
        raw: responseText,
      };
    }
  }
}