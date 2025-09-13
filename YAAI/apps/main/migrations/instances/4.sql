CREATE TABLE 'campaign_stats' (
  'id' INTEGER PRIMARY KEY NOT NULL,
  'campaign_id' INTEGER NOT NULL,
  'date' DATE NOT NULL,
  'impressions' INTEGER DEFAULT 0,
  'clicks' INTEGER DEFAULT 0,
  'cost' REAL DEFAULT 0,
  'conversions' INTEGER DEFAULT 0,
  'revenue' REAL DEFAULT 0,
  'created_at' DATETIME NOT NULL);

CREATE UNIQUE INDEX 'idx_campaign_stats_campaign_date' ON 'campaign_stats' ('campaign_id', 'date');
CREATE INDEX 'idx_campaign_stats_date' ON 'campaign_stats' ('date');
CREATE INDEX 'idx_campaign_stats_campaign_id' ON 'campaign_stats' ('campaign_id');

CREATE TABLE 'keyword_stats' (
  'id' INTEGER PRIMARY KEY NOT NULL,
  'keyword_id' INTEGER NOT NULL,
  'date' DATE NOT NULL,
  'impressions' INTEGER DEFAULT 0,
  'clicks' INTEGER DEFAULT 0,
  'cost' REAL DEFAULT 0,
  'conversions' INTEGER DEFAULT 0,
  'position' REAL DEFAULT 0,
  'quality_score' INTEGER DEFAULT 0,
  'created_at' DATETIME NOT NULL);

CREATE UNIQUE INDEX 'idx_keyword_stats_keyword_date' ON 'keyword_stats' ('keyword_id', 'date');
CREATE INDEX 'idx_keyword_stats_date' ON 'keyword_stats' ('date');
CREATE INDEX 'idx_keyword_stats_keyword_id' ON 'keyword_stats' ('keyword_id');