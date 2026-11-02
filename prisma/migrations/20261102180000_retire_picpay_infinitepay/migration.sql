-- Preserve historical payment references; retire these providers from new operations.
UPDATE api_credentials SET status = 'inactive', updated_at = CURRENT_TIMESTAMP(3)
WHERE gateway_id IN (SELECT _id FROM gateways WHERE provider IN ('picpay', 'infinitepay', 'infinitypay', 'infinity_pay', 'infinite_pay')) AND status <> 'inactive';
UPDATE gateways SET status = 'inactive', updated_at = CURRENT_TIMESTAMP(3)
WHERE provider IN ('picpay', 'infinitepay', 'infinitypay', 'infinity_pay', 'infinite_pay') AND status <> 'inactive';
