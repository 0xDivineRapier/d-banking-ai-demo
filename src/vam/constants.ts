
export const VAM_SQL_SCHEMA = `-- Dozn Banking VAM System Schema
-- Designed for High-Volume Enterprise & BI SNAP Compliance
-- Architect: Senior Fintech Solutions Architect

-- 1. Institutions (Organ System Management & Fee Config)
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. ABC_CORP_FIN_01
    connection_type VARCHAR(20) NOT NULL CHECK (connection_type IN ('SOCKET', 'REST')),
    ip_address INET, -- For Socket/Legacy mapping
    port INTEGER,
    api_endpoint TEXT,
    
    -- Fee Management Configuration
    fee_type VARCHAR(20) DEFAULT 'FLAT' CHECK (fee_type IN ('FLAT', 'PERCENTAGE')),
    fee_value DECIMAL(18, 4) DEFAULT 0.00,
    epay_split_percent DECIMAL(5, 2) DEFAULT 30.00, -- Default 30% to Aggregator
    
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mother Accounts (Hierarchy Root)
CREATE TABLE mother_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('COLLECTION', 'WITHDRAWAL')),
    currency_code CHAR(3) DEFAULT 'IDR',
    balance DECIMAL(20, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'FROZEN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Virtual Accounts (Multi-Currency & Expiration)
CREATE TABLE virtual_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mother_account_id UUID REFERENCES mother_accounts(id) ON DELETE CASCADE,
    va_number VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    currency_code CHAR(3) DEFAULT 'IDR',
    min_amount DECIMAL(20, 2),
    max_amount DECIMAL(20, 2),
    expiration_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'INACTIVE')),
    metadata JSONB, 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transactions (SNAP Compliant & Unappropriated Flags)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    va_id UUID REFERENCES virtual_accounts(id) ON DELETE SET NULL,
    mother_account_id UUID REFERENCES mother_accounts(id) NOT NULL,
    x_external_id VARCHAR(100) UNIQUE NOT NULL, 
    amount DECIMAL(20, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('CREDIT', 'DEBIT')),
    status VARCHAR(25) DEFAULT 'PENDING' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED', 'UNAPPROPRIATED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Settlement Batches (Nightly Fee Calculation Tracking)
CREATE TABLE settlement_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_date DATE NOT NULL UNIQUE,
    total_tx_count INTEGER DEFAULT 0,
    total_volume DECIMAL(20, 2) DEFAULT 0.00,
    total_bank_fee DECIMAL(20, 2) DEFAULT 0.00,
    total_epay_fee DECIMAL(20, 2) DEFAULT 0.00,
    billing_file_path TEXT,
    status VARCHAR(20) DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED')),
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Audit Logs (Immutable OJK Compliance)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    "timestamp" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_va_number ON virtual_accounts(va_number);
CREATE INDEX idx_trans_external_id ON transactions(x_external_id);
CREATE INDEX idx_settlement_date ON settlement_batches(batch_date);
`;
