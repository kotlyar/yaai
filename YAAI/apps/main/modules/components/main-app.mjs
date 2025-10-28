import { SITE_NAME } from '../config/const.mjs';
import { css, html } from '../utils/render.mjs';
import { interRegularFont, interMediumFont, interSemiboldFont } from '../styles/fonts.mjs';
import resetStyles from '../styles/reset.mjs';
import routingStyles from '../styles/routing.mjs';
import defaultTheme from '../styles/theme.mjs';
import Component from '../utils/component.mjs';
import { router } from '../utils/router.mjs';
import { storage } from '../utils/storage.mjs';
import UserModel from '../models/user.mjs';
import HeaderMenu from './header-menu.mjs';
import DashboardRoute from './dashboard-route.mjs';
import ProjectsRoute from './projects-route.mjs';
import RecommendationsRoute from './recommendations-route.mjs';
import UIPreloader from './ui-preloader.mjs';

export default class extends Component {
  static shadowRootMode = 'closed';

  connectedCallback() {
    storage('user', JSON.parse(this.dataset.user), UserModel);

    Component.defineComponent('header-menu', HeaderMenu);
    Component.defineComponent('dashboard-route', DashboardRoute);
    Component.defineComponent('projects-route', ProjectsRoute);
    Component.defineComponent('recommendations-route', RecommendationsRoute);
    Component.defineComponent('ui-preloader', UIPreloader);
  }

  attachStyles(root) {
    super.attachStyles(root);
    root.adoptedStyleSheets = [defaultTheme, ...root.adoptedStyleSheets];

    document.adoptedStyleSheets = [...document.adoptedStyleSheets,
      interRegularFont, interMediumFont, interSemiboldFont, resetStyles, routingStyles];
  }

  attachRootEvents(root) {
    router.preventLinks(root);
  }

  static style() {
    return css`
      :host {
        min-width: 1008px;
        height: 100%;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        -webkit-font-smoothing: antialiased;
        font: var(--font);
        color: var(--text-color);
        overflow-wrap: break-word;
      }

      header {
        height: 80px;
        top: 0;
        position: sticky;
        box-sizing: border-box;
        flex: 0 0 auto;
        border-bottom: 1px solid var(--border-color);
        background: var(--background-color);
        z-index: 1;
      }

      .logo {
        height: 40px;
        line-height: 38px;
        left: 32px;
        top: 20px;
        padding-left: 55px;
        position: absolute;
        font-size: 19px;
        font-weight: 600;
        text-decoration: none !important;
        user-select: none;
      }

      .logo::before {
        width: 40px;
        height: 40px;
        top: 0;
        left: 0;
        position: absolute;
        content: '';
        border-radius: 50%;
        background: var(--logo-background-color) no-repeat center;
        background-size: 24px 24px;
      }

      nav {
        left: 50%;
        top: 20px;
        position: absolute;
        transform: translateX(-50%);
      }

      nav a {
        line-height: 40px;
        margin: 0 24px;
        position: relative;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        outline-offset: 0;
      }

      nav a:hover,
      nav a:active {
        text-decoration: none;
      }

      nav a::after {
        width: 100%;
        height: 2px;
        left: 0;
        bottom: -2px;
        position: absolute;
        display: none;
        content: '';
        background: var(--button-background-color);
      }
    `;
  }

  static async template() {
    return html`
      <header>
        <a class="logo" href="/">
          📊 ${SITE_NAME}
        </a>
        <nav>
          <a href="/dashboard">Дашборд</a>
          <a href="/projects">Проекты</a>
          <a href="/recommendations">Рекомендации</a>
        </nav>
        <header-menu></header-menu>
      </header>
      <dashboard-route part="dashboard-route"></dashboard-route>
      <projects-route part="projects-route"></projects-route>
      <recommendations-route part="recommendations-route"></recommendations-route>
      <ui-preloader></ui-preloader>
    `;
  }
}