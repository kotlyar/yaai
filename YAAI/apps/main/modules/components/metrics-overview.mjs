import { css, html } from '../utils/render.mjs';
import { i18n } from '../utils/i18n.mjs';
import { request } from '../utils/api.mjs';
import { analyticsEndpoint } from '../config/endpoints.mjs';
import Component from '../utils/component.mjs';

export default class extends Component {
  attachRootEvents() {
    document.addEventListener('changeRoute', this.reload.bind(this));
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

    request(analyticsEndpoint, {
      method: 'GET',
      abortController: this.abortController,
    }).then((response) => {
      this.setState({
        metrics: response?.data || {},
      });

      this.inert = false;
    }, () => {
      this.dataset.placeholder = i18n.t('loadingError');
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

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .metric-card {
        padding: 24px;
        border-radius: 16px;
        box-shadow: var(--block-shadow);
        background: var(--background-color);
        position: relative;
      }

      .metric-title {
        font-size: 13px;
        color: var(--label-color);
        margin-bottom: 8px;
        font-weight: 500;
      }

      .metric-value {
        font-size: 28px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 4px;
      }

      .metric-change {
        font-size: 12px;
        display: flex;
        align-items: center;
      }

      .metric-change.positive {
        color: #059669;
      }

      .metric-change.negative {
        color: #dc2626;
      }

      .metric-icon {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }

      .icon-cost {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .icon-impressions {
        background: #dcfce7;
        color: #166534;
      }

      .icon-clicks {
        background: #fce7f3;
        color: #be185d;
      }

      .icon-ctr {
        background: #fed7aa;
        color: #ea580c;
      }

      .icon-roi {
        background: #e0e7ff;
        color: #4338ca;
      }
    `;
  }

  static async template(state) {
    if (document.body.dataset.route && document.body.dataset.route !== 'dashboard') {
      return '';
    }

    const metrics = state?.metrics || {};

    return html`
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon icon-cost">💰</div>
          <div class="metric-title">${i18n.t('totalCost')}</div>
          <div class="metric-value">
            ${metrics.totalCost ? new Intl.NumberFormat('ru-RU', { 
              style: 'currency', 
              currency: 'RUB',
              minimumFractionDigits: 0 
            }).format(metrics.totalCost) : '0 ₽'}
          </div>
          <div class="metric-change ${metrics.costChange > 0 ? 'positive' : 'negative'}">
            ${metrics.costChange > 0 ? '↗' : '↘'} ${Math.abs(metrics.costChange || 0).toFixed(1)}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-impressions">👁️</div>
          <div class="metric-title">${i18n.t('impressions')}</div>
          <div class="metric-value">
            ${new Intl.NumberFormat('ru-RU').format(metrics.totalImpressions || 0)}
          </div>
          <div class="metric-change ${metrics.impressionsChange > 0 ? 'positive' : 'negative'}">
            ${metrics.impressionsChange > 0 ? '↗' : '↘'} ${Math.abs(metrics.impressionsChange || 0).toFixed(1)}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-clicks">👆</div>
          <div class="metric-title">${i18n.t('clicks')}</div>
          <div class="metric-value">
            ${new Intl.NumberFormat('ru-RU').format(metrics.totalClicks || 0)}
          </div>
          <div class="metric-change ${metrics.clicksChange > 0 ? 'positive' : 'negative'}">
            ${metrics.clicksChange > 0 ? '↗' : '↘'} ${Math.abs(metrics.clicksChange || 0).toFixed(1)}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-ctr">🎯</div>
          <div class="metric-title">CTR</div>
          <div class="metric-value">
            ${metrics.avgCtr ? metrics.avgCtr.toFixed(2) + '%' : '0%'}
          </div>
          <div class="metric-change ${metrics.ctrChange > 0 ? 'positive' : 'negative'}">
            ${metrics.ctrChange > 0 ? '↗' : '↘'} ${Math.abs(metrics.ctrChange || 0).toFixed(1)}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon icon-roi">📈</div>
          <div class="metric-title">ROI</div>
          <div class="metric-value">
            ${metrics.roi ? metrics.roi.toFixed(1) + '%' : '0%'}
          </div>
          <div class="metric-change ${metrics.roiChange > 0 ? 'positive' : 'negative'}">
            ${metrics.roiChange > 0 ? '↗' : '↘'} ${Math.abs(metrics.roiChange || 0).toFixed(1)}%
          </div>
        </div>
      </div>
      <ui-preloader></ui-preloader>
    `;
  }
}