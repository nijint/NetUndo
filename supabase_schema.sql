-- NetUndo Supabase Table Schema & 5G Update Script

-- 1. Create pins table (if starting fresh)
CREATE TABLE IF NOT EXISTS pins (
  id BIGINT PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  network_type TEXT,
  provider TEXT NOT NULL,
  signal_strength TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SQL Query to migrate existing legacy 'Excellent (5G/4G)' pins to dedicated 'Excellent (5G)' in Supabase
UPDATE pins 
SET 
  signal_strength = 'Excellent (5G)',
  network_type = '5G'
WHERE 
  signal_strength = 'Excellent (5G/4G)';

-- 3. Verify pins table records
SELECT id, provider, network_type, signal_strength, reason, created_at 
FROM pins 
ORDER BY created_at DESC;
