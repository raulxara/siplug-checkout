import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GatewayDefinition,
  SettingField,
} from '../entities/gateway-setting.entity';
const field = (
  key: string,
  label: string,
  secret = false,
  required = true,
): SettingField => ({ key, label, secret, required });
@Injectable()
export class GatewayDefinitionService {
  resolve(provider: string): GatewayDefinition {
    const key = provider.toLowerCase().replace(/[^a-z0-9]/g, '');
    const shared =
      'Disponibilidade sujeita à habilitação da conta no provedor.';
    const definitions: Record<string, GatewayDefinition> = {
      mercadopago: {
        provider: 'mercadopago',
        fields: [
          field('token', 'Access Token', true),
          field('webhookSecret', 'Segredo do webhook', true),
        ],
        modes: ['one_time', 'recurring', 'split'],
        notice:
          shared +
          ' Split avulso usa comissão de marketplace; requer a credencial OAuth do vendedor.',
      },
      infinitepay: {
        provider: 'infinitepay',
        fields: [field('handle', 'Identificador InfinitePay (handle)')],
        modes: ['one_time'],
        notice:
          'Somente link avulso. Este adaptador usa o endpoint real da InfinitePay, sem sandbox isolado. Recorrência e split não estão implementados neste fluxo.',
      },
      pagseguro: {
        provider: 'pagseguro',
        fields: [field('token', 'Token de acesso', true)],
        modes: ['one_time'],
        notice:
          'O checkout hospedado atual oferece pagamento avulso. Recorrência e split existentes usam outros fluxos e não estão habilitados aqui.',
      },
      stripe: {
        provider: 'stripe',
        fields: [
          field('token', 'Secret Key', true),
          field('webhookSecret', 'Signing secret do webhook (whsec_)', true),
        ],
        modes: ['one_time', 'recurring', 'split', 'split_recurring'],
        notice:
          shared +
          ' Split recorrente: plataforma e uma conta conectada; recebedores são definidos na cobrança.',
      },
      paypal: {
        provider: 'paypal',
        fields: [
          field('clientId', 'Client ID'),
          field('token', 'Client Secret', true),
          field('paypalWebhookId', 'Webhook ID'),
        ],
        modes: ['one_time', 'recurring'],
        notice: shared + ' Split ainda não está implementado.',
      },
      picpay: {
        provider: 'picpay',
        fields: [
          field('clientId', 'Client ID'),
          field('token', 'Client Secret', true),
          field(
            'webhookToken',
            'API Key do webhook (gerada no painel PicPay)',
            true,
          ),
        ],
        modes: ['one_time'],
        notice:
          'Link de pagamento avulso. A recorrência atual exige tokenização de cartão; não é oferecida neste checkout hospedado.',
      },
    };
    const canonical =
      (
        { infinitypay: 'infinitepay', pagbank: 'pagseguro' } as Record<
          string,
          string
        >
      )[key] ?? key;
    if (!definitions[canonical])
      return {
        provider: canonical,
        fields: [],
        modes: [],
        notice:
          'Configuração hospedada ainda não implementada para este gateway.',
      };
    return definitions[canonical];
  }
}
