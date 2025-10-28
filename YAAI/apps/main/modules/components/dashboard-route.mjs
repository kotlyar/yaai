import { css, html } from '../utils/render.mjs';
import { i18n } from '../utils/i18n.mjs';
import CampaignsList from './campaigns-list.mjs';
import MetricsOverview from './metrics-overview.mjs';
import PerformanceChart from './performance-chart.mjs';
import Component from '../utils/component.mjs';

export default class extends Component {
  connectedCallback() {
    Component.defineComponent('campaigns-list', CampaignsList);
    Component.defineComponent('metrics-overview', MetricsOverview);
    Component.defineComponent('performance-chart', PerformanceChart);
  }

  static style() {
    return css`
      :host {
        padding: 32px 48px 48px;
        display: none;
        flex: 1 0 auto;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .metrics-section {
        margin-bottom: 32px;
      }
    `;
  }

  static async template() {
    return html`
      <h1>
        📊 ${i18n.t('analyticsAndOptimization')}
      </h1>
      
      <div class="metrics-section">
        <metrics-overview></metrics-overview>
      </div>

      <div class="dashboard-grid">
        <div class="full-width">
          <performance-chart></performance-chart>
        </div>
        
        <div class="full-width">
          <campaigns-list></campaigns-list>
        </div>
      </div>
    `;
  }
}