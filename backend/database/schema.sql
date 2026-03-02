-- =============================================
-- Billetera Digital - Database Schema
-- PostgreSQL 16+
-- =============================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS currency_rates CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- Tabla: users
-- Almacena información de usuarios del sistema
-- =============================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rut VARCHAR(12) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    last_password_change TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_rut ON users(rut);
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- Tabla: accounts
-- Cuentas bancarias de los usuarios
-- =============================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('VISTA', 'CORRIENTE', 'AHORRO')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para accounts
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);

-- =============================================
-- Tabla: contacts
-- Contactos guardados para transferencias
-- =============================================
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('VISTA', 'CORRIENTE', 'AHORRO')),
    email VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, rut)
);

-- Índices para contacts
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

-- =============================================
-- Tabla: transactions
-- Registro de todas las transacciones
-- =============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    dest_account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    operation_number INTEGER NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'FEE')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED')),
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transactions
CREATE INDEX idx_transactions_source_account ON transactions(source_account_id);
CREATE INDEX idx_transactions_dest_account ON transactions(dest_account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- =============================================
-- Tabla: otp_codes
-- Códigos OTP para autenticación de dos factores
-- =============================================
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    related_entity_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otp_codes
CREATE INDEX idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX idx_otp_codes_code ON otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);

-- =============================================
-- Tabla: notifications
-- Notificaciones para los usuarios
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TRANSFER', 'SECURITY', 'SYSTEM', 'GENERAL')),
    title VARCHAR(100),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================
-- Tabla: currency_rates
-- Tasas de cambio e indicadores económicos
-- =============================================
CREATE TABLE currency_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code)
);

-- Índices para currency_rates
CREATE INDEX idx_currency_rates_code ON currency_rates(code);

-- =============================================
-- Tabla: audit_logs
-- Registro de auditoría del sistema
-- =============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================
-- Datos iniciales (opcional)
-- =============================================

-- Insertar indicadores económicos iniciales
INSERT INTO currency_rates (code, value) VALUES 
    ('UF', 37500.00),
    ('USD', 950.00),
    ('EUR', 1020.00)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Triggers y funciones auxiliares
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para accounts
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contacts
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Fin del Schema
-- =============================================