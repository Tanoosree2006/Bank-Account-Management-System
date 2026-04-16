CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- EVENTS TABLE
CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aggregate_id VARCHAR(255) NOT NULL,
  aggregate_type VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  event_data JSONB NOT NULL,
  event_number INT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  version INT DEFAULT 1,
  UNIQUE (aggregate_id, event_number)
);

CREATE INDEX idx_events_aggregate ON events(aggregate_id);

-- SNAPSHOTS
CREATE TABLE snapshots (
  snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aggregate_id VARCHAR(255) UNIQUE NOT NULL,
  snapshot_data JSONB NOT NULL,
  last_event_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ACCOUNT SUMMARY (READ MODEL)
CREATE TABLE account_summaries (
  account_id VARCHAR(255) PRIMARY KEY,
  owner_name VARCHAR(255),
  balance DECIMAL(19,4),
  currency VARCHAR(3),
  status VARCHAR(50),
  version BIGINT
);

-- TRANSACTION HISTORY
CREATE TABLE transaction_history (
  transaction_id VARCHAR(255) PRIMARY KEY,
  account_id VARCHAR(255),
  type VARCHAR(50),
  amount DECIMAL(19,4),
  description TEXT,
  timestamp TIMESTAMPTZ
);