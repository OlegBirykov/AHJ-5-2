export default class Tooltip {
  constructor(targetEl) {
    this.targetEl = targetEl;
  }

  static get markup() {
    return `
      <p class="text" data-id="${this.ctrlId.text}"></p>
      <div class="arrow"></div>
    `;
  }

  static get ctrlId() {
    return {
      tooltip: 'tooltip',
      text: 'text',
    };
  }

  static get textSelector() {
    return `[data-id=${this.ctrlId.text}]`;
  }

  bindToDOM() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.dataset.widget = this.constructor.ctrlId.tooltip;
    this.tooltip.innerHTML = this.constructor.markup;
    document.body.appendChild(this.tooltip);

    this.text = this.tooltip.querySelector(this.constructor.textSelector);
  }
}
