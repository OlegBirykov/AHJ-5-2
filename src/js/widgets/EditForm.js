import Tooltip from './Tooltip';
import { validateName, validatePrice } from '../tools/validation';
import splitPrice from '../tools/utils';

export default class EditForm {
  constructor(parentWidget) {
    this.parentWidget = parentWidget;
  }

  static get markup() {
    return `
      <label>Название<input type="text" name="name" data-id="${this.ctrlId.name}"></label>
      <label>Стоимость<input type="text" name="price" data-id="${this.ctrlId.price}"></label>
      <div class="buttons">
        <button type="submit" data-id="${this.ctrlId.save}">Сохранить</button>
        <button type="reset" data-id="${this.ctrlId.cancel}">Отмена</button>
      </div>
    `;
  }

  static get ctrlId() {
    return {
      form: 'edit-form',
      name: 'name',
      price: 'price',
      save: 'save',
      cancel: 'cancel',
    };
  }

  static get nameSelector() {
    return `[data-id=${this.ctrlId.name}]`;
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

    this.nameInput = this.form.querySelector(this.constructor.nameSelector);
    this.priceInput = this.form.querySelector(this.constructor.priceSelector);
    this.saveButton = this.form.querySelector(this.constructor.saveSelector);
    this.cancelButton = this.form.querySelector(this.constructor.cancelSelector);

    this.nameError = new Tooltip(this.nameInput);
    this.nameError.bindToDOM();
    this.priceError = new Tooltip(this.priceInput);
    this.priceError.bindToDOM();

    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
    this.nameInput.addEventListener('input', this.hideTooltips.bind(this));
    this.priceInput.addEventListener('input', this.hideTooltips.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    const product = {
      name: this.nameInput.value,
      price: this.priceInput.value,
    };

    const validName = validateName(product.name);
    if (!validName.status) {
      this.nameError.show(validName.error);
      return;
    }

    const validPrice = validatePrice(product.price);
    if (!validPrice.status) {
      this.priceError.show(validPrice.error);
      return;
    }

    product.name = validName.value;
    product.price = validPrice.value;

    if (this.index >= 0) {
      this.parentWidget.productList[this.index] = product;
    } else {
      this.parentWidget.productList.push(product);
    }
    this.parentWidget.redraw();

    this.onReset();
  }

  onReset() {
    this.hideTooltips();
    this.form.classList.remove('active');
    this.parentWidget.isActive = true;
  }

  onResize() {
    this.form.style.left = `${window.scrollX + window.innerWidth / 2 - this.form.offsetWidth / 2}px`;
    this.form.style.top = `${window.scrollY + window.innerHeight / 2 - this.form.offsetHeight / 2}px`;
  }

  updateProduct(index = -1) {
    this.parentWidget.isActive = false;
    this.index = +index;

    if (index >= 0) {
      const { name, price } = this.parentWidget.productList[index];
      this.nameInput.value = name;
      this.priceInput.value = splitPrice(price);
    } else {
      this.nameInput.value = '';
      this.priceInput.value = '';
    }

    this.form.classList.add('active');
    this.onResize();
  }

  hideTooltips() {
    this.nameError.hide();
    this.priceError.hide();
  }
}
