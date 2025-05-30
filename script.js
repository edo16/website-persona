let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow w-60 text-center';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover mb-2 rounded">
      <h3 class="text-lg font-semibold">${p.name}</h3>
      <p class="mb-2">Rp ${p.price}</p>
      <button onclick="addToCart('${p.name}', ${p.price})" class="bg-orange-500 text-white py-1 px-3 rounded">+ Keranjang</button>
    `;
    container.appendChild(div);
  });
}

function populateCategories() {
  const select = document.getElementById('category-filter');
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
}

function filterProducts() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;
  const filtered = products.filter(p =>
    (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
}

document.getElementById('search').oninput = filterProducts;
document.getElementById('category-filter').onchange = filterProducts;
populateCategories();
renderProducts(products);

function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart();
  updateCartUI();
}
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  updateCartUI();
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.qty * item.price;
    cartItems.innerHTML += `
      <li class="flex justify-between items-center">
        <span>${item.name} x${item.qty} = Rp ${item.qty * item.price}</span>
        <button onclick="removeFromCart('${item.name}')" class="text-red-500">Hapus</button>
      </li>
    `;
  });
  document.getElementById('total').textContent = total;
  document.getElementById('cart-count').textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}
function toggleCart() {
  document.getElementById('cart').classList.toggle('hidden');
}
function checkout() {
  const date = new Date().toISOString();
  const order = { cart, date };
  saveOrder(order);
  showReceipt(order);
  cart = [];
  saveCart();
  updateCartUI();
  toggleCart();
  showOrderHistory();
}
function saveOrder(order) {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(order);
  localStorage.setItem('history', JSON.stringify(history));
}
// Fungsi untuk render ulang riwayat transaksi dengan tombol hapus
function showOrderHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const list = document.getElementById('order-history');
    list.innerHTML = '';
    history.forEach((o, index) => {
      const li = document.createElement('li');
      li.className = 'border p-2 rounded mb-2 bg-white shadow';
  
      li.innerHTML = `
        <div class="flex justify-between items-center">
          <strong>${new Date(o.date).toLocaleString()}</strong>
          <button onclick="deleteOrder(${index})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Hapus</button>
        </div>
        <ul class="list-disc ml-5 mt-1">
          ${o.cart.map(i => `<li>${i.name} x${i.qty} = Rp ${i.qty * i.price}</li>`).join('')}
        </ul>
      `;
  
      list.appendChild(li);
    });
  }
  
  // Fungsi hapus transaksi berdasarkan index
  function deleteOrder(index) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.splice(index, 1); // Hapus transaksi index ke-
    localStorage.setItem('history', JSON.stringify(history));
    showOrderHistory(); // Render ulang riwayat
  }

function showReceipt(order) {
  let html = `<p>${new Date(order.date).toLocaleString()}</p><hr class="my-2" />`;
  let total = 0;
  order.cart.forEach(item => {
    const sub = item.qty * item.price;
    total += sub;
    html += `<p>${item.name} x${item.qty} = Rp ${sub}</p>`;
  });
  html += `<hr class="my-2" /><p>Total: Rp ${total}</p>`;
  document.getElementById('receipt-content').innerHTML = html;
  document.getElementById('receipt-modal').classList.remove('hidden');
}
updateCartUI();
showOrderHistory();