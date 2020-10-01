import { validateName, validatePrice } from '../tools/validation';

test.each([
  ['  ', false, '', 'Заполните поле "Название"'],
  [
    '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789*',
    false,
    '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789*',
    'Длина названия товара не должна превышать 100 символов',
  ],
  [
    '   0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789  ',
    true,
    '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
    '',
  ],

])(('the name should be valid'), (name, status, value, error) => {
  const result = validateName(name);
  expect(result.status).toBe(status);
  expect(result.value).toBe(value);
  expect(result.error).toBe(error);
});

test.each([
  ['  ', false, '', 'Заполните поле "Стоимость"'],
  [' 45 56 34 t4 54', false, '455634t454', 'Поле "Стоимость" может содержать только цифры и пробелы'],
  [' 45 56 34 84 54', false, 4556348454, 'Стоимость товара не должна быть более 100 000 000 рублей'],
  [' 0   ', false, 0, 'Стоимость товара не должна быть менее 1 рубля'],
  [' 123  45 6   ', true, 123456, ''],

])(('the price should be valid'), (name, status, value, error) => {
  const result = validatePrice(name);
  expect(result.status).toBe(status);
  expect(result.value).toBe(value);
  expect(result.error).toBe(error);
});
