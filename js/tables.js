// tables.js - adds Search + Add / Edit / Delete to every table on a page.
// Changes are saved in the browser (localStorage), so they stay after refresh.
document.querySelectorAll('main table').forEach((table, n) => {
  const key = 'table:' + location.pathname.toLowerCase() + ':' + n;
  const body = table.tBodies[0];
  const heads = [...table.querySelectorAll('thead th')].map(th => th.textContent);
  // first visit: read the rows from the HTML. Later visits: use the saved rows.
  let rows = JSON.parse(localStorage.getItem(key) || 'null') || [...body.rows].map(tr =>
    [...tr.cells].map(td => { const b = td.querySelector('.badge'); return { t: td.textContent.trim(), c: b ? b.className.replace('badge', '').trim() : '' }; }));
  let editing = -1;
  table.querySelector('thead tr').appendChild(Object.assign(document.createElement('th'), { textContent: 'Actions' }));

  // search box + add/edit form, built with the DOM and placed above the table
  const box = document.createElement('div');
  box.innerHTML = '<div class="toolbar"><input type="search" placeholder="Search..." aria-label="Search"></div>' +
    '<form class="addrow" novalidate>' + heads.map(h => `<input placeholder="${h.replace(/"/g, '&quot;')}" aria-label="${h.replace(/"/g, '&quot;')}">`).join('') +
    '<button type="submit">Add</button> <button type="button" class="secondary" hidden>Cancel</button><p class="error"></p></form>';
  table.parentElement.before(box);
  const q = box.querySelector('input[type=search]'), form = box.querySelector('form');
  const inputs = [...form.querySelectorAll('input')], addBtn = form.querySelector('button');
  const cancel = form.querySelector('.secondary'), err = form.querySelector('.error');
  const save = () => localStorage.setItem(key, JSON.stringify(rows));

  function draw() {                                   // READ + SEARCH
    body.innerHTML = '';
    rows.forEach((r, i) => {
      const tr = document.createElement('tr');
      r.forEach(c => {
        const td = document.createElement('td');
        if (c.c) { const s = document.createElement('span'); s.className = 'badge ' + c.c; s.textContent = c.t; td.appendChild(s); }
        else td.textContent = c.t;
        tr.appendChild(td);
      });
      const act = document.createElement('td');
      act.innerHTML = `<button type="button" data-edit="${i}">Edit</button><button type="button" class="del" data-del="${i}">Delete</button>`;
      tr.appendChild(act);
      tr.hidden = !r.map(c => c.t).join(' ').toLowerCase().includes(q.value.toLowerCase());
      body.appendChild(tr);
    });
  }
  function reset() { form.reset(); editing = -1; addBtn.textContent = 'Add'; cancel.hidden = true; err.textContent = ''; }

  form.onsubmit = e => {                              // CREATE + UPDATE
    e.preventDefault();
    if (inputs.some(i => !i.value.trim())) { err.textContent = 'Fill in every box.'; return; }
    if (editing >= 0) inputs.forEach((i, j) => rows[editing][j].t = i.value.trim());
    else rows.push(inputs.map(i => ({ t: i.value.trim(), c: '' })));
    save(); reset(); draw();
  };
  body.onclick = e => {                               // DELETE + start EDIT
    const ed = e.target.dataset.edit, del = e.target.dataset.del;
    if (del !== undefined && confirm('Delete this row?')) { rows.splice(del, 1); save(); reset(); draw(); }
    if (ed !== undefined) {
      editing = +ed; inputs.forEach((i, j) => i.value = rows[editing][j].t);
      addBtn.textContent = 'Update'; cancel.hidden = false; form.scrollIntoView();
    }
  };
  cancel.onclick = reset; q.oninput = draw; draw();
});
