export function validateName(text) {
  const result = {
    status: false,
    value: text.trim(),
    error: '',
  };

  if (!result.value) {
    result.error = 'Заполните поле "Название"';
    return result;
  }

  if (result.value.length > 100) {
    result.error = 'Длина названия товара не должна превышать 100 символов';
    return result;
  }

  result.status = true;
  return result;
}

export function validatePrice(text) {
  const result = {
    status: false,
    value: text.replace(/\s/g, ''),
    error: '',
  };

  if (!result.value) {
    result.error = 'Заполните поле "Стоимость"';
    return result;
  }

  if (!/^\d+$/.test(result.value)) {
    result.error = 'Поле "Стоимость" может содержать только цифры и пробелы';
    return result;
  }

  result.value = +result.value;

  if (result.value < 1) {
    result.error = 'Стоимость товара не должна быть менее 1 рубля';
    return result;
  }

  if (result.value > 100000000) {
    result.error = 'Стоимость товара не должна быть более 100 000 000 рублей';
    return result;
  }

  result.status = true;
  return result;
}
