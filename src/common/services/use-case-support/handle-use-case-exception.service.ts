import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from './dtos/handle-use-case-exception.dto-in';

@Injectable()
export class HandleUseCaseExceptionService {
  async exec(dtoIn: HandleUseCaseExceptionDtoIn): Promise<void> {
    const message =
      dtoIn.error instanceof Error ? dtoIn.error.message : 'unknown error';

    const stack = dtoIn.error instanceof Error ? dtoIn.error.stack : null;

    const payload = {
      type: 'error',
      useCase: dtoIn.useCase,
      message,
      stack,
      context: this.sanitizeContext(dtoIn.context),
      createdAt: new Date().toISOString(),
    };

    /**
     * Nesta fase inicial, mantemos o serviço local.
     * Depois, quando criarmos api_credentials + log provider,
     * este serviço será evoluído para despachar para a siplug-logs-api.
     */
    console.error(JSON.stringify(payload, null, 2));
  }

  private sanitizeContext(
    context: Record<string, unknown>,
  ): Record<string, unknown> {
    const sensitiveKeys = [
      'password',
      'token',
      'providerToken',
      'secret',
      'clientSecret',
      'accessToken',
      'privateKey',
      'webhookSecret',
    ];

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      if (sensitiveKeys.includes(key)) {
        sanitized[key] = '[hidden]';
        continue;
      }

      sanitized[key] = value;
    }

    return sanitized;
  }
}