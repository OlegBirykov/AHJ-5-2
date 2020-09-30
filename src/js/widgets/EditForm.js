import Tooltip from './Tooltip';

export default class EditForm {
  constructor(parentWidget) {
    this.parentWidget = parentWidget;
  }

  static get markup() {
    return `
      <label>Название<input name="title" data-id="${this.ctrlId.title}"></label>
      <label>Стоимость<input name="price" data-id="${this.ctrlId.price}"></label>
      <div class="buttons">
        <button type="submit" data-id="${this.ctrlId.save}">Сохранить</button>
        <button type="reset" data-id="${this.ctrlId.cancel}">Отмена</button>
      </div>
    `;
  }

  static get ctrlId() {
    return {
      form: 'edit-form',
      title: 'title',
      price: 'price',
      save: 'save',
      cancel: 'cancel',
    };
  }

  static get titleSelector() {
    return `[data-id=${this.ctrlId.title}]`;
  }

  static get priceSelector() {
    return `[data-id=${this.ctrlId.price}]`;
  }

  static get saveSelector() {
    return `[data-id=${this.ctrlId.save}]`;
  }

  static get cancelSelector() {
    return `[data-id=${this.ctrlId.cancel}]`;
  }

  bindToDOM() {
    this.form = document.createElement('form');
    this.form.className = 'edit-form';
    this.form.dataset.widget = this.constructor.ctrlId.form;
    this.form.innerHTML = this.constructor.markup;
    document.body.appendChild(this.form);

    this.titleInput = this.form.querySelector(this.constructor.titleSelector);
    this.priceInput = this.form.querySelector(this.constructor.priceSelector);
    this.saveButton = this.form.querySelector(this.constructor.saveSelector);
    this.cancelButton = this.form.querySelector(this.constructor.cancelSelector);

    this.titleError = new Tooltip(this.titleInput);
    this.titleError.bindToDOM();
    this.priceError = new Tooltip(this.priceInput);
    this.priceError.bindToDOM();

    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    const product = {
      title: this.titleInput.value,
      price: this.priceInput.value,
    };

    if (this.index >= 0) {
      this.parentWidget.productList[this.index] = product;
    } else {
      this.parentWidget.productList.push(product);
    }
    this.parentWidget.redraw();

    this.form.classList.remove('active');
    this.parentWidget.isActive = true;
  }

  onReset() {
    this.form.classList.remove('active');
    this.parentWidget.isActive = true;
  }

  updateProduct(index = -1) {
    this.parentWidget.isActive = false;
    this.index = index;

    if (index >= 0) {
      const { title, price } = this.parentWidget.productList[index];
      this.titleInput.value = title;
      this.priceInput.value = price;
    } else {
      this.titleInput.value = '';
      this.priceInput.value = '';
    }
    this.form.classList.add('active');
  }
}
