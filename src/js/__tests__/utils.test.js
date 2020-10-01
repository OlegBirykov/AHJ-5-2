import splitPrice from '../tools/utils';

test.each([
  [100000000, '100 000 000'],
  [12345678, '12 345 678'],
  [1234567, '1 234 567'],
  [123456, '123 456'],
  [12345, '12 345'],
  [1234, '1 234'],
  [123, '123'],
  [12, '12'],
  [1, '1'],

])(('the price string should be split'), (price, string) => {
  expect(splitPrice(price)).toBe(string);
});
