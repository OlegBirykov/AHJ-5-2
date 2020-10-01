export default class DeleteForm {
  constructor(parentWidget) {
    this.parentWidget = parentWidget;
  }

  static get markup() {
    return `
      <p data-id="${this.ctrlId.text}"></p>
      <div class="buttons">
        <button type="submit" data-id="${this.ctrlId.delete}">Удалить</button>
        <button type="reset" data-id="${this.ctrlId.cancel}">Отмена</button>
      </div>
    `;
  }

  static get ctrlId() {
    return {
      form: 'delete-form',
      text: 'text',
      delete: 'delete',
      cancel: 'cancel',
    };
  }

  static get textSelector() {
    return `[data-id=${this.ctrlId.text}]`;
  }

  static get deleteSelector() {
    return `[data-id=${this.ctrlId.delete}]`;
  }

  static get cancelSelector() {
    return `[data-id=${this.ctrlId.cancel}]`;
  }

  bindToDOM() {
    this.form = document.createElement('form');
    this.form.className = 'delete-form';
    this.form.dataset.widget = this.constructor.ctrlId.form;
    this.form.innerHTML = this.constructor.markup;
    document.body.appendChild(this.form);

    this.text = this.form.querySelector(this.constructor.textSelector);
    this.deleteButton = this.form.querySelector(this.constructor.deleteSelector);
    this.cancelButton = this.form.querySelector(this.constructor.cancelSelector);

    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    this.parentWidget.productList.splice(this.index, 1);
    this.parentWidget.redraw();

    this.onReset();
  }

  onReset() {
    this.form.classList.remove('active');
    this.parentWidget.isActive = true;
  }

  onResize() {
    this.form.style.left = `${window.scrollX + window.innerWidth / 2 - this.form.offsetWidth / 2}px`;
    this.form.style.top = `${window.scrollY + window.innerHeight / 2 - this.form.offsetHeight / 2}px`;
  }

  deleteProduct(index) {
    this.parentWidget.isActive = false;
    this.index = +index;

    this.text.innerText = `Вы действительно хотите удалить этот чудесный товар "${this.parentWidget.productList[index].name}"?`;

    this.form.classList.add('active');
    this.onResize();
  }
}
