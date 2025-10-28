/* eslint-disable max-classes-per-file */
import uiLinkStyles from '../styles/ui/link.mjs';
import uiTextboxStyles from '../styles/ui/textbox.mjs';
import uiButtonStyles from '../styles/ui/button.mjs';
import uiTableStyles from '../styles/ui/table.mjs';
import uiPreloaderStyles from '../styles/ui/preloader.mjs';
import componentStyles from '../styles/component.mjs';

if (typeof HTMLElement === 'undefined') {
  globalThis.HTMLElement = class {};
}

export default class extends HTMLElement {
  /**
   * Режим теневого DOM-дерева компонента
   * @type {string}
   */
  static shadowRootMode = 'open';

  /**
   * @description Конструктор компонента
   */
  constructor() {
    super();
    this.init();
    this.reload();
  }

  /**
   * @description Формирование стилей компонента
   * @returns {CSSStyleSheet} CSS-стили компонента
   */
  static style() {
    return new CSSStyleSheet();
  }

  /**
   * @description Формирование верстки компонента из данных
   * @param {object=} state Данные, подставляемые в шаблон
   * @returns {Promise<string>} HTML с содержимым компонента
   */
  static async template(state) { // eslint-disable-line no-unused-vars
    return '';
  }

  /**
   * @description Инициализация компонента
   * @returns {void}
   */
  init() {
    this.state = {};
    this.abortController = new AbortController();
  }

  /**
   * @description Объявление компонента
   * @param {string} name Название тега компонента
   * @param {object} component Класс компонента
   * @returns {void}
   */
  static defineComponent(name, component) {
    if (!customElements.get(name)) {
      customElements.define(name, component);
    }
  }

  /**
   * @description Обновление данных в компоненте и его перерисовка
   * @param {object} state Объект с данными компонента
   * @returns {Promise<void>}
   */
  async setState(state) {
    Object.assign(this.state, state || {});
    await this.render();
  }

  /**
   * @description Сброс данных в компоненте и его перерисовка
   * @returns {Promise<void>}
   */
  async clearState() {
    this.state = {};
    await this.render();
  }

  /**
   * @description Предзагрузка данных для компонента на сервере (SSR)
   * @returns {Promise<object>}
   */
  static async preload() {
    return {};
  }

  /**
   * @description Загрузка данных для компонента
   * @returns {void}
   */
  load() {}

  /**
   * @description Перезагрузка данных для компонента
   * @returns {void}
   */
  reload() {
    this.render();
    this.load();
  }

  /**
   * @description Предварительная отрисовка компонента на сервере (SSR)
   * @returns {Promise<string>}
   */
  static async prerender() {
    return this.template(await this.preload());
  }

  /**
   * @description Отрисовка компонента
   * @returns {Promise<void>}
   */
  async render() {
    const template = document.createElement('template');
    let { shadowRoot } = this;

    if (!this.shadowRoot) {
      shadowRoot = this.attachShadow({ mode: this.constructor.shadowRootMode });
    }

    if (!shadowRoot.adoptedStyleSheets.length) {
      this.attachStyles(shadowRoot);
      this.attachRootEvents(shadowRoot);
    }

    template.innerHTML = await this.constructor.template(this.state);
    shadowRoot.innerHTML = '';
    shadowRoot.append(template.content);

    this.attachEvents(shadowRoot);
  }

  /**
   * @description Добавление стилей компонента
   * @param {ShadowRoot} root Корневой теневой DOM-элемент
   * @returns {void}
   */
  attachStyles(root) {
    root.adoptedStyleSheets = [uiLinkStyles, uiTextboxStyles, uiButtonStyles,
      uiTableStyles, uiPreloaderStyles, componentStyles, this.constructor.style()];
  }

  /**
   * @description Добавление обработчиков событий для корневого DOM-элемента компонента
   * @param {ShadowRoot} root Корневой теневой DOM-элемент
   * @returns {void}
   */
  attachRootEvents(root) {} // eslint-disable-line no-unused-vars

  /**
   * @description Добавление обработчиков событий компонента
   * @param {ShadowRoot} root Корневой теневой DOM-элемент
   * @returns {void}
   */
  attachEvents(root) {} // eslint-disable-line no-unused-vars

  /**
   * @description Удаление обработчиков событий, добавленных для корневого DOM-элемента компонента
   * @returns {void}
   */
  detachRootEvents() {} // eslint-disable-line no-unused-vars

  /**
   * @description Обработчик добавления компонента в DOM
   * @returns {void}
   */
  connectedCallback() {}

  /**
   * @description Обработчик удаления компонента из DOM
   * @returns {void}
   */
  disconnectedCallback() {
    this.abortController.abort(new DOMException('Component Destroyed', 'AbortError'));
    this.detachRootEvents();
  }
}