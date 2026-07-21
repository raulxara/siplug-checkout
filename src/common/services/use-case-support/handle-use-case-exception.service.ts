import { Injectable } from '@nestjs/common';
import { DispatchLogProviderDtoIn } from '../log-provider-dispatch/dtos/dispatch-log-provider.dto-in';
import { DispatchLogProviderService } from '../log-provider-dispatch/dispatch-log-provider.service';
import { HandleUseCaseExceptionDtoIn } from './dtos/handle-use-case-exception.dto-in';

@Injectable()
export class HandleUseCaseExceptionService {
  constructor(
    private readonly dispatchLogProviderService: DispatchLogProviderService,
  ) {}

  async exec(dtoIn: HandleUseCaseExceptionDtoIn): Promise<void> {
    const error =
      dtoIn.error instanceof Error
        ? dtoIn.error
        : new Error('unknown error');

    console.info(
      JSON.stringify(
        {
          service: 'HandleUseCaseExceptionService',
          event: 'started',
          useCase: dtoIn.useCase,
          message: error.message,
        },
        null,
        2,
      ),
    );

    try {
      const dispatchResult = await this.dispatchLogProviderService.exec(
        new DispatchLogProviderDtoIn({
          appName: process.env.APP_NAME ?? 'siplug-checkout-api',
          appEnv: process.env.APP_ENV ?? 'local',
          appFile: dtoIn.appFile ?? error.stack?.split('\n')[1]?.trim() ?? '',
          useCase: dtoIn.useCase,
          type: 'error',
          message: error.message,
          trace: error.stack ?? null,
          config: {
            context: this.sanitizeContext(dtoIn.context),
          },
        }),
      );

      console.info(
        JSON.stringify(
          {
            service: 'HandleUseCaseExceptionService',
            event: 'dispatch_result',
            useCase: dtoIn.useCase,
            success: dispatchResult.success,
            statusCode: dispatchResult.statusCode,
            body: dispatchResult.body,
          },
          null,
          2,
        ),
      );

      if (dispatchResult.success !== true) {
        console.error(
          JSON.stringify(
            {
              service: 'HandleUseCaseExceptionService',
              event: 'failed_to_dispatch_log_provider',
              useCase: dtoIn.useCase,
              statusCode: dispatchResult.statusCode,
              body: dispatchResult.body,
            },
            null,
            2,
          ),
        );
      }
    } catch (errorDispatch) {
      const dispatchMessage =
        errorDispatch instanceof Error
          ? errorDispatch.message
          : 'unexpected error dispatching log provider';

      console.error(
        JSON.stringify(
          {
            service: 'HandleUseCaseExceptionService',
            event: 'unexpected_error_dispatching_log_provider',
            useCase: dtoIn.useCase,
            message: dispatchMessage,
          },
          null,
          2,
        ),
      );
    }
  }

  private sanitizeContext(
    context: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      const keyAsString = key.toLowerCase();

      if (this.isSensitiveKey(keyAsString)) {
        sanitized[key] = '[protected]';
        continue;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeContext(
          value as Record<string, unknown>,
        );
        continue;
      }

      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
        continue;
      }

      sanitized[key] = value;
    }

    return sanitized;
  }

  private sanitizeString(value: string): string {
    let sanitized = value;

    sanitized = sanitized.replace(
      /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
      'Bearer [protected]',
    );

    sanitized = sanitized.replace(
      /Basic\s+[A-Za-z0-9\-._~+/]+=*/gi,
      'Basic [protected]',
    );

    sanitized = sanitized.replace(
      /sk-[A-Za-z0-9_-]+/gi,
      '[protected_openai_key]',
    );

    sanitized = sanitized.replace(
      /enc::[A-Za-z0-9+/=:.{}"_-]+/gi,
      'enc::[protected]',
    );

    if (sanitized.length > 3000) {
      return `${sanitized.substring(0, 3000)}...[truncated]`;
    }

    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    return [
      'token',
      'authorization',
      'provider_token',
      'providertoken',
      'api_key',
      'apikey',
      'secret',
      'password',
      'client_secret',
      'clientsecret',
      'access_token',
      'accesstoken',
      'refresh_token',
      'refreshtoken',
      'private_key',
      'privatekey',
      'webhook_secret',
      'webhooksecret',
      'headers',
    ].includes(key);
  }
}