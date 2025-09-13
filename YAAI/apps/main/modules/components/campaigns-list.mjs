import { css, html } from '../utils/render.mjs';
import { i18n } from '../utils/i18n.mjs';
import { request } from '../utils/api.mjs';
import { campaignsEndpoint } from '../config/endpoints.mjs';
import CampaignModel from '../models/campaign.mjs';
import Component from '../utils/component.mjs';

export default class extends Component {
  attachRootEvents() {
    document.addEventListener('changeRoute', this.reload.bind(this));
  }

  attachEvents(root) {
    root.querySelector('#sync')?.addEventListener('click', this.syncCampaigns.bind(this));
  }

  reload() {
    this.inert = true;
    delete this.dataset.placeholder;
    super.reload();
  }

  load() {
    if (document.body.dataset.route === 'dashboard' || !document.body.dataset.route) {
      this.abortController = new AbortController();
    } else {
      this.abortController?.abort();
      return;
    }

    request(campaignsEndpoint, {
      method: 'GET',
      abortController: this.abortController,
    }).then((response) => {
      this.setState({
        campaigns: (response?.data || []).map((item) => new CampaignModel(item)),
      });

      this.inert = false;
    }, () => {
      this.dataset.placeholder = i18n.t('loadingError');
    });
  }

  syncCampaigns(e) {
    const button = e.currentTarget;
    button.disabled = true;
    button.textContent = i18n.t('syncing');

    request('/api/yandex/sync', {
      method: 'POST',
    }).then((response) => {
      this.reload();
      button.textContent = `${i18n.t('synced')}: ${response.data.synced}, ${i18n.t('updated')}: ${response.data.updated}`;
      setTimeout(() => {
        button.disabled = false;
        button.textContent = i18n.t('syncFromYandex');
      }, 3000);
    }, () => {
      button.disabled = false;
      button.textContent = i18n.t('syncError');
      setTimeout(() => {
        button.textContent = i18n.t('syncFromYandex');
      }, 3000);
    });
  }

  static style() {
    return css`
      :host {
        position: relative;
        display: block;
      }

      :host([inert]) > :not(:last-child) {
        display: none;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .campaigns-table {
        width: 100%;
        border-radius: 16px;
        border-collapse: collapse;
        box-shadow: var(--block-shadow);
        background: var(--background-color);
      }

      .campaigns-table th,
      .campaigns-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid var(--table-border-color);
      }

      .campaigns-table th {
        background: var(--textbox-background-color);
        font-weight: 600;
        color: var(--label-color);
        font-size: 13px;
      }

      .campaign-name {
        font-weight: 500;
        color: var(--text-color);
      }

      .campaign-status {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
      }

      .status-active {
        background: #dcfce7;
        color: #166534;
      }

      .status-paused {
        background: #fef3c7;
        color: #92400e;
      }

      .status-draft {
        background: #f3f4f6;
        color: #374151;
      }

      .metric-value {
        font-weight: 600;
      }

      .metric-positive {
        color: #059669;
      }

      .metric-negative {
        color: #dc2626;
      }
    `;
  }

  static async template(state) {
    if (document.body.dataset.route && document.body.dataset.route !== 'dashboard') {
      return '';
    }

    return html`
      <div class="header">
        <h2>🎯 ${i18n.t('campaigns')}</h2>
        <button id="sync">${i18n.t('syncFromYandex')}</button>
      </div>

      <table class="campaigns-table">
        <thead>
          <tr>
            <th>${i18n.t('campaignName')}</th>
            <th>${i18n.t('type')}</th>
            <th>${i18n.t('status')}</th>
            <th>${i18n.t('budget')}</th>
            <th>${i18n.t('impressions')}</th>
            <th>${i18n.t('clicks')}</th>
            <th>CTR</th>
            <th>CPC</th>
            <th>${i18n.t('cost')}</th>
          </tr>
        </thead>
        <tbody>
          ${state.campaigns?.map((campaign) => `
            <tr>
              <td>
                <div class="campaign-name">${campaign.name}</div>
              </td>
              <td>${campaign.type}</td>
              <td>
                <span class="campaign-status status-${campaign.status.toLowerCase()}">
                  ${i18n.t(campaign.status.toLowerCase())}
                </span>
              </td>
              <td class="metric-value">
                ${campaign.budget ? new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB',
                  minimumFractionDigits: 0 
                }).format(campaign.budget) : '—'}
              </td>
              <td class="metric-value">
                ${new Intl.NumberFormat('ru-RU').format(campaign.totalImpressions || 0)}
              </td>
              <td class="metric-value">
                ${new Intl.NumberFormat('ru-RU').format(campaign.totalClicks || 0)}
              </td>
              <td class="metric-value ${campaign.ctr > 2 ? 'metric-positive' : campaign.ctr < 1 ? 'metric-negative' : ''}">
                ${campaign.ctr ? campaign.ctr.toFixed(2) + '%' : '—'}
              </td>
              <td class="metric-value">
                ${campaign.cpc ? campaign.cpc.toFixed(2) + ' ₽' : '—'}
              </td>
              <td class="metric-value">
                ${campaign.totalCost ? new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB',
                  minimumFractionDigits: 0 
                }).format(campaign.totalCost) : '—'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <ui-preloader></ui-preloader>
    `;
  }
}