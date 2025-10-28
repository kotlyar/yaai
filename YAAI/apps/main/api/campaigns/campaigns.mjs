import {
  HTTP_400_BAD_REQUEST,
  HTTP_401_UNAUTHORIZED,
  HTTP_422_UNPROCESSABLE_ENTITY,
} from '../../modules/config/const.mjs';

import { auth } from '../../modules/utils/auth.mjs';
import { db } from '../../modules/utils/database.mjs';
import { i18n } from '../../modules/utils/i18n.mjs';
import { validation } from '../../modules/utils/validation.mjs';

/**
 * Получение списка всех кампаний
 *
 * @param {object} params Параметры фильтрации
 * @param {object} req Параметры запроса
 * @param {object} res Ответ сервера
 */
const getCampaigns = (params, req, res) => {
  const campaigns = db.sql(req.instance, 'all', `
    SELECT c.id, c.yandex_id as yandexId, c.name, c.type, c.status, 
           c.budget, c.start_date as startDate, c.end_date as endDate,
           c.created_at as createdAt,
           COALESCE(SUM(cs.impressions), 0) as totalImpressions,
           COALESCE(SUM(cs.clicks), 0) as totalClicks,
           COALESCE(SUM(cs.cost), 0) as totalCost,
           COALESCE(SUM(cs.conversions), 0) as totalConversions,
           CASE 
             WHEN SUM(cs.impressions) > 0 
             THEN ROUND(CAST(SUM(cs.clicks) AS FLOAT) / SUM(cs.impressions) * 100, 2)
             ELSE 0 
           END as ctr,
           CASE 
             WHEN SUM(cs.clicks) > 0 
             THEN ROUND(CAST(SUM(cs.cost) AS FLOAT) / SUM(cs.clicks), 2)
             ELSE 0 
           END as cpc
    FROM campaigns c
    LEFT JOIN campaign_stats cs ON cs.campaign_id = c.id 
      AND cs.date >= date('now', '-30 days')
    WHERE c.is_deleted = 0
    GROUP BY c.id, c.yandex_id, c.name, c.type, c.status, c.budget, c.start_date, c.end_date, c.created_at
    ORDER BY c.created_at DESC
  `);

  res.end(JSON.stringify(campaigns));
};

/**
 * Добавление новой кампании
 *
 * @param {object} campaign Данные кампании
 * @param {object} req Параметры запроса
 * @param {object} res Ответ сервера
 */
const addCampaign = async (campaign, req, res) => {
  const details = [];
  const name = (campaign.name || '').toString().trim();
  const type = (campaign.type || '').toString().trim();
  const budget = parseFloat(campaign.budget || 0);

  if (!name) {
    details.push({
      level: 'error',
      property: 'name',
      message: i18n.t('requiredValue'),
    });
  } else if (!validation.isName(name)) {
    details.push({
      level: 'error',
      property: 'name',
      message: i18n.t('incorrectValue'),
    });
  }

  if (!type || !['SEARCH', 'DISPLAY', 'MOBILE', 'SMART'].includes(type)) {
    details.push({
      level: 'error',
      property: 'type',
      message: i18n.t('incorrectValue'),
    });
  }

  if (details.length) {
    res.statusCode = HTTP_400_BAD_REQUEST;
    res.end(JSON.stringify({ details }));
  } else {
    const currentUser = auth.bySessionId(req, res);

    const inserted = db.sql(req.instance, 'run', `
      INSERT INTO campaigns (name, type, status, budget, created_at, author_id)
      VALUES (?, ?, 'DRAFT', ?, ?, ?)
    `, [name, type, budget, new Date().toISOString(), currentUser?.id]);

    if (inserted?.lastInsertRowid) {
      res.end(JSON.stringify(campaign));
    } else {
      res.statusCode = HTTP_422_UNPROCESSABLE_ENTITY;
      res.end(JSON.stringify({ details }));
    }
  }
};

/**
 * Методы для работы с кампаниями
 *
 * @param {object} req Параметры запроса
 * @param {object} res Ответ сервера
 */
export default async (req, res) => {
  let body = '';
  let bodyJSON = {};

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      bodyJSON = JSON.parse(body);
    } catch (err) {}

    const user = auth.bySessionId(req);

    if (user) {
      if (req.method === 'GET') {
        getCampaigns(bodyJSON, req, res);
      } else if (req.method === 'POST') {
        addCampaign(bodyJSON, req, res);
      } else {
        res.statusCode = HTTP_400_BAD_REQUEST;
        res.end(JSON.stringify({ details: [] }));
      }
    } else {
      res.statusCode = HTTP_401_UNAUTHORIZED;
      res.end(JSON.stringify({ details: [] }));
    }
  });
};