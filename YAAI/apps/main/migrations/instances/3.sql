CREATE TABLE 'keywords' (
  'id' INTEGER PRIMARY KEY NOT NULL,
  'yandex_id' TEXT,
  'campaign_id' INTEGER NOT NULL,
  'text' TEXT NOT NULL,
  'bid' REAL DEFAULT 0,
  'status' TEXT NOT NULL DEFAULT 'ACTIVE',
  'match_type' TEXT NOT NULL DEFAULT 'BROAD',
  'created_at' DATETIME NOT NULL,
  'updated_at' DATETIME,
  'is_deleted' BOOLEAN NOT NULL DEFAULT 0);

CREATE UNIQUE INDEX 'idx_keywords_yandex_id' ON 'keywords' ('yandex_id');
CREATE INDEX 'idx_keywords_campaign_id' ON 'keywords' ('campaign_id');
CREATE INDEX 'idx_keywords_text' ON 'keywords' ('text');
CREATE INDEX 'idx_keywords_status' ON 'keywords' ('status');
CREATE INDEX 'idx_keywords_is_deleted' ON 'keywords' ('is_deleted');