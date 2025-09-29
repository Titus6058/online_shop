const products = [
  {id:'p1',title:'Smartphone X1',price:24999,category:'Phones',rating:4.6,sku:'RX-001',image:'https://via.placeholder.com/400x300?text=Smartphone',desc:'Sleek 6.5" display, 128GB storage, 6GB RAM.'},
  {id:'p2',title:'Wireless Earbuds',price:3999,category:'Audio',rating:4.3,sku:'RX-002',image:'https://via.placeholder.com/400x300?text=Earbuds',desc:'Noise-cancelling buds with 24h battery.'},
  {id:'p3',title:'Powerbank 10000mAh',price:2199,category:'Accessories',rating:4.1,sku:'RX-003',image:'https://via.placeholder.com/400x300?text=Powerbank',desc:'Compact powerbank with fast charging.'},
  {id:'p4',title:'Laptop Pro 14"',price:89999,category:'Computers',rating:4.8,sku:'RX-004',image:'https://via.placeholder.com/400x300?text=Laptop',desc:'14" professional laptop, 512GB SSD, 16GB RAM.'},
  {id:'p5',title:'Smartwatch S',price:7999,category:'Wearables',rating:4.0,sku:'RX-005',image:'https://via.placeholder.com/400x300?text=Smartwatch',desc:'Health tracking, GPS, water resistant.'},
  {id:'p6',title:'Bluetooth Speaker',price:4999,category:'Audio',rating:4.2,sku:'RX-006',image:'https://via.placeholder.com/400x300?text=Speaker',desc:'Portable speaker with deep bass.'}
];

const state = {
  products: [...products],
  cart: JSON.parse(localStorage.getItem('rictei_cart') || '[]'),
  user: null
};

const elements = {
  productGrid: document.getElementById('productGrid'),
  cartCount: document.getElementById('cartCount'),
  cartDrawer: document.getElementById('cartDrawer'),
  cartItems: document.getElementById('cartItems'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartDelivery: document.getElementById('cartDelivery'),
  cartTotal: document.getElementById('cartTotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  productModal: document.getElementById('productModal'),
  overlay: document.getElementById('overlay'),
  modalTitle: document.getElementById('modalTitle'),
  modalImage: document.getElementById('modalImage'),
  modalDesc: document.getElementById('modalDesc'),
  modalPrice: document.getElementById('modalPrice'),
  modalRating: document.getElementById('modalRating'),
  modalSKU: document.getElementById('modalSKU'),
  modalCategory: document.getElementById('modalCategory'),
  modalQty: document.getElementById('modalQty'),
  addToCartModal: document.getElementById('addToCartModal'),
  buyNow: document.getElementById('buyNow'),
  closeProductModal: document.getElementById('closeProductModal'),
  cartBtn: document.getElementById('cartBtn'),
  closeCart: document.getElementById('closeCart'),
  clearCart: document.getElementById('clearCart'),
  checkoutModal: document.getElementById('checkoutModal'),
  checkoutForm: document.getElementById('checkoutForm'),
  checkoutSummary: document.getElementById('checkoutSummary'),
  checkoutTotal: document.getElementById('checkoutTotal'),
  paymentMethod: document.getElementById('paymentMethod'),
  messageToast: document.getElementById('messageToast'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortSelect: document.getElementById('sortSelect'),
  maxPrice: document.getElementById('maxPrice'),
  maxPriceVal: document.getElementById('maxPriceVal'),
  catalogMeta: document.getElementById('catalogMeta'),
  shopNow: document.getElementById('shopNow'),
  viewCart: document.getElementById('viewCart'),
  homeLink: document.getElementById('homeLink'),
  yearEl: document.getElementById('year')
};

function init(){
  elements.yearEl.textContent = new Date().getFullYear();
  populateCategories();
  renderProducts(state.products);
  renderCart();
  bindEvents();
  elements.maxPriceVal.textContent = `KES ${elements.maxPrice.value}`;
}

function populateCategories(){
  const cats = ['All categories', ...Array.from(new Set(products.map(p=>p.category)))];
  elements.categoryFilter.innerHTML = '';
  cats.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c === 'All categories' ? 'all' : c;
    opt.textContent = c;
    elements.categoryFilter.appendChild(opt);
  });
}

function renderProducts(list){
  elements.productGrid.innerHTML = '';
  elements.catalogMeta.textContent = `Showing ${list.length} products`;
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <div class="title">${p.title}</div>
      <div class="meta"><div class="rating">★ ${p.rating}</div><div class="price">KES ${p.price.toLocaleString()}</div></div>
      <div class="actions">
        <button class="btn small view" data-id="${p.id}">Quick view</button>
        <button class="btn primary add" data-id="${p.id}">Add to cart</button>
      </div>
    `;
    elements.productGrid.appendChild(card);
  });
}

function openProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  elements.modalTitle.textContent = p.title;
  elements.modalImage.src = p.image;
  elements.modalDesc.textContent = p.desc;
  elements.modalPrice.textContent = `KES ${p.price.toLocaleString()}`;
  elements.modalRating.textContent = `★ ${p.rating}`;
  elements.modalSKU.textContent = p.sku;
  elements.modalCategory.textContent = p.category;
  elements.modalQty.value = 1;
  elements.addToCartModal.dataset.id = id;
  elements.buyNow.dataset.id = id;
  showModal(elements.productModal);
}

function showModal(modal){
  elements.overlay.hidden = false;
  modal.hidden = false;
}

function closeModal(modal){
  elements.overlay.hidden = true;
  modal.hidden = true;
}

function addToCart(id, qty=1){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const existing = state.cart.find(i=>i.id===id);
  if(existing) existing.qty += qty;
  else state.cart.push({id:p.id,title:p.title,price:p.price,sku:p.sku,image:p.image,qty});
  persistCart();
  renderCart();
  toast('Added to cart');
}

function persistCart(){
  localStorage.setItem('rictei_cart',JSON.stringify(state.cart));
}

function renderCart(){
  elements.cartItems.innerHTML = '';
  if(state.cart.length === 0){
    elements.cartItems.innerHTML = '<div class="muted">Your cart is empty</div>';
    elements.checkoutBtn.disabled = true;
  } else {
    state.cart.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="info">
          <div style="font-weight:600">${item.title}</div>
          <div class="muted">SKU ${item.sku}</div>
          <div class="qty">
            <button class="btn small dec" data-id="${item.id}">−</button>
            <span class="muted">${item.qty}</span>
            <button class="btn small inc" data-id="${item.id}">＋</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">KES ${(item.price*item.qty).toLocaleString()}</div>
          <button class="btn" data-id="${item.id}" aria-label="Remove">Remove</button>
        </div>
      `;
      elements.cartItems.appendChild(div);
    });
    elements.checkoutBtn.disabled = false;
  }
  const subtotal = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = subtotal > 0 ? calculateDelivery(subtotal) : 0;
  const total = subtotal + delivery;
  elements.cartSubtotal.textContent = `KES ${subtotal.toLocaleString()}`;
  elements.cartDelivery.textContent = `KES ${delivery.toLocaleString()}`;
  elements.cartTotal.textContent = `KES ${total.toLocaleString()}`;
  elements.cartCount.textContent = state.cart.reduce((s,i)=>s+i.qty,0);
}

function calculateDelivery(subtotal){
  if(subtotal>50000) return 0;
  if(subtotal>10000) return 300;
  return 500;
}

function bindEvents(){
  document.addEventListener('click', (e)=>{
    if(e.target.matches('.view')) openProductModal(e.target.dataset.id);
    if(e.target.matches('.add')) addToCart(e.target.dataset.id,1);
    if(e.target.matches('.add-to-cart')) addToCart(e.target.dataset.id,1);
    if(e.target.id === 'cartBtn' || e.target.closest('#cartBtn')) toggleCart();
    if(e.target.id === 'closeCart') closeCartDrawer();
    if(e.target.id === 'clearCart') { state.cart=[]; persistCart(); renderCart(); }
    if(e.target.matches('.inc')) { updateQty(e.target.dataset.id,1) }
    if(e.target.matches('.dec')) { updateQty(e.target.dataset.id,-1) }
    if(e.target.matches('.cart-item button[aria-label="Remove"]')) { removeFromCart(e.target.dataset.id) }
    if(e.target.id === 'addToCartModal') addToCart(e.target.dataset.id, Number(elements.modalQty.value)||1);
    if(e.target.id === 'buyNow') { addToCart(e.target.dataset.id, Number(elements.modalQty.value)||1); openCheckout(); }
    if(e.target.id === 'closeProductModal') closeModal(elements.productModal);
    if(e.target.id === 'overlay') { closeModal(elements.productModal); closeModal(elements.checkoutModal); closeCartDrawer(); elements.overlay.hidden = true; }
    if(e.target.id === 'checkoutBtn') openCheckout();
    if(e.target.id === 'shopNow') window.scrollTo({top:document.querySelector('.catalog').offsetTop,behavior:'smooth'});
    if(e.target.id === 'viewCart') openCartDrawer();
    if(e.target.id === 'homeLink') { window.scrollTo({top:0,behavior:'smooth'}) }
  });
  elements.searchBtn.addEventListener('click', handleSearch);
  elements.searchInput.addEventListener('keyup', (e)=>{ if(e.key==='Enter') handleSearch() });
  elements.sortSelect.addEventListener('change', handleFilters);
  elements.categoryFilter.addEventListener('change', handleFilters);
  elements.maxPrice.addEventListener('input', (e)=>{ elements.maxPriceVal.textContent = `KES ${e.target.value}`; handleFilters(); });
  elements.checkoutForm.addEventListener('submit', handlePlaceOrder);
  document.getElementById('closeCheckout').addEventListener('click', ()=>closeModal(elements.checkoutModal));
  document.getElementById('cancelCheckout').addEventListener('click', ()=>closeModal(elements.checkoutModal));
  document.getElementById('closeCart').addEventListener('click', closeCartDrawer);
  elements.overlay.addEventListener('click', ()=>{ elements.overlay.hidden = true; elements.productModal.hidden = true; elements.checkoutModal.hidden = true; elements.cartDrawer.setAttribute('aria-hidden','true') });
}

function toggleCart(){
  const hidden = elements.cartDrawer.getAttribute('aria-hidden') === 'true' || !elements.cartDrawer.hasAttribute('aria-hidden');
  if(hidden) openCartDrawer(); else closeCartDrawer();
}

function openCartDrawer(){
  elements.cartDrawer.setAttribute('aria-hidden','false');
  elements.overlay.hidden = false;
}

function closeCartDrawer(){
  elements.cartDrawer.setAttribute('aria-hidden','true');
  elements.overlay.hidden = true;
}

function updateQty(id, delta){
  const item = state.cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    state.cart = state.cart.filter(i=>i.id!==id);
  }
  persistCart();
  renderCart();
}

function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id!==id);
  persistCart();
  renderCart();
}

function handleSearch(){
  const q = elements.searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p=>{
    return (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });
  renderProducts(filtered);
}

function handleFilters(){
  const category = elements.categoryFilter.value;
  const sort = elements.sortSelect.value;
  const max = Number(elements.maxPrice.value);
  let list = products.filter(p=>p.price <= max);
  if(category !== 'all') list = list.filter(p=>p.category === category);
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  if(sort === 'rating-desc') list.sort((a,b)=>b.rating-b.rating);
  renderProducts(list);
}

function openCheckout(){
  if(state.cart.length === 0){ toast('Cart is empty'); return; }
  elements.checkoutSummary.innerHTML = '';
  state.cart.forEach(i=>{
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.marginBottom = '6px';
    div.innerHTML = `<div>${i.title} × ${i.qty}</div><div>KES ${(i.price*i.qty).toLocaleString()}</div>`;
    elements.checkoutSummary.appendChild(div);
  });
  const subtotal = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = calculateDelivery(subtotal);
  const total = subtotal + delivery;
  elements.checkoutTotal.textContent = `KES ${total.toLocaleString()}`;
  elements.checkoutModal.hidden = false;
  elements.overlay.hidden = false;
}

function handlePlaceOrder(e){
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const method = elements.paymentMethod.value;
  if(!name||!email||!phone||!address){ toast('Please complete the form'); return; }
  const order = {
    id: 'ORD'+Date.now(),
    customer:{name,email,phone,address},
    items: [...state.cart],
    method,
    placedAt:new Date().toISOString()
  };
  if(method === 'mpesa'){
    simulateMpesa(order);
  } else if(method === 'card'){
    simulateCard(order);
  } else {
    finalizeOrder(order,{status:'pending',message:'Cash on Delivery selected'});
  }
}

function simulateMpesa(order){
  toast('Initiating M-Pesa payment (simulated). You will receive a phone prompt.');
  setTimeout(()=>{
    const success = Math.random() > 0.12;
    if(success){
      finalizeOrder(order,{status:'paid',message:'M-Pesa payment successful'});
    } else {
      toast('M-Pesa payment failed. Try another method.');
    }
  },1500);
}

function simulateCard(order){
  const subtotal = order.items.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = calculateDelivery(subtotal);
  const total = subtotal + delivery;
  const form = document.createElement('form');
  form.action = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
  form.method = 'POST';
  form.target = '_blank';
  const inputCmd = document.createElement('input'); inputCmd.type='hidden'; inputCmd.name='cmd'; inputCmd.value='_xclick';
  const inputBusiness = document.createElement('input'); inputBusiness.type='hidden'; inputBusiness.name='business'; inputBusiness.value='seller@example.com';
  const inputItem = document.createElement('input'); inputItem.type='hidden'; inputItem.name='item_name'; inputItem.value=`Order ${order.id}`;
  const inputAmount = document.createElement('input'); inputAmount.type='hidden'; inputAmount.name='amount'; inputAmount.value=(total/140).toFixed(2);
  const inputCurrency = document.createElement('input'); inputCurrency.type='hidden'; inputCurrency.name='currency_code'; inputCurrency.value='USD';
  form.append(inputCmd,inputBusiness,inputItem,inputAmount,inputCurrency);
  document.body.appendChild(form);
  form.submit();
  setTimeout(()=>{ finalizeOrder(order,{status:'paid',message:'Card/PayPal simulated payment completed'}) },1200);
}

function finalizeOrder(order,payment){
  state.cart = [];
  persistCart();
  renderCart();
  closeModal(elements.checkoutModal);
  closeCartDrawer();
  const confirmation = {
    orderId: order.id,
    status: payment.status,
    message: payment.message,
    placedAt: order.placedAt
  };
  toast(`Order ${confirmation.orderId} confirmed. ${confirmation.message}`);
  showOrderReceipt(confirmation);
}

function showOrderReceipt(info){
  elements.messageToast.hidden = false;
  elements.messageToast.textContent = `Order ${info.orderId} • ${info.status.toUpperCase()} • ${new Date(info.placedAt).toLocaleString()}`;
  setTimeout(()=>{ elements.messageToast.hidden = true },6000);
}

function toast(text){
  elements.messageToast.hidden = false;
  elements.messageToast.textContent = text;
  setTimeout(()=>{ elements.messageToast.hidden = true },3000);
}

init();
