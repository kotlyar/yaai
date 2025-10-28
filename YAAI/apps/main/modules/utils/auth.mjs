import crypto from 'crypto';
import { HTTP_401_UNAUTHORIZED, SESSION_COOKIE_NAME, SESSION_LIFETIME } from '../config/const.mjs';
import { cookie } from './cookie.mjs';
import { db } from './database.mjs';
import { validation } from './validation.mjs';

export const auth = {
  /**
   * @description Проверяет аутентификацию по сессии
   * @param {object} req Параметры запроса
   * @param {object} res Ответ сервера
   * @returns {string|null} Идентификатор активной сессии или null
   */
  bySessionId: (req, res) => {
    const sessionId = cookie.get(SESSION_COOKIE_NAME, req);

    if (!validation.isUUID(sessionId)) {
      return null;
    }

    const session = db.sql(req.instance, 'get', `
      SELECT user_id as userId, expires_at as expiresAt FROM sessions WHERE id = ?
    `, [sessionId]);

    if (!session) {
      return null;
    }

    const now = new Date();
    const nowISOString = now.toISOString();

    if (nowISOString > session.expiresAt) {
      return null;
    }

    if (res) {
      const expiresAt = new Date(now.getTime() + SESSION_LIFETIME);

      db.sql(req.instance, 'run', `
        UPDATE sessions
        SET logged_at = ?,
            expires_at = ?
        WHERE id = ?
      `, [nowISOString, expiresAt.toISOString(), sessionId]);

      cookie.set(SESSION_COOKIE_NAME, sessionId, {
        expires: expiresAt.toUTCString(),
        isHttpOnly: true,
        isSecure: true,
      }, res);
    }

    const user = db.sql(req.instance, 'get', `
      SELECT id, email, surname, name, patronymic, is_admin as isAdmin
      FROM users
      WHERE (id = ?) AND (is_blocked = 0) AND (is_deleted = 0)
    `, [session.userId]);

    return user;
  },

  /**
   * @description Создает новую сессию
   * @param {object} req Параметры запроса
   * @param {object} res Ответ сервера
   * @param {number} userId Идентификатор пользователя
   * @returns {void}
   */
  createSession: (req, res, userId) => {
    const loggedAtISOString = new Date().toISOString();
    const expiresAt = new Date(new Date().getTime() + SESSION_LIFETIME);
    const expiresAtISOString = expiresAt.toISOString();
    const newId = crypto.randomUUID();
    const session = db.sql(req.instance, 'get', 'SELECT id FROM sessions WHERE user_id = ?', [userId]);

    if (session?.id) {
      db.sql(req.instance, 'run', `
        UPDATE sessions
        SET id = ?,
            logged_at = ?,
            expires_at = ?
        WHERE id = ?
      `, [newId, loggedAtISOString, expiresAtISOString, session.id]);
    } else {
      db.sql(req.instance, 'run', `
        INSERT INTO sessions (id, user_id, logged_at, expires_at)
        VALUES (?, ?, ?, ?)
      `, [newId, userId, loggedAtISOString, expiresAtISOString]);
    }

    cookie.set(SESSION_COOKIE_NAME, newId, {
      expires: expiresAt.toUTCString(),
      isHttpOnly: true,
      isSecure: true,
    }, res);
  },

  /**
   * @description Хеширование пароля
   * @param {string} password Пароль
   * @returns {Promise<string>} Хеш пароля с солью
   */
  hashPassword: (password) => new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) {
        reject(err);
      }

      resolve(`${salt}:${key.toString('hex')}`);
    });
  }),

  /**
   * @description Проверка пароля
   * @param {string} storedPassword Сохраненный пароль
   * @param {string} password Пароль
   * @returns {Promise<boolean>}
   */
  verifyPassword: (storedPassword, password) => new Promise((resolve, reject) => {
    const [salt, hashedPassword] = storedPassword.split(':');
    const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');

    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) {
        reject(err);
      }

      resolve(crypto.timingSafeEqual(hashedPasswordBuffer, key));
    });
  }),
};