import { HTTP_400_BAD_REQUEST, YANDEX_REQUEST_DELAY } from '../../modules/config/const.mjs';
import { yandexDirectOrigin, yandexCampaignsEndpoint } from '../../modules/config/upstreams.mjs';
import { request } from '../../modules/utils/api.mjs';
import { YANDEX_DIRECT_TOKEN } from '../../modules/config/secrets.mjs';
import { auth } from '../../modules/utils/auth.mjs';
import { db } from '../../modules/utils/database.mjs';

/**
 * Метод синхронизации кампаний из Яндекс Директа
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

    if (!user) {
      res.statusCode = HTTP_400_BAD_REQUEST;
      res.end(JSON.stringify({ details: [] }));
      return;
    }

    // Запрос к Yandex Direct API
    request(yandexCampaignsEndpoint, {
      origin: yandexDirectOrigin,
      method: 'POST',
      delay: YANDEX_REQUEST_DELAY,
      headers: {
        'Authorization': `Bearer ${YANDEX_DIRECT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'ru',
      },
      body: {
        method: 'get',
        params: {
          SelectionCriteria: {},
          FieldNames: [
            'Id', 'Name', 'Type', 'Status', 'StatusPayment',
            'StartDate', 'EndDate', 'DailyBudget'
          ]
        }
      },
    }).then((response) => {
      const campaigns = response.data?.result?.Campaigns || [];
      let syncedCount = 0;
      let updatedCount = 0;

      campaigns.forEach((campaign) => {
        const existing = db.sql(req.instance, 'get', `
          SELECT id FROM campaigns WHERE yandex_id = ?
        `, [campaign.Id.toString()]);

        if (existing) {
          // Обновляем существующую кампанию
          db.sql(req.instance, 'run', `
            UPDATE campaigns 
            SET name = ?, type = ?, status = ?, budget = ?, 
                start_date = ?, end_date = ?, updated_at = ?
            WHERE yandex_id = ?
          `, [
            campaign.Name,
            campaign.Type,
            campaign.Status,
            campaign.DailyBudget?.Amount || 0,
            campaign.StartDate || null,
            campaign.EndDate || null,
            new Date().toISOString(),
            campaign.Id.toString()
          ]);
          updatedCount++;
        } else {
          // Создаем новую кампанию
          db.sql(req.instance, 'run', `
            INSERT INTO campaigns (yandex_id, name, type, status, budget, 
                                 start_date, end_date, created_at, author_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            campaign.Id.toString(),
            campaign.Name,
            campaign.Type,
            campaign.Status,
            campaign.DailyBudget?.Amount || 0,
            campaign.StartDate || null,
            campaign.EndDate || null,
            new Date().toISOString(),
            user.id
          ]);
          syncedCount++;
        }
      });

      res.end(JSON.stringify({ 
        synced: syncedCount, 
        updated: updatedCount,
        total: campaigns.length 
      }));
    }, (error) => {
      res.statusCode = error.status || HTTP_400_BAD_REQUEST;
      res.end(JSON.stringify({ 
        details: [{
          level: 'error',
          property: 'sync',
          message: 'Ошибка синхронизации с Яндекс Директом'
        }]
      }));
    });
  });
};