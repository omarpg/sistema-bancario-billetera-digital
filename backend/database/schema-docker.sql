-- =============================================
-- Billetera Digital - Schema Docker
-- PostgreSQL 16+
-- =============================================

-- =============================================
-- LIMPIAR BASE DE DATOS
-- =============================================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS currency_rates CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS account_type CASCADE;
DROP TYPE IF EXISTS account_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS otp_purpose CASCADE;

-- Eliminar secuencias si existen
DROP SEQUENCE IF EXISTS audit_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS transactions_operation_number_seq CASCADE;

-- =============================================
-- CREAR TIPOS ENUM
-- =============================================

CREATE TYPE account_type AS ENUM ('VISTA', 'CORRIENTE', 'AHORRO');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
CREATE TYPE transaction_type AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED');
CREATE TYPE notification_type AS ENUM ('TRANSFER', 'SECURITY', 'SYSTEM', 'GENERAL');
CREATE TYPE otp_purpose AS ENUM ('LOGIN', 'TRANSFER', 'PASSWORD_RESET', 'ACCOUNT_VERIFICATION');

-- =============================================
-- CREAR SECUENCIAS
-- =============================================

CREATE SEQUENCE audit_logs_id_seq START 1;
CREATE SEQUENCE transactions_operation_number_seq START 1000000001;

-- =============================================
-- TABLA: users
-- =============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rut VARCHAR(12) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone VARCHAR(15),
    totp_secret VARCHAR(64),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    last_password_change TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_rut ON users(rut);
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- TABLA: accounts
-- =============================================

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    type account_type NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(5) NOT NULL,
    status account_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- =============================================
-- TABLA: contacts
-- =============================================

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(30) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_contacts_owner ON contacts(owner_user_id);

-- =============================================
-- TABLA: transactions
-- =============================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account_id UUID REFERENCES accounts(id) ON DELETE NO ACTION,
    dest_account_id UUID REFERENCES accounts(id) ON DELETE NO ACTION,
    amount NUMERIC NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'PENDING',
    description TEXT,
    operation_number INTEGER NOT NULL DEFAULT nextval('transactions_operation_number_seq') UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_source ON transactions(source_account_id);
CREATE INDEX idx_transactions_dest ON transactions(dest_account_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- =============================================
-- TABLA: otp_codes
-- =============================================

CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    purpose otp_purpose NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (now() + interval '5 minutes'),
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_otp_active ON otp_codes(user_id, purpose, expires_at) WHERE (is_used = false);

-- =============================================
-- TABLA: notifications
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_transaction_id UUID REFERENCES transactions(id) ON DELETE NO ACTION,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE (is_read = false);
CREATE INDEX idx_notifications_related_transaction ON notifications(related_transaction_id) WHERE (related_transaction_id IS NOT NULL);

-- =============================================
-- TABLA: currency_rates
-- =============================================

CREATE TABLE currency_rates (
    code VARCHAR(10) PRIMARY KEY,
    value NUMERIC NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- =============================================
-- TABLA: audit_logs
-- =============================================

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY DEFAULT nextval('audit_logs_id_seq'),
    user_id UUID REFERENCES users(id) ON DELETE NO ACTION,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_action_created ON audit_logs(action, created_at DESC);

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Usuario Demo
-- Email: demo@billetera.com
-- Contraseña: pass1234
-- RUT: 13.254.122-1
INSERT INTO users (id, rut, full_name, email, password_hash, two_factor_enabled, last_password_change, created_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '132541221',
    'Usuario Demo',
    'demo@billetera.com',
    '$2a$12$R42XIwkRmycfSAEK5gxSyurAmfnIyT84D/STifGyatv2LaHgChS12',
    false,
    now(),
    now()
);

-- Cuentas del Usuario Demo
INSERT INTO accounts (id, user_id, account_number, type, balance, currency, status, created_at)
VALUES 
    (
        '660e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440000',
        '1234567890',
        'VISTA',
        500000.00,
        'CLP',
        'ACTIVE',
        now()
    ),
    (
        '660e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440000',
        '0987654321',
        'CORRIENTE',
        1000000.00,
        'CLP',
        'ACTIVE',
        now()
    );

-- Contactos del Usuario Demo
INSERT INTO contacts (owner_user_id, full_name, rut, bank_name, account_number, account_type, email, created_at)
VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Juan Pérez',
        '196741291',
        'Banco de Chile',
        '1111111111',
        'VISTA',
        'juan.perez@email.com',
        now()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'María González',
        '201015944',
        'Banco Estado',
        '2222222222',
        'CORRIENTE',
        'maria.gonzalez@email.com',
        now()
    );

-- Indicadores económicos
INSERT INTO currency_rates (code, value, updated_at)
VALUES 
    ('UF', 37500.00, now()),
    ('USD', 950.00, now()),
    ('EUR', 1020.00, now());

-- Notificaciones del Usuario Demo
INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'SYSTEM',
        'Bienvenido',
        'Bienvenido a Billetera Digital. Tu cuenta ha sido creada exitosamente.',
        true,
        now()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'SYSTEM',
        'Cuenta Vista creada',
        'Se ha creado tu cuenta vista con saldo inicial de $500,000.',
        false,
        now()
    );

-- =============================================
-- VERIFICACIÓN
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '  BASE DE DATOS INICIALIZADA (DOCKER)  ';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Tablas creadas:';
    RAISE NOTICE '  - users: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE '  - accounts: %', (SELECT COUNT(*) FROM accounts);
    RAISE NOTICE '  - contacts: %', (SELECT COUNT(*) FROM contacts);
    RAISE NOTICE '  - notifications: %', (SELECT COUNT(*) FROM notifications);
    RAISE NOTICE '  - currency_rates: %', (SELECT COUNT(*) FROM currency_rates);
    RAISE NOTICE '  - audit_logs: %', (SELECT COUNT(*) FROM audit_logs);
    RAISE NOTICE '  - transactions: %', (SELECT COUNT(*) FROM transactions);
        RAISE NOTICE '  - otp_codes: %', (SELECT COUNT(*) FROM otp_codes);
        RAISE NOTICE 'Indicadores económicos inicializados:';
        RAISE NOTICE '  - UF: $%0.2f', (SELECT value FROM currency_rates WHERE code = 'UF');
        RAISE NOTICE '  - USD: $%0.2f', (SELECT value FROM currency_rates WHERE code = 'USD');
        RAISE NOTICE '  - EUR: $%0.2f', (SELECT value FROM currency_rates WHERE code = 'EUR');
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;