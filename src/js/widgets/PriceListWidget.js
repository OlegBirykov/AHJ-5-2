import EditForm from './EditForm';
import DeleteForm from './DeleteForm';

export default class PriceListWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.productList = [];
    this.isActive = true;
  }

  static get markup() {
    return `
    <div class="price-list-form" data-widget="price-list-form">
      <div class="header">
        <p>Товары</p>
        <p class="icon" data-id="${this.ctrlId.add}">+</p>
      </div>
      <table>
        <thead>
          <tr>
            <td class="title">Название</td>
            <td class="price">Стоимость</td>
            <td class="actions">Действия</td>
          </tr>
        </thead>
        <tbody data-id="${this.ctrlId.list}">
        </tbody>
      </table>
    </div>
    `;
  }

  static get ctrlId() {
    return {
      list: 'product-list',
      add: 'command-create',
      edit: 'command-edit',
      delete: 'command-delete',
    };
  }

  static get listSelector() {
    return `[data-id=${this.ctrlId.list}]`;
  }

  static get addSelector() {
    return `[data-id=${this.ctrlId.add}]`;
  }

  static get editSelector() {
    return `[data-id=${this.ctrlId.edit}]`;
  }

  static get deleteSelector() {
    return `[data-id=${this.ctrlId.delete}]`;
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;

    this.editForm = new EditForm(this);
    this.editForm.bindToDOM();
    this.deleteForm = new DeleteForm(this);
    this.deleteForm.bindToDOM();

    this.addButton = this.parentEl.querySelector(this.constructor.addSelector);
    this.listContainer = this.parentEl.querySelector(this.constructor.listSelector);

    this.addButton.addEventListener('click', this.onAddButtonClick.bind(this));
    this.listContainer.addEventListener('click', this.onListContainerClick.bind(this));

    this.redraw();
  }

  onAddButtonClick() {
    if (!this.isActive) {
      return;
    }
    this.editForm.updateProduct();
  }

  onListContainerClick() {
    if (!this.isActive) {
      return;
    }
    console.log('Нажали на таблицу');
  }

  redraw() {
    this.listContainer.innerHTML = this.productList.reduce((str, { title, price }, i) => `
      ${str}
      <tr data-index="${i}">
        <td class="title">${title}</td>
        <td class="price">${price}</td>
        <td class="actions">
          <span class="icon" data-id="${this.constructor.ctrlId.edit}">&#x270E;</span>
          <span class="icon delete" data-id="${this.constructor.ctrlId.delete}">&times;</span>
        </td>
      </tr>
    `, '');
  }
}
