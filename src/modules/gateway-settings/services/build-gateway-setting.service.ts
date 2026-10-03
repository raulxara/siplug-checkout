import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma, ApiCredential, Gateway } from '@prisma/client';
import { GatewayDefinition } from '../entities/gateway-setting.entity';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
import { SaveGatewaySettingDtoIn } from '../../../use-cases/gateway-settings/dtos/save-gateway-setting.dto-in';
@Injectable()
export class BuildGatewaySettingService {
  constructor(private readonly security: GatewaySettingSecurityService) {}
  exec(
    old: ApiCredential | null,
    actor: { officeId: string; userCustomerId: string },
    gateway: Gateway,
    definition: GatewayDefinition,
    input: SaveGatewaySettingDtoIn,
  ): Prisma.ApiCredentialUncheckedCreateInput {
    const gatewayId = gateway.unique_id;
    const id = old?.unique_id ?? randomUUID();
    const previous = (old?.config ?? {}) as Record<string, unknown>;
    const fields = this.security.fields(
      definition,
      input.fields,
      { ...previous, token: old?.token },
      input.status === 'active',
    );
    const tokenValue = fields.token as string | undefined;
    delete fields.token;
    // Only server-owned connection parameters and declared fields reach provider adapters.
    const config: Record<string, unknown> = {};
    for (const field of definition.fields)
      if (field.key !== 'token') config[field.key] = fields[field.key] ?? '';
    const types = [
      ...(input.modes.some((m) => m === 'one_time' || m === 'split')
        ? ['one_time', 'installment']
        : []),
      ...(input.modes.some((m) => m === 'recurring' || m === 'split_recurring')
        ? ['recurring']
        : []),
    ];
    Object.assign(
      config,
      this.security.urls(definition.provider, input.environment, id),
      {
        environment: input.environment,
        managedHosted: true,
        enabledModes: input.modes,
        defaultModes: input.status === 'active' ? input.defaultModes : [],
        paymentTypes: types,
        paymentMethods: ['payment_link'],
        useOAuth: true,
        webhookAuthMode: 'required',
        webhookSignatureMode: 'required',
        connectionStatus: 'not_tested',
      },
    );
    // Preserve unrelated metadata without copying arbitrary URL/secret aliases into provider config.
    if (Object.keys(previous).length && !previous.managedHosted)
      config.previousConfigurationEncrypted = this.security.encrypt(
        JSON.stringify(previous),
      );
    else if (previous.previousConfigurationEncrypted)
      config.previousConfigurationEncrypted =
        previous.previousConfigurationEncrypted;
    const history = Array.isArray(old?.changes_history)
      ? old.changes_history
      : [];
    return {
      unique_id: id,
      office_id: actor.officeId,
      client_id: null,
      gateway_id: gatewayId,
      name: gateway.name,
      slug: old?.slug ?? `hosted-${gatewayId}-${input.environment}`,
      provider: gateway.provider,
      provider_type: 'gateway',
      environment: input.environment,
      token: tokenValue ?? null,
      config: config as Prisma.InputJsonValue,
      status: input.status,
      changes_history: [
        ...history.slice(-99),
        {
          action: old ? 'updated' : 'created',
          actor: actor.userCustomerId,
          at: new Date().toISOString(),
          fields: Object.keys(input.fields),
        },
      ] as Prisma.InputJsonValue,
    };
  }
}
