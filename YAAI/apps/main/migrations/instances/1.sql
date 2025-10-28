CREATE TABLE 'users' (
  'id' INTEGER PRIMARY KEY NOT NULL,
  'email' TEXT NOT NULL,
  'surname' TEXT NOT NULL,
  'name' TEXT NOT NULL,
  'patronymic' TEXT,
  'password' TEXT,
  'created_at' DATETIME NOT NULL,
  'is_admin' BOOLEAN NOT NULL DEFAULT 0,
  'is_blocked' BOOLEAN NOT NULL DEFAULT 0,
  'is_deleted' BOOLEAN NOT NULL DEFAULT 0);

CREATE UNIQUE INDEX 'idx_users_email' ON 'users' ('email');
CREATE INDEX 'idx_users_full_name' ON 'users' ('surname', 'name', 'patronymic');
CREATE INDEX 'idx_users_is_deleted' ON 'users' ('is_deleted');

CREATE TABLE 'recoveries' (
  'id' TEXT NOT NULL,
  'user_id' INTEGER NOT NULL);

CREATE UNIQUE INDEX 'idx_recoveries_id' ON 'recoveries' ('id');
CREATE INDEX 'idx_recoveries_user_id' ON 'recoveries' ('user_id');

CREATE TABLE 'sessions' (
  'id' TEXT NOT NULL,
  'user_id' INTEGER NOT NULL,
  'logged_at' DATETIME NOT NULL,
  'expires_at' DATETIME NOT NULL);

CREATE UNIQUE INDEX 'idx_sessions_id' ON 'sessions' ('id');
CREATE INDEX 'idx_sessions_user_id' ON 'sessions' ('user_id');