// auth.js - signup validation, login check, and "you must log in" protection
(function () {
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const m = location.pathname.match(/\/(admin|customer|waiter|chef|cashier)\//i);
  const folder = m ? m[1].toLowerCase() : null;          // which user's folder we are in
  const page = location.pathname.split('/').pop().toLowerCase();
  const session = read('session', null);

  // 1. dashboards are only for logged-in users of that folder
  if (folder && page !== 'login.html' && (!session || session.role !== folder)) { location.href = 'login.html'; return; }

  // 2. show the user's name and make Log out clear the login
  if (folder && session) {
    const r = document.querySelector('.sidebar .role');
    if (r) r.textContent += ' - ' + session.name;
    const out = document.querySelector('.logout');
    if (out) out.onclick = () => localStorage.removeItem('session');
  }

  // shows (or clears) a red message under an input. Returns true when there is no problem.
  function setError(input, msg) {
    let e = input.nextElementSibling;
    if (!e || !e.classList.contains('error')) { e = document.createElement('span'); e.className = 'error'; input.after(e); }
    e.textContent = msg;
    return !msg;
  }
  const form = document.querySelector('.auth form');
  if (!form) return;
  const f = id => form.querySelector('#' + id);
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // 3. LOGIN page
  if (page === 'login.html') {
    form.onsubmit = e => {
      e.preventDefault();
      const email = f('email'), pass = f('password'), mail = email.value.trim().toLowerCase();
      const a = setError(email, emailOk(mail) ? '' : 'Enter a valid email.');
      const b = setError(pass, pass.value.length >= 6 ? '' : 'Password must be at least 6 characters.');
      if (!a || !b) return;
      let user = null;
      if (folder === 'admin') {
        if (mail === 'sadia@khabar.com' && pass.value === 'sadia@123') user = { name: 'Admin', email: mail, role: 'admin' };
      } else {
        const u = read('users', []).find(x => x.email === mail && x.password === pass.value && x.role === folder);
        if (u) user = { name: u.name, email: u.email, role: u.role };
      }
      if (!user) { setError(pass, 'Wrong email or password. New here? Sign up first.'); return; }
      localStorage.setItem('session', JSON.stringify(user));
      location.href = 'dashboard.html';
    };
  }

  // 4. SIGN UP page
  if (page === 'signup.html') {
    form.onsubmit = e => {
      e.preventDefault();
      const name = f('name'), email = f('email'), phone = f('phone'), role = f('role'), pass = f('password');
      const mail = email.value.trim().toLowerCase(), r = role.value.toLowerCase(), users = read('users', []);
      const results = [
        setError(name, name.value.trim().length >= 3 ? '' : 'Name must be at least 3 letters.'),
        setError(email, !emailOk(mail) ? 'Enter a valid email.' : users.some(u => u.email === mail && u.role === r) ? 'Already registered for this user type.' : ''),
        setError(phone, /^01\d{9}$/.test(phone.value.trim()) ? '' : 'Phone must be 11 digits and start with 01.'),
        setError(pass, pass.value.length >= 6 && /[A-Za-z]/.test(pass.value) && /\d/.test(pass.value) ? '' : 'Password needs 6+ characters, a letter and a number.')
      ];
      if (results.includes(false)) return;
      users.push({ name: name.value.trim(), email: mail, phone: phone.value.trim(), role: r, password: pass.value });
      localStorage.setItem('users', JSON.stringify(users));
      let msg = form.querySelector('.msg');
      if (!msg) { msg = document.createElement('p'); msg.className = 'msg'; form.appendChild(msg); }
      msg.textContent = 'Account created! Going back to the home page...';
      setTimeout(() => location.href = 'index.html', 1500);
    };
  }
})();
