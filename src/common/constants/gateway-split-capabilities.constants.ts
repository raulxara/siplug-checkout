export const GATEWAY_SPLIT_MODE = {
  SEPARATE_CHARGES_AND_TRANSFERS: 'separate_charges_and_transfers',
  NATIVE_SPLIT: 'native_split',
  PARTNER_MULTIPARTY: 'partner_multiparty',
  NOT_AVAILABLE: 'not_available',
  UNKNOWN: 'unknown',
} as const;

export type GatewaySplitMode =
  (typeof GATEWAY_SPLIT_MODE)[keyof typeof GATEWAY_SPLIT_MODE];

export type GatewaySplitCapability = {
  provider: string;

  supportsSplit: boolean;
  supportsAutomaticWebhookDispatch: boolean;
  supportsManualRetry: boolean;
  supportsManualReconciliation: boolean;
  supportsTransferReversal: boolean;
  supportsRetainedPlatformCommission: boolean;

  requiresSourceTransactionId: boolean;
  requiresDestinationAccountId: boolean;
  supportsPartialTransfer: boolean;
  supportsPartialReversal: boolean;

  splitMode: GatewaySplitMode;

  productionValidated: boolean;
  notes: string;
};

export const GATEWAY_SPLIT_CAPABILITIES = {
  stripe: {
    provider: 'stripe',

    supportsSplit: true,
    supportsAutomaticWebhookDispatch: true,
    supportsManualRetry: true,
    supportsManualReconciliation: true,
    supportsTransferReversal: true,
    supportsRetainedPlatformCommission: true,

    requiresSourceTransactionId: true,
    requiresDestinationAccountId: true,
    supportsPartialTransfer: true,
    supportsPartialReversal: true,

    splitMode: GATEWAY_SPLIT_MODE.SEPARATE_CHARGES_AND_TRANSFERS,

    productionValidated: true,
    notes:
      'Validated with charge.succeeded, producer transfer, retained platform commission, reconciliation and transfer reversal.',
  },

  mercado_pago: {
    provider: 'mercado_pago',

    supportsSplit: true,
    supportsAutomaticWebhookDispatch: false,
    supportsManualRetry: false,
    supportsManualReconciliation: false,
    supportsTransferReversal: false,
    supportsRetainedPlatformCommission: false,

    requiresSourceTransactionId: false,
    requiresDestinationAccountId: true,
    supportsPartialTransfer: false,
    supportsPartialReversal: false,

    splitMode: GATEWAY_SPLIT_MODE.NATIVE_SPLIT,

    productionValidated: false,
    notes:
      'Initial capability placeholder. Enable each capability only after implementation and test validation.',
  },

  pagseguro: {
    provider: 'pagseguro',

    supportsSplit: true,
    supportsAutomaticWebhookDispatch: false,
    supportsManualRetry: false,
    supportsManualReconciliation: false,
    supportsTransferReversal: false,
    supportsRetainedPlatformCommission: false,

    requiresSourceTransactionId: false,
    requiresDestinationAccountId: true,
    supportsPartialTransfer: false,
    supportsPartialReversal: false,

    splitMode: GATEWAY_SPLIT_MODE.NATIVE_SPLIT,

    productionValidated: false,
    notes:
      'Initial capability placeholder. Enable each capability only after implementation and test validation.',
  },

  picpay: {
    provider: 'picpay',

    supportsSplit: true,
    supportsAutomaticWebhookDispatch: false,
    supportsManualRetry: false,
    supportsManualReconciliation: false,
    supportsTransferReversal: false,
    supportsRetainedPlatformCommission: false,

    requiresSourceTransactionId: false,
    requiresDestinationAccountId: true,
    supportsPartialTransfer: false,
    supportsPartialReversal: false,

    splitMode: GATEWAY_SPLIT_MODE.NATIVE_SPLIT,

    productionValidated: false,
    notes:
      'Initial capability placeholder. Enable each capability only after implementation and test validation.',
  },

  paypal: {
    provider: 'paypal',

    supportsSplit: true,
    supportsAutomaticWebhookDispatch: false,
    supportsManualRetry: false,
    supportsManualReconciliation: false,
    supportsTransferReversal: false,
    supportsRetainedPlatformCommission: false,

    requiresSourceTransactionId: false,
    requiresDestinationAccountId: true,
    supportsPartialTransfer: false,
    supportsPartialReversal: false,

    splitMode: GATEWAY_SPLIT_MODE.PARTNER_MULTIPARTY,

    productionValidated: false,
    notes:
      'Initial capability placeholder. Enable each capability only after implementation and test validation.',
  },

  infinitepay: {
    provider: 'infinitepay',

    supportsSplit: false,
    supportsAutomaticWebhookDispatch: false,
    supportsManualRetry: false,
    supportsManualReconciliation: false,
    supportsTransferReversal: false,
    supportsRetainedPlatformCommission: false,

    requiresSourceTransactionId: false,
    requiresDestinationAccountId: false,
    supportsPartialTransfer: false,
    supportsPartialReversal: false,

    splitMode: GATEWAY_SPLIT_MODE.NOT_AVAILABLE,

    productionValidated: false,
    notes:
      'Split support is disabled until implementation and gateway validation.',
  },
} as const satisfies Record<string, GatewaySplitCapability>;

export type GatewaySplitProvider = keyof typeof GATEWAY_SPLIT_CAPABILITIES;

export function getGatewaySplitCapability(
  provider: string,
): GatewaySplitCapability {
  const normalizedProvider = provider.trim().toLowerCase();

  const capability =
    GATEWAY_SPLIT_CAPABILITIES[
      normalizedProvider as GatewaySplitProvider
    ];

  if (!capability) {
    return {
      provider: normalizedProvider,

      supportsSplit: false,
      supportsAutomaticWebhookDispatch: false,
      supportsManualRetry: false,
      supportsManualReconciliation: false,
      supportsTransferReversal: false,
      supportsRetainedPlatformCommission: false,

      requiresSourceTransactionId: false,
      requiresDestinationAccountId: false,
      supportsPartialTransfer: false,
      supportsPartialReversal: false,

      splitMode: GATEWAY_SPLIT_MODE.UNKNOWN,

      productionValidated: false,
      notes: 'Gateway split capability not configured.',
    };
  }

  return capability;
}

export function assertGatewaySupportsSplit(provider: string): void {
  const capability = getGatewaySplitCapability(provider);

  if (!capability.supportsSplit) {
    throw new Error(`gateway does not support split: ${provider}`);
  }
}

export function assertGatewaySupportsTransferReversal(provider: string): void {
  const capability = getGatewaySplitCapability(provider);

  if (!capability.supportsTransferReversal) {
    throw new Error(`gateway does not support transfer reversal: ${provider}`);
  }
}

export function assertGatewaySupportsManualReconciliation(provider: string): void {
  const capability = getGatewaySplitCapability(provider);

  if (!capability.supportsManualReconciliation) {
    throw new Error(`gateway does not support manual reconciliation: ${provider}`);
  }
}