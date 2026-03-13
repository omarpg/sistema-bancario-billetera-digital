-- =============================================
-- Billetera Digital - Schema para Supabase
-- PostgreSQL 16+
-- 
-- IMPORTANTE: Ejecutar en SQL Editor de Supabase
-- Este script NO elimina tablas existentes
-- =============================================

-- =============================================
-- CREAR TIPOS ENUM (si no existen)
-- =============================================

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('VISTA', 'CORRIENTE', 'AHORRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('TRANSFER', 'SECURITY', 'SYSTEM', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE otp_purpose AS ENUM ('LOGIN', 'TRANSFER', 'PASSWORD_RESET', 'ACCOUNT_VERIFICATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- CREAR SECUENCIAS (si no existen)
-- =============================================

DO $$ BEGIN
    CREATE SEQUENCE IF NOT EXISTS audit_logs_id_seq START 1;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE SEQUENCE IF NOT EXISTS transactions_operation_number_seq START 1000000001;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- =============================================
-- TABLA: users
-- =============================================

CREATE TABLE IF NOT EXISTS users (
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

CREATE INDEX IF NOT EXISTS idx_users_rut ON users(rut);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================
-- TABLA: accounts
-- =============================================

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    type account_type NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(5) NOT NULL,
    status account_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- =============================================
-- TABLA: contacts
-- =============================================

CREATE TABLE IF NOT EXISTS contacts (
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

CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts(owner_user_id);

-- =============================================
-- TABLA: transactions
-- =============================================

CREATE TABLE IF NOT EXISTS transactions (
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

CREATE INDEX IF NOT EXISTS idx_transactions_source ON transactions(source_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dest ON transactions(dest_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);

-- =============================================
-- TABLA: otp_codes
-- =============================================

CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    purpose otp_purpose NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (now() + interval '5 minutes'),
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_active ON otp_codes(user_id, purpose, expires_at) WHERE (is_used = false);

-- =============================================
-- TABLA: notifications
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_transaction_id UUID REFERENCES transactions(id) ON DELETE NO ACTION,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE (is_read = false);
CREATE INDEX IF NOT EXISTS idx_notifications_related_transaction ON notifications(related_transaction_id) WHERE (related_transaction_id IS NOT NULL);

-- =============================================
-- TABLA: currency_rates
-- =============================================

CREATE TABLE IF NOT EXISTS currency_rates (
    code VARCHAR(10) PRIMARY KEY,
    value NUMERIC NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- =============================================
-- TABLA: audit_logs
-- =============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY DEFAULT nextval('audit_logs_id_seq'),
    user_id UUID REFERENCES users(id) ON DELETE NO ACTION,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action_created ON audit_logs(action, created_at DESC);

-- =============================================

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Usuario Demo
-- Email: demo@billetera.com
-- Contraseña: pass1234
-- RUT: 14.929.968-8
INSERT INTO users (user_id, rut, full_name, email, password_hash, two_factor_enabled, last_password_change, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '149299688',
    'Usuario Demo',
    'demo@billetera.com',
    '$2a$12$R42XIwkRmycfSAEK5gxSyurAmfnIyT84D/STifGyatv2LaHgChS12',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Cuentas del Usuario Demo
INSERT INTO accounts (id, user_id, account_number, type, status, balance, currency, created_at, updated_at)
VALUES 
    (
        '660e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440000',
        '1234567890',
        'VISTA',
        'ACTIVE',
        500000.00,
        'CLP',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '660e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440000',
        '0987654321',
        'CORRIENTE',
        'ACTIVE',
        1000000.00,
        'CLP',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Contactos del Usuario Demo
INSERT INTO contacts (user_id, full_name, rut, bank_name, account_number, account_type, email, created_at, updated_at)
VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Juan Pérez',
        '50955745',
        'Banco de Chile',
        '1111111111',
        'VISTA',
        'juan.perez@email.com',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'María González',
        '103003555',
        'Banco Estado',
        '2222222222',
        'CORRIENTE',
        'maria.gonzalez@email.com',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Transacción de prueba
INSERT INTO transactions (source_account_id, dest_account_id, operation_number, type, status, amount, description, created_at)
VALUES (
    '660e8400-e29b-41d4-a716-446655440002',
    NULL,
    1000000001,
    'TRANSFER',
    'COMPLETED',
    50000.00,
    'Transferencia de prueba',
    CURRENT_TIMESTAMP
);

-- Indicadores económicos
INSERT INTO currency_rates (code, value, updated_at)
VALUES 
    ('UF', 37500.00, CURRENT_TIMESTAMP),
    ('USD', 950.00, CURRENT_TIMESTAMP),
    ('EUR', 1020.00, CURRENT_TIMESTAMP);

-- Notificaciones del Usuario Demo
INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'SYSTEM',
        'Bienvenido',
        'Bienvenido a Billetera Digital. Tu cuenta ha sido creada exitosamente.',
        true,
        CURRENT_TIMESTAMP
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'TRANSFER',
        'Transferencia realizada',
        'Transferencia de $50,000 realizada exitosamente.',
        false,
        CURRENT_TIMESTAMP
    );

-- =============================================
-- VERIFICACIÓN
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'BASE DE DATOS CREADA EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tablas creadas: 8';
    RAISE NOTICE 'Indicadores económicos inicializados: 3';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;