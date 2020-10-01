export default function splitPrice(price) {
  return String(price)
    .replace(/^(\d{1,3})(\d{3})(\d{3})$/, '$1 $2 $3')
    .replace(/^(\d{1,3})(\d{3})$/, '$1 $2');
}
