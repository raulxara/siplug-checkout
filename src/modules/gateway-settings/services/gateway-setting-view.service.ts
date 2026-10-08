import { GatewayPaymentMethodsService } from './gateway-payment-methods.service';
import { GatewayPaymentModesService } from './gateway-payment-modes.service';
import { Injectable } from '@nestjs/common';
import { ApiCredential, Gateway } from '@prisma/client';
import {
  Environment,
  PaymentMode,
  PublicGatewaySetting,
} from '../entities/gateway-setting.entity';
import { GatewayDefinitionService } from './gateway-definition.service';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
@Injectable()
export class GatewaySettingViewService {
  constructor(
    private readonly definitions: GatewayDefinitionService,
    private readonly security: GatewaySettingSecurityService,
  ) {}
  build(gateway: Gateway, rows: ApiCredential[]): PublicGatewaySetting {
    const definition = this.definitions.resolve(gateway.provider);
    return {
      gatewayId: gateway.unique_id,
      name: gateway.name,
      provider: definition.provider,
      definition,
      supportedPaymentMethods: GatewayPaymentMethodsService.supported(
        gateway.config,
      ),
      credentials: rows
        .filter((r) => r.gateway_id === gateway.unique_id)
        .map((row) => {
          const c = (row.config ?? {}) as Record<string, unknown>;
          const env =
            (c.environment ?? row.environment) === 'production'
              ? 'production'
              : 'sandbox';
          const values: Record<string, string> = {};
          const configuredSecrets: string[] = [];
          for (const f of definition.fields) {
            const value = f.key === 'token' ? row.token : c[f.key];
            if (f.secret) {
              if (value) configuredSecrets.push(f.key);
            } else if (typeof value === 'string') values[f.key] = value;
          }
          const modes = GatewayPaymentModesService.enabled(c).filter((mode) =>
            definition.modes.includes(mode),
          );
          return {
            id: row.unique_id,
            environment: env as Environment,
            status: row.status,
            values,
            configuredSecrets,
            modes,
            paymentMethods: GatewayPaymentMethodsService.selected(
              gateway.config,
              c,
            ),
            defaultModes: Array.isArray(c.defaultModes)
              ? (c.defaultModes.filter((m) =>
                  modes.includes(m as PaymentMode),
                ) as PaymentMode[])
              : [],
            urls: this.security.urls(definition.provider, env, row.unique_id),
            version: row.updated_at.toISOString(),
            connectionStatus:
              typeof c.connectionStatus === 'string'
                ? c.connectionStatus
                : 'not_tested',
          };
        }),
    };
  }
}
