import http from 'http';

import {
  HTTP_200_OK,
  HTTP_302_FOUND,
  HTTP_404_NOT_FOUND,
  MAIN_DATABASE_NAME,
  SESSION_COOKIE_NAME,
  SITE_NAME,
} from './modules/config/const.mjs';

import { i18n } from './modules/utils/i18n.mjs';
import { auth } from './modules/utils/auth.mjs';
import { cookie } from './modules/utils/cookie.mjs';
import indexRoute from './routes/index.mjs';
import loginRoute from './routes/login.mjs';
import dashboardRoute from './routes/dashboard.mjs';
import projectsRoute from './routes/projects.mjs';
import recommendationsRoute from './routes/recommendations.mjs';

// API imports
import accountLoginApi from './api/account/login.mjs';
import accountUsersApi from './api/account/users.mjs';
import campaignsApi from './api/campaigns/campaigns.mjs';
import analyticsApi from './api/analytics/overview.mjs';
import yandexApi from './api/yandex/sync.mjs';

import {
  campaignsEndpoint,
  analyticsEndpoint,
  yandexSyncEndpoint,
  logInEndpoint,
  usersEndpoint,
} from './modules/config/endpoints.mjs';

const timestamp = new Date().toISOString().replace(/[^\d]/g, '');

http.createServer((req, res) => {
  const pathname = (req.url || '').split('?')[0];
  const url = `${req.method} ${pathname}`;
  const acceptLanguage = (req.headers['accept-language'] || '').substring(0, 2);
  const lang = (i18n.locales[acceptLanguage] ? acceptLanguage : i18n.locale);

  req.instance = req.headers.instance || MAIN_DATABASE_NAME;
  res.statusCode = HTTP_200_OK;

  const isMainInstance = req.instance === MAIN_DATABASE_NAME;
  let user;

  switch (true) {
    case url === 'GET /healthcheck':
      res.setHeader('Content-Type', 'text/plain');
      res.end(`I'm alive!\nENV:${process.env.ENV}`);
      break;
    
    // API Routes
    case url === `POST ${logInEndpoint}`:
      res.setHeader('Content-Type', 'application/json');
      accountLoginApi(req, res);
      break;
    case url === `POST ${usersEndpoint}`:
    case url === `PUT ${usersEndpoint}`:
    case url === `PATCH ${usersEndpoint}`:
    case url === `DELETE ${usersEndpoint}`:
      res.setHeader('Content-Type', 'application/json');
      accountUsersApi(req, res);
      break;
    case url === `POST ${campaignsEndpoint}`:
    case url === `GET ${campaignsEndpoint}`:
      res.setHeader('Content-Type', 'application/json');
      campaignsApi(req, res);
      break;
    case url === `GET ${analyticsEndpoint}`:
      res.setHeader('Content-Type', 'application/json');
      analyticsApi(req, res);
      break;
    case url === `POST ${yandexSyncEndpoint}`:
      res.setHeader('Content-Type', 'application/json');
      yandexApi(req, res);
      break;
    
    // Page Routes
    case !isMainInstance && (url === 'GET /login'):
      res.setHeader('Content-Type', 'text/html');
      cookie.remove(SESSION_COOKIE_NAME, {}, res);
      loginRoute(req, res, { lang, title: `${i18n.t('logIn')} | ${SITE_NAME}`, timestamp });
      break;
    case !isMainInstance && [
      'GET /',
      'GET /dashboard',
      'GET /projects',
      'GET /recommendations',
    ].includes(url):
      user = auth.bySessionId(req, res);

      if (user) {
        res.setHeader('Content-Type', 'text/html');
        
        if (url === 'GET /dashboard') {
          dashboardRoute(req, res, { lang, title: `${i18n.t('dashboard')} | ${SITE_NAME}`, timestamp, user });
        } else if (url === 'GET /projects') {
          projectsRoute(req, res, { lang, title: `${i18n.t('projects')} | ${SITE_NAME}`, timestamp, user });
        } else if (url === 'GET /recommendations') {
          recommendationsRoute(req, res, { lang, title: `${i18n.t('recommendations')} | ${SITE_NAME}`, timestamp, user });
        } else {
          indexRoute(req, res, { lang, title: SITE_NAME, timestamp, user });
        }
      } else {
        res.statusCode = HTTP_302_FOUND;
        res.setHeader('Location', '/login');
        res.end();
      }
      break;
    default:
      res.statusCode = HTTP_404_NOT_FOUND;
      res.end();
  }
}).listen(8080);