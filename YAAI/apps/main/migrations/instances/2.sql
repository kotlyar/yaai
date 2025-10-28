CREATE TABLE 'campaigns' (
  'id' INTEGER PRIMARY KEY NOT NULL,
  'yandex_id' TEXT,
  'name' TEXT NOT NULL,
  'type' TEXT NOT NULL DEFAULT 'SEARCH',
  'status' TEXT NOT NULL DEFAULT 'DRAFT',
  'budget' REAL DEFAULT 0,
  'start_date' DATETIME,
  'end_date' DATETIME,
  'targeting_settings' TEXT,
  'created_at' DATETIME NOT NULL,
  'updated_at' DATETIME,
  'author_id' INTEGER NOT NULL,
  'is_deleted' BOOLEAN NOT NULL DEFAULT 0);

CREATE UNIQUE INDEX 'idx_campaigns_yandex_id' ON 'campaigns' ('yandex_id');
CREATE INDEX 'idx_campaigns_name' ON 'campaigns' ('name');
CREATE INDEX 'idx_campaigns_status' ON 'campaigns' ('status');
CREATE INDEX 'idx_campaigns_author_id' ON 'campaigns' ('author_id');
CREATE INDEX 'idx_campaigns_is_deleted' ON 'campaigns' ('is_deleted');