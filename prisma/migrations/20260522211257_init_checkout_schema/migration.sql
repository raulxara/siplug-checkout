-- CreateTable
CREATE TABLE `offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `language` VARCHAR(20) NULL,
    `currency` VARCHAR(10) NULL,
    `address_street` VARCHAR(255) NULL,
    `address_number` VARCHAR(100) NULL,
    `address_complement` VARCHAR(255) NULL,
    `address_neighborhood` VARCHAR(255) NULL,
    `address_city` VARCHAR(150) NULL,
    `address_state` VARCHAR(100) NULL,
    `address_country` VARCHAR(100) NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `offices__id_key`(`_id`),
    INDEX `offices_slug_idx`(`slug`),
    INDEX `offices_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `document_type` VARCHAR(50) NULL,
    `document_value` VARCHAR(100) NULL,
    `address_street` VARCHAR(255) NULL,
    `address_number` VARCHAR(100) NULL,
    `address_complement` VARCHAR(255) NULL,
    `address_neighborhood` VARCHAR(255) NULL,
    `address_city` VARCHAR(150) NULL,
    `address_state` VARCHAR(100) NULL,
    `address_country` VARCHAR(100) NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles__id_key`(`_id`),
    INDEX `profiles_email_idx`(`email`),
    INDEX `profiles_document_type_document_value_idx`(`document_type`, `document_value`),
    INDEX `profiles_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NULL,
    `customer_id` CHAR(36) NULL,
    `user_type` VARCHAR(100) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clients__id_key`(`_id`),
    INDEX `clients_office_id_idx`(`office_id`),
    INDEX `clients_customer_id_idx`(`customer_id`),
    INDEX `clients_username_idx`(`username`),
    INDEX `clients_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `office_employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `profile_id` CHAR(36) NOT NULL,
    `user_position_id` CHAR(36) NULL,
    `role` VARCHAR(100) NULL,
    `two_fa_required` BOOLEAN NOT NULL DEFAULT false,
    `two_fa_active` BOOLEAN NOT NULL DEFAULT false,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `office_employees__id_key`(`_id`),
    INDEX `office_employees_office_id_idx`(`office_id`),
    INDEX `office_employees_profile_id_idx`(`profile_id`),
    INDEX `office_employees_user_position_id_idx`(`user_position_id`),
    INDEX `office_employees_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `profile_id` CHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `two_fa_required` BOOLEAN NOT NULL DEFAULT false,
    `two_fa_active` BOOLEAN NOT NULL DEFAULT false,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_customers__id_key`(`_id`),
    UNIQUE INDEX `user_customers_token_key`(`token`),
    INDEX `user_customers_client_id_idx`(`client_id`),
    INDEX `user_customers_profile_id_idx`(`profile_id`),
    INDEX `user_customers_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_access_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `sent_to` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'sent',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_access_codes__id_key`(`_id`),
    UNIQUE INDEX `user_access_codes_code_key`(`code`),
    INDEX `user_access_codes_user_id_idx`(`user_id`),
    INDEX `user_access_codes_type_idx`(`type`),
    INDEX `user_access_codes_expires_at_idx`(`expires_at`),
    INDEX `user_access_codes_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `positions__id_key`(`_id`),
    INDEX `positions_status_idx`(`status`),
    UNIQUE INDEX `positions_office_id_slug_key`(`office_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `entity` VARCHAR(150) NOT NULL,
    `action` VARCHAR(150) NOT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions__id_key`(`_id`),
    INDEX `permissions_entity_idx`(`entity`),
    INDEX `permissions_action_idx`(`action`),
    INDEX `permissions_status_idx`(`status`),
    UNIQUE INDEX `permissions_office_id_slug_key`(`office_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position_permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `position_id` CHAR(36) NOT NULL,
    `permission_id` CHAR(36) NOT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `position_permission__id_key`(`_id`),
    INDEX `position_permission_status_idx`(`status`),
    UNIQUE INDEX `position_permission_position_id_permission_id_key`(`position_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `user_customer_id` CHAR(36) NOT NULL,
    `position_id` CHAR(36) NOT NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_position__id_key`(`_id`),
    INDEX `user_position_status_idx`(`status`),
    UNIQUE INDEX `user_position_user_customer_id_position_id_key`(`user_customer_id`, `position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gateways` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `capabilities` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gateways__id_key`(`_id`),
    UNIQUE INDEX `gateways_slug_key`(`slug`),
    INDEX `gateways_provider_idx`(`provider`),
    INDEX `gateways_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_credentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NULL,
    `client_id` CHAR(36) NULL,
    `gateway_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `provider_type` VARCHAR(100) NOT NULL,
    `environment` VARCHAR(50) NOT NULL DEFAULT 'sandbox',
    `token` TEXT NULL,
    `origin` VARCHAR(255) NULL,
    `config` JSON NULL,
    `expires_at` DATETIME(3) NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `api_credentials__id_key`(`_id`),
    INDEX `api_credentials_client_id_idx`(`client_id`),
    INDEX `api_credentials_gateway_id_idx`(`gateway_id`),
    INDEX `api_credentials_provider_idx`(`provider`),
    INDEX `api_credentials_provider_type_idx`(`provider_type`),
    INDEX `api_credentials_environment_idx`(`environment`),
    INDEX `api_credentials_status_idx`(`status`),
    UNIQUE INDEX `api_credentials_office_id_slug_key`(`office_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `profile_id` CHAR(36) NULL,
    `external_reference` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `document_type` VARCHAR(50) NULL,
    `document_value` VARCHAR(100) NULL,
    `phone` VARCHAR(50) NULL,
    `billing_address` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_customers__id_key`(`_id`),
    INDEX `payment_customers_office_id_idx`(`office_id`),
    INDEX `payment_customers_client_id_idx`(`client_id`),
    INDEX `payment_customers_profile_id_idx`(`profile_id`),
    INDEX `payment_customers_email_idx`(`email`),
    INDEX `payment_customers_document_type_document_value_idx`(`document_type`, `document_value`),
    INDEX `payment_customers_external_reference_idx`(`external_reference`),
    INDEX `payment_customers_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `payment_customer_id` CHAR(36) NULL,
    `gateway_id` CHAR(36) NOT NULL,
    `api_credential_id` CHAR(36) NULL,
    `code` VARCHAR(150) NULL,
    `external_reference` VARCHAR(255) NULL,
    `idempotency_key` VARCHAR(255) NULL,
    `payment_type` VARCHAR(50) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `description` TEXT NULL,
    `success_url` TEXT NULL,
    `cancel_url` TEXT NULL,
    `expires_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `checkout_sessions__id_key`(`_id`),
    INDEX `checkout_sessions_office_id_idx`(`office_id`),
    INDEX `checkout_sessions_client_id_idx`(`client_id`),
    INDEX `checkout_sessions_payment_customer_id_idx`(`payment_customer_id`),
    INDEX `checkout_sessions_gateway_id_idx`(`gateway_id`),
    INDEX `checkout_sessions_api_credential_id_idx`(`api_credential_id`),
    INDEX `checkout_sessions_code_idx`(`code`),
    INDEX `checkout_sessions_external_reference_idx`(`external_reference`),
    INDEX `checkout_sessions_idempotency_key_idx`(`idempotency_key`),
    INDEX `checkout_sessions_payment_type_idx`(`payment_type`),
    INDEX `checkout_sessions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_session_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `checkout_session_id` CHAR(36) NOT NULL,
    `item_ref` VARCHAR(255) NULL,
    `item_type` VARCHAR(100) NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unit_amount` INTEGER NOT NULL,
    `total_amount` INTEGER NOT NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `checkout_session_items__id_key`(`_id`),
    INDEX `checkout_session_items_checkout_session_id_idx`(`checkout_session_id`),
    INDEX `checkout_session_items_item_ref_idx`(`item_ref`),
    INDEX `checkout_session_items_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `checkout_session_id` CHAR(36) NULL,
    `payment_customer_id` CHAR(36) NULL,
    `gateway_id` CHAR(36) NOT NULL,
    `api_credential_id` CHAR(36) NULL,
    `gateway_transaction_id` VARCHAR(255) NULL,
    `external_reference` VARCHAR(255) NULL,
    `idempotency_key` VARCHAR(255) NULL,
    `payment_type` VARCHAR(50) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `installments` INTEGER NULL,
    `installment_amount` INTEGER NULL,
    `interest_amount` INTEGER NULL,
    `interest_type` VARCHAR(50) NULL,
    `gateway_status` VARCHAR(100) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `process_status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `process_message` TEXT NULL,
    `provider_payload` JSON NULL,
    `provider_response` JSON NULL,
    `gateway_response` JSON NULL,
    `qr_code` TEXT NULL,
    `qr_code_base64` LONGTEXT NULL,
    `boleto_url` TEXT NULL,
    `checkout_url` TEXT NULL,
    `split_required` BOOLEAN NOT NULL DEFAULT false,
    `has_split` BOOLEAN NOT NULL DEFAULT false,
    `paid_at` DATETIME(3) NULL,
    `authorized_at` DATETIME(3) NULL,
    `canceled_at` DATETIME(3) NULL,
    `failed_at` DATETIME(3) NULL,
    `refunded_at` DATETIME(3) NULL,
    `expires_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transactions__id_key`(`_id`),
    INDEX `payment_transactions_office_id_idx`(`office_id`),
    INDEX `payment_transactions_client_id_idx`(`client_id`),
    INDEX `payment_transactions_checkout_session_id_idx`(`checkout_session_id`),
    INDEX `payment_transactions_payment_customer_id_idx`(`payment_customer_id`),
    INDEX `payment_transactions_gateway_id_idx`(`gateway_id`),
    INDEX `payment_transactions_api_credential_id_idx`(`api_credential_id`),
    INDEX `payment_transactions_gateway_transaction_id_idx`(`gateway_transaction_id`),
    INDEX `payment_transactions_external_reference_idx`(`external_reference`),
    INDEX `payment_transactions_idempotency_key_idx`(`idempotency_key`),
    INDEX `payment_transactions_payment_method_idx`(`payment_method`),
    INDEX `payment_transactions_payment_type_idx`(`payment_type`),
    INDEX `payment_transactions_status_idx`(`status`),
    INDEX `payment_transactions_process_status_idx`(`process_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transaction_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `payment_transaction_id` CHAR(36) NOT NULL,
    `event_type` VARCHAR(150) NOT NULL,
    `old_status` VARCHAR(100) NULL,
    `new_status` VARCHAR(100) NULL,
    `payload` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transaction_events__id_key`(`_id`),
    INDEX `payment_transaction_events_payment_transaction_id_idx`(`payment_transaction_id`),
    INDEX `payment_transaction_events_event_type_idx`(`event_type`),
    INDEX `payment_transaction_events_old_status_idx`(`old_status`),
    INDEX `payment_transaction_events_new_status_idx`(`new_status`),
    INDEX `payment_transaction_events_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_webhooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `gateway_id` CHAR(36) NOT NULL,
    `api_credential_id` CHAR(36) NULL,
    `payment_transaction_id` CHAR(36) NULL,
    `external_event_id` VARCHAR(255) NULL,
    `event_type` VARCHAR(150) NULL,
    `headers` JSON NULL,
    `payload` JSON NULL,
    `signature` TEXT NULL,
    `processed_at` DATETIME(3) NULL,
    `processing_error` LONGTEXT NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'received',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_webhooks__id_key`(`_id`),
    INDEX `payment_webhooks_gateway_id_idx`(`gateway_id`),
    INDEX `payment_webhooks_api_credential_id_idx`(`api_credential_id`),
    INDEX `payment_webhooks_payment_transaction_id_idx`(`payment_transaction_id`),
    INDEX `payment_webhooks_external_event_id_idx`(`external_event_id`),
    INDEX `payment_webhooks_event_type_idx`(`event_type`),
    INDEX `payment_webhooks_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_refunds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `payment_transaction_id` CHAR(36) NOT NULL,
    `gateway_refund_id` VARCHAR(255) NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `reason` TEXT NULL,
    `provider_payload` JSON NULL,
    `provider_response` JSON NULL,
    `gateway_response` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_refunds__id_key`(`_id`),
    INDEX `payment_refunds_office_id_idx`(`office_id`),
    INDEX `payment_refunds_client_id_idx`(`client_id`),
    INDEX `payment_refunds_payment_transaction_id_idx`(`payment_transaction_id`),
    INDEX `payment_refunds_gateway_refund_id_idx`(`gateway_refund_id`),
    INDEX `payment_refunds_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_split_recipients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `gateway_id` CHAR(36) NULL,
    `api_credential_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `document_type` VARCHAR(50) NULL,
    `document_value` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `provider_recipient_id` VARCHAR(255) NULL,
    `bank_data` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_split_recipients__id_key`(`_id`),
    INDEX `payment_split_recipients_office_id_idx`(`office_id`),
    INDEX `payment_split_recipients_client_id_idx`(`client_id`),
    INDEX `payment_split_recipients_gateway_id_idx`(`gateway_id`),
    INDEX `payment_split_recipients_api_credential_id_idx`(`api_credential_id`),
    INDEX `payment_split_recipients_provider_recipient_id_idx`(`provider_recipient_id`),
    INDEX `payment_split_recipients_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_split_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `gateway_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `split_type` VARCHAR(50) NOT NULL,
    `is_required` BOOLEAN NOT NULL DEFAULT false,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_split_rules__id_key`(`_id`),
    INDEX `payment_split_rules_client_id_idx`(`client_id`),
    INDEX `payment_split_rules_gateway_id_idx`(`gateway_id`),
    INDEX `payment_split_rules_split_type_idx`(`split_type`),
    INDEX `payment_split_rules_status_idx`(`status`),
    UNIQUE INDEX `payment_split_rules_office_id_slug_key`(`office_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_split_rule_recipients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `payment_split_rule_id` CHAR(36) NOT NULL,
    `payment_split_recipient_id` CHAR(36) NOT NULL,
    `percentage` DECIMAL(10, 4) NULL,
    `fixed_amount` INTEGER NULL,
    `liable` BOOLEAN NOT NULL DEFAULT false,
    `charge_processing_fee` BOOLEAN NOT NULL DEFAULT false,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_split_rule_recipients__id_key`(`_id`),
    INDEX `payment_split_rule_recipients_status_idx`(`status`),
    UNIQUE INDEX `payment_split_rule_recipients_payment_split_rule_id_payment__key`(`payment_split_rule_id`, `payment_split_recipient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transaction_splits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `payment_transaction_id` CHAR(36) NOT NULL,
    `payment_split_rule_id` CHAR(36) NULL,
    `payment_split_recipient_id` CHAR(36) NOT NULL,
    `gateway_split_id` VARCHAR(255) NULL,
    `amount` INTEGER NOT NULL,
    `percentage` DECIMAL(10, 4) NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `provider_payload` JSON NULL,
    `provider_response` JSON NULL,
    `gateway_response` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transaction_splits__id_key`(`_id`),
    INDEX `payment_transaction_splits_payment_transaction_id_idx`(`payment_transaction_id`),
    INDEX `payment_transaction_splits_payment_split_rule_id_idx`(`payment_split_rule_id`),
    INDEX `payment_transaction_splits_payment_split_recipient_id_idx`(`payment_split_recipient_id`),
    INDEX `payment_transaction_splits_gateway_split_id_idx`(`gateway_split_id`),
    INDEX `payment_transaction_splits_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `gateway_id` CHAR(36) NULL,
    `api_credential_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `interval_type` VARCHAR(50) NOT NULL,
    `interval_count` INTEGER NOT NULL DEFAULT 1,
    `trial_days` INTEGER NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_plans__id_key`(`_id`),
    INDEX `subscription_plans_client_id_idx`(`client_id`),
    INDEX `subscription_plans_gateway_id_idx`(`gateway_id`),
    INDEX `subscription_plans_api_credential_id_idx`(`api_credential_id`),
    INDEX `subscription_plans_status_idx`(`status`),
    UNIQUE INDEX `subscription_plans_office_id_slug_key`(`office_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `subscription_plan_id` CHAR(36) NULL,
    `payment_customer_id` CHAR(36) NOT NULL,
    `gateway_id` CHAR(36) NULL,
    `api_credential_id` CHAR(36) NULL,
    `gateway_subscription_id` VARCHAR(255) NULL,
    `external_reference` VARCHAR(255) NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `current_cycle` INTEGER NOT NULL DEFAULT 0,
    `next_billing_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NULL,
    `canceled_at` DATETIME(3) NULL,
    `ended_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscriptions__id_key`(`_id`),
    INDEX `subscriptions_office_id_idx`(`office_id`),
    INDEX `subscriptions_client_id_idx`(`client_id`),
    INDEX `subscriptions_subscription_plan_id_idx`(`subscription_plan_id`),
    INDEX `subscriptions_payment_customer_id_idx`(`payment_customer_id`),
    INDEX `subscriptions_gateway_id_idx`(`gateway_id`),
    INDEX `subscriptions_api_credential_id_idx`(`api_credential_id`),
    INDEX `subscriptions_gateway_subscription_id_idx`(`gateway_subscription_id`),
    INDEX `subscriptions_external_reference_idx`(`external_reference`),
    INDEX `subscriptions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_cycles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `subscription_id` CHAR(36) NOT NULL,
    `cycle_number` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `period_start` DATETIME(3) NULL,
    `period_end` DATETIME(3) NULL,
    `scheduled_at` DATETIME(3) NULL,
    `processed_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_cycles__id_key`(`_id`),
    INDEX `subscription_cycles_subscription_id_idx`(`subscription_id`),
    INDEX `subscription_cycles_cycle_number_idx`(`cycle_number`),
    INDEX `subscription_cycles_scheduled_at_idx`(`scheduled_at`),
    INDEX `subscription_cycles_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `subscription_id` CHAR(36) NOT NULL,
    `subscription_cycle_id` CHAR(36) NULL,
    `payment_transaction_id` CHAR(36) NULL,
    `invoice_number` VARCHAR(100) NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'BRL',
    `due_at` DATETIME(3) NULL,
    `paid_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_invoices__id_key`(`_id`),
    INDEX `subscription_invoices_subscription_id_idx`(`subscription_id`),
    INDEX `subscription_invoices_subscription_cycle_id_idx`(`subscription_cycle_id`),
    INDEX `subscription_invoices_payment_transaction_id_idx`(`payment_transaction_id`),
    INDEX `subscription_invoices_invoice_number_idx`(`invoice_number`),
    INDEX `subscription_invoices_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `subscription_id` CHAR(36) NOT NULL,
    `event_type` VARCHAR(150) NOT NULL,
    `old_status` VARCHAR(100) NULL,
    `new_status` VARCHAR(100) NULL,
    `payload` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_events__id_key`(`_id`),
    INDEX `subscription_events_subscription_id_idx`(`subscription_id`),
    INDEX `subscription_events_event_type_idx`(`event_type`),
    INDEX `subscription_events_old_status_idx`(`old_status`),
    INDEX `subscription_events_new_status_idx`(`new_status`),
    INDEX `subscription_events_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_idempotency_keys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `idempotency_key` VARCHAR(255) NOT NULL,
    `request_hash` VARCHAR(255) NOT NULL,
    `resource_type` VARCHAR(100) NULL,
    `resource_id` CHAR(36) NULL,
    `response_payload` JSON NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_idempotency_keys__id_key`(`_id`),
    INDEX `payment_idempotency_keys_request_hash_idx`(`request_hash`),
    INDEX `payment_idempotency_keys_resource_type_idx`(`resource_type`),
    INDEX `payment_idempotency_keys_resource_id_idx`(`resource_id`),
    INDEX `payment_idempotency_keys_status_idx`(`status`),
    UNIQUE INDEX `payment_idempotency_keys_office_id_client_id_idempotency_key_key`(`office_id`, `client_id`, `idempotency_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `_id` CHAR(36) NOT NULL,
    `office_id` CHAR(36) NULL,
    `client_id` CHAR(36) NULL,
    `origin` VARCHAR(255) NULL,
    `request_headers` JSON NULL,
    `request_body` LONGTEXT NULL,
    `request_hash` VARCHAR(255) NULL,
    `processed_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `config` JSON NULL,
    `changes_history` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'created',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_requests__id_key`(`_id`),
    INDEX `payment_requests_office_id_idx`(`office_id`),
    INDEX `payment_requests_client_id_idx`(`client_id`),
    INDEX `payment_requests_origin_idx`(`origin`),
    INDEX `payment_requests_request_hash_idx`(`request_hash`),
    INDEX `payment_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `office_employees` ADD CONSTRAINT `office_employees_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `office_employees` ADD CONSTRAINT `office_employees_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_customers` ADD CONSTRAINT `user_customers_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_customers` ADD CONSTRAINT `user_customers_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_access_codes` ADD CONSTRAINT `user_access_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_customers`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `position_permission` ADD CONSTRAINT `position_permission_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `position_permission` ADD CONSTRAINT `position_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_position` ADD CONSTRAINT `user_position_user_customer_id_fkey` FOREIGN KEY (`user_customer_id`) REFERENCES `user_customers`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_position` ADD CONSTRAINT `user_position_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_credentials` ADD CONSTRAINT `api_credentials_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_credentials` ADD CONSTRAINT `api_credentials_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_credentials` ADD CONSTRAINT `api_credentials_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_customers` ADD CONSTRAINT `payment_customers_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_customers` ADD CONSTRAINT `payment_customers_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_customers` ADD CONSTRAINT `payment_customers_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_sessions` ADD CONSTRAINT `checkout_sessions_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_sessions` ADD CONSTRAINT `checkout_sessions_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_sessions` ADD CONSTRAINT `checkout_sessions_payment_customer_id_fkey` FOREIGN KEY (`payment_customer_id`) REFERENCES `payment_customers`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_sessions` ADD CONSTRAINT `checkout_sessions_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_sessions` ADD CONSTRAINT `checkout_sessions_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_session_items` ADD CONSTRAINT `checkout_session_items_checkout_session_id_fkey` FOREIGN KEY (`checkout_session_id`) REFERENCES `checkout_sessions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_checkout_session_id_fkey` FOREIGN KEY (`checkout_session_id`) REFERENCES `checkout_sessions`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_payment_customer_id_fkey` FOREIGN KEY (`payment_customer_id`) REFERENCES `payment_customers`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction_events` ADD CONSTRAINT `payment_transaction_events_payment_transaction_id_fkey` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_webhooks` ADD CONSTRAINT `payment_webhooks_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_webhooks` ADD CONSTRAINT `payment_webhooks_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_webhooks` ADD CONSTRAINT `payment_webhooks_payment_transaction_id_fkey` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_refunds` ADD CONSTRAINT `payment_refunds_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_refunds` ADD CONSTRAINT `payment_refunds_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_refunds` ADD CONSTRAINT `payment_refunds_payment_transaction_id_fkey` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_recipients` ADD CONSTRAINT `payment_split_recipients_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_recipients` ADD CONSTRAINT `payment_split_recipients_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_recipients` ADD CONSTRAINT `payment_split_recipients_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_recipients` ADD CONSTRAINT `payment_split_recipients_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_rules` ADD CONSTRAINT `payment_split_rules_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_rules` ADD CONSTRAINT `payment_split_rules_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_rules` ADD CONSTRAINT `payment_split_rules_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_rule_recipients` ADD CONSTRAINT `payment_split_rule_recipients_payment_split_rule_id_fkey` FOREIGN KEY (`payment_split_rule_id`) REFERENCES `payment_split_rules`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_split_rule_recipients` ADD CONSTRAINT `payment_split_rule_recipients_payment_split_recipient_id_fkey` FOREIGN KEY (`payment_split_recipient_id`) REFERENCES `payment_split_recipients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction_splits` ADD CONSTRAINT `payment_transaction_splits_payment_transaction_id_fkey` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction_splits` ADD CONSTRAINT `payment_transaction_splits_payment_split_rule_id_fkey` FOREIGN KEY (`payment_split_rule_id`) REFERENCES `payment_split_rules`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction_splits` ADD CONSTRAINT `payment_transaction_splits_payment_split_recipient_id_fkey` FOREIGN KEY (`payment_split_recipient_id`) REFERENCES `payment_split_recipients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_plans` ADD CONSTRAINT `subscription_plans_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_plans` ADD CONSTRAINT `subscription_plans_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_plans` ADD CONSTRAINT `subscription_plans_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_plans` ADD CONSTRAINT `subscription_plans_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_payment_customer_id_fkey` FOREIGN KEY (`payment_customer_id`) REFERENCES `payment_customers`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `gateways`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_api_credential_id_fkey` FOREIGN KEY (`api_credential_id`) REFERENCES `api_credentials`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_cycles` ADD CONSTRAINT `subscription_cycles_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_invoices` ADD CONSTRAINT `subscription_invoices_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_invoices` ADD CONSTRAINT `subscription_invoices_subscription_cycle_id_fkey` FOREIGN KEY (`subscription_cycle_id`) REFERENCES `subscription_cycles`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_invoices` ADD CONSTRAINT `subscription_invoices_payment_transaction_id_fkey` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_events` ADD CONSTRAINT `subscription_events_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_idempotency_keys` ADD CONSTRAINT `payment_idempotency_keys_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_idempotency_keys` ADD CONSTRAINT `payment_idempotency_keys_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `offices`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;
