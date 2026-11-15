// ===== waiter.js : JavaScript for the Waiter pages =====
// Login, sign up, "must log in" and Log out are handled by auth.js.
// Used by: dashboard.html, my-tables.html, ready-to-serve.html, customer-requests.html


// ---------- 1. Dashboard: name and date ----------

var nameBox = document.getElementById('name');
if (nameBox) {
  var session = null;
  try { session = JSON.parse(localStorage.getItem('session')); } catch (e) {}
  nameBox.textContent = session && session.name ? session.name : 'Waiter';
}

var todayBox = document.getElementById('today');
if (todayBox) {
  todayBox.textContent =
    new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}


// ---------- 2. My Tables: filter buttons ----------

var filterBar = document.getElementById('filters');
if (filterBar) {
  filterBar.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) return;

    var color = button.getAttribute('data-filter');
    var cards = document.querySelectorAll('.card');
    var shown = 0;

    for (var i = 0; i < cards.length; i++) {
      var match = color == 'all' || cards[i].getAttribute('data-status') == color;
      cards[i].hidden = !match;
      if (match) shown++;
    }

    var empty = document.getElementById('empty');
    if (empty) empty.hidden = shown > 0;
  });
}


// ---------- 3. Ready to Serve and Customer Requests: buttons and count ----------

// Update the number at the top, and show the empty message when nothing is left
function updateCount() {
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var list = document.getElementById('list');
  if (!count || !list) return;

  var left = list.querySelectorAll('.card').length;
  var onReadyPage = location.pathname.indexOf('ready-to-serve') != -1;

  if (left == 0) {
    count.innerText = onReadyPage ? 'Nothing waiting right now' : 'No requests right now';
    if (empty) empty.hidden = false;
  } else if (onReadyPage) {
    count.innerText = left + ' order' + (left > 1 ? 's' : '') + ' waiting at the kitchen';
  } else {
    count.innerText = left + ' request' + (left > 1 ? 's' : '') + ' waiting';
  }
}

document.addEventListener('click', function (e) {
  // Ready to Serve: "Mark as served" removes the card
  var servedButton = e.target.closest('[data-served]');
  if (servedButton) {
    servedButton.closest('.card').remove();
    updateCount();
    return;
  }

  // Customer Requests: first click = Accept, second click = Mark as done
  var stepButton = e.target.closest('[data-step]');
  if (stepButton) {
    var card = stepButton.closest('.card');
    if (stepButton.getAttribute('data-step') != 'taken') {
      stepButton.setAttribute('data-step', 'taken');
      stepButton.innerText = 'Mark as done';
      var badge = card.querySelector('.badge');
      if (badge) {
        badge.innerText = '⏳ In progress';
        badge.className = 'badge warn';
      }
    } else {
      card.remove();
      updateCount();
    }
  }
});