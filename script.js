import { products } from './data.js';
const dom = {
  products: document.querySelector('#products'),
  sortButtons: document.querySelectorAll('.sort-btn'),
};

let currentSortKey = 'price';
let isAscOrder = true;

dom.sortButtons.forEach(button => {
  button.addEventListener('click', () => handleSortButtonClick(button));
});

function updateSortIcon(button, isAscOrder) {
  const isAscIcon = button.querySelector(`[data-is-asc-order='true']`);
  const isDescIcon = button.querySelector(`[data-is-asc-order='false']`);
  isAscIcon.classList.toggle('hidden', !isAscOrder);
  isDescIcon.classList.toggle('hidden', isAscOrder);
}

function toggleSortIcons(button) {
  dom.sortButtons.forEach(btn => {
    btn.classList.remove('active');
    const isAscIcon = btn.querySelector(`[data-is-asc-order='true']`);
    const isDescIcon = btn.querySelector(`[data-is-asc-order='false']`);
    isAscIcon.classList.remove('hidden');
    isDescIcon.classList.add('hidden');
  });

  button.classList.add('active');
}

function handleSortButtonClick(button) {
  toggleSortIcons(button, isAscOrder);
  const sortKey = button.dataset.sort;
  isAscOrder = currentSortKey === sortKey ? !isAscOrder : true;
  currentSortKey = sortKey;
  const sortedProducts = sortProductsByKey(products, sortKey, isAscOrder);
  renderProducts(sortedProducts, dom.products);
  updateSortIcon(button, isAscOrder);
}

function productCardBuild({ id, img, title, params: { price, buy, dates } }) {
  const date = new Date(dates);
  const dateFormat = [date.getDate(), date.getMonth(), date.getFullYear()].join(
    '.',
  );
  const productCard = `
    <div class="card" data-id =${id}>
    <div class="card-img">
        <img src="${img}" alt="${title}">
    </div>
    <h2 class="card-title">${title}</h2>
    <div class="card-params">
        <div>Ціна: <span>${price} грн</span></div>
        <div>Купили: <span>${buy}</span></div>
        <div>Дата: <span>${dateFormat}</span></div>
    </div>
</div>
    `;
  return productCard;
}
function renderProducts(products, parentBlock) {
  const cardsHTML = products.map(productCardBuild);
  parentBlock.innerHTML = cardsHTML.join('');
}

function sortProductsByKey(products, key, order) {
  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a.params[key];
    const bValue = b.params[key];

    if (aValue < bValue) return order ? -1 : 1;
    if (aValue > bValue) return order ? 1 : -1;
    return 0;
  });

  return sortedProducts;
}

renderProducts(
  sortProductsByKey(products, currentSortKey, isAscOrder),
  dom.products,
);
