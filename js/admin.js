// admin.js - CRUD: Menu. Unique features: Approve staff, Block users, Sales summary

// Dashboard: show the real staff numbers from the Staff Overview table
(function () {
  if (location.pathname.split('/').pop().toLowerCase() !== 'dashboard.html') return;

  // the Staff Overview table saves its rows under this key (set by tables.js)
  const key = 'table:' + location.pathname.toLowerCase().replace('dashboard.html', 'staff.html') + ':0';
  const rows = JSON.parse(localStorage.getItem(key) || 'null');
  const card = document.querySelector('a.card[href="staff.html"]');
  if (!rows || !card) return;                     // nothing saved yet: keep the numbers in the HTML

  // column 4 (index 3) is Status
  const onDuty = rows.filter(r => r[3] && r[3].t.trim().toLowerCase() === 'on duty').length;
  card.querySelector('.big').textContent = onDuty;
  card.querySelector('p').textContent = 'Out of ' + rows.length;
})();

function userTable(box, filter, buttons) {
  const draw = () => {
    const users = DB.get('users', []).filter(filter);
    box.innerHTML = users.length
      ? '<table><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>' + users.map(u =>
        `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.role}</td><td>${u.status}</td><td>${buttons(u)}</td></tr>`).join('') + '</table>'
      : '<p class="empty">Nothing to show here.</p>';
  };
  box.onclick = e => {
    if (!e.target.dataset.s) return;
    const all = DB.get('users', []);
    all.find(u => u.id == e.target.dataset.id).status = e.target.dataset.s;
    DB.set('users', all); toast('Saved'); draw();
  };
  draw();
}
const btn = (u, s, text, cls) => `<button class="small ${cls || ''}" data-id="${u.id}" data-s="${s}">${text}</button>`;

startDashboard('admin', [
  { label: 'Manage Menu', render: box => buildCrud(box, { title: 'menu', key: 'menu', fields: [
    { name: 'name', label: 'Dish name', type: 'text' },
    { name: 'category', label: 'Category', options: ['Rice & Curry', 'Starters', 'Drinks'] },
    { name: 'price', label: 'Price (৳)', type: 'number', min: 1 },
    { name: 'available', label: 'Available', options: ['Yes', 'No'] }] }) },

  { label: 'Approve Staff', render: box => userTable(box, u => u.status === 'pending',
    u => btn(u, 'active', 'Approve') + ' ' + btn(u, 'rejected', 'Reject', 'danger')) },

  { label: 'Block / Unblock Users', render: box => userTable(box, u => u.role !== 'admin' && (u.status === 'active' || u.status === 'blocked'),
    u => u.status === 'active' ? btn(u, 'blocked', 'Block', 'danger') : btn(u, 'active', 'Unblock')) },

  { label: 'Sales Summary', render: box => {
    const orders = DB.get('orders', []), sold = {};
    const revenue = orders.filter(o => o.status === 'Served').reduce((s, o) => s + o.total, 0);
    orders.forEach(o => o.items.forEach(i => sold[i.name] = (sold[i.name] || 0) + i.qty));
    const top = Object.entries(sold).sort((a, b) => b[1] - a[1]);
    box.innerHTML = `<div class="grid"><div class="card"><h3>Total orders</h3><div class="big">${orders.length}</div></div>
      <div class="card"><h3>Revenue (served)</h3><div class="big">৳${revenue}</div></div></div><h2>Dishes sold</h2>` +
      top.map(([n, q]) => `<div class="row"><span>${esc(n)}</span><div class="bar"><span data-w="${q / top[0][1] * 100}"></span></div><span>${q}</span></div>`).join('');
    box.querySelectorAll('.bar span').forEach(s => s.style.width = s.dataset.w + '%');
  } }
]);