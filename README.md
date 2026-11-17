# Khabar Ghor — Food Management System (Frontend Version)

CSC 3215 Web Technologies project (Fall 2026-27). Built only with HTML pages and forms, one
external CSS file, external JavaScript files, JavaScript form validation and DOM manipulation.
A PHP + MySQL backend can be added later.

## How to run

No installation needed. Open `index.html` in Chrome or Firefox
(double-click it, or use VS Code's Live Server).

Each user type has its **own login page** that asks for an email and a password.
The role of the account decides which dashboard opens.

| Role | Email | Password |
|---|---|---|
| Admin | `sadia@khabar.com` | `sadia@123` |
| Customer | create one on `signup.html` | your own password |
| Waiter | create one on `signup.html` | your own password |
| Cashier | create one on `signup.html` | your own password |

### Sign up and login

- **One sign up page** (`signup.html`) for Customers, Waiters and Cashiers. The user picks the type
  from a drop-down list.
- Validation (shown in red under each field):
  - **Name:** at least 3 letters
  - **Email:** valid format, and not already registered for the same user type
  - **Phone:** 11 digits, starting with `01`
  - **Password:** at least 6 characters, with a letter and a number
- **Admin accounts are not on the public page.** The admin login is fixed for the owner.
- Every dashboard page checks the login. If you are not logged in with that role, you are sent
  back to that role's login page. **Log out** clears the login.

> **Frontend only:** all data lives in the browser (`localStorage`). Accounts, orders, reviews and
> table changes stay after a refresh, but only in the same browser. Clearing the browser data
> removes them. This is expected until a backend stores the data in a database.

## Folder structure (HTML / CSS / JS separation)

```
fall-26-27-food-management-system/
├── index.html          Home page: menu search, hours, contact
├── signup.html         ONE sign up page for 3 user types
├── CSS/
│   └── style.css       ONE external style sheet
├── js/
│   ├── auth.js         Sign up, login, route protection
│   ├── tables.js       Search + Add / Edit / Delete for tables
│   ├── customer.js     Customer panel
│   ├── waiter.js       Waiter panel
│   ├── cashier.js      Cashier panel
│   └── admin.js        Admin panel
├── customer/           Customer pages (food search, order track, ...)
├── Waiter/             Waiter pages (my tables, ready to serve, ...)
├── Cashier/            Cashier pages (bills, verification, ...)
├── Admin/              Admin pages (sales, staff, reports)
└── Project_evaluation/ Course evaluation sheet
```

Every dashboard page loads its scripts at the end of `<body>`, starting with `auth.js`, then the
page's own script.

## Features by user

| User | Pages | What the user can do |
|---|---|---|
| **Everyone** (home page, no login) | `index.html` | Search the menu by dish or category; see prices, prep time and availability (Available / Limited / Sold out); read opening hours and contact details |
| **Customer** | Dashboard, Food Search, Order Track, Offers & Combos, Reviews | Search food by name and category and place an order; follow an order step by step (*received → preparing → ready → served*); order offers and combos; write and read reviews; see totals for orders, pending orders and completed orders |
| **Waiter** | Dashboard, My Tables, Ready to Serve, Customer Requests | See today's date and what needs attention; filter assigned tables by status; mark ready orders as served; answer table requests, with a live count |
| **Cashier** | Dashboard, Bills to Collect, Payment Verification, Reconciliation | See total bills, today's collection and pending payments; collect customer bills; verify bKash, Nagad, Rocket and other payments by transaction ID; compare expected cash with actual cash |
| **Admin** | Dashboard, Sales, Staff, Reports | See sales and order numbers; see which staff are on duty (the dashboard count comes from the Staff table); read best sellers and busy hours |

Where a page has a data table, `tables.js` adds a **search box** and **Add / Edit / Delete** buttons.

## How a table works (same pattern on every page)

1. **Read** — the first visit reads the rows written in the HTML. Later visits draw the rows
   saved in `localStorage`.
2. **Search** — the table is redrawn with only the rows that contain the search text.
3. **Create** — the form above the table checks the input and adds a new row.
4. **Update** — **Edit** copies the row into the form; saving again changes that row.
5. **Delete** — **Delete** removes the row and saves the new list.

## What the code uses

| Topic | Where |
|---|---|
| `<!DOCTYPE html>`, `<head>`, `<meta charset>`, `<meta name="viewport">`, `<title>`, `<link>` | Every page |
| `<form>`, `<label for>` matching `id`, input types (text, email, password, tel, search), `<select>` | Login and sign up pages, search boxes, review form |
| `<table>` with `<thead>` / `<tbody>` | Menu, bills, staff, sales, reports |
| External CSS, element / class selectors, `:hover` | `CSS/style.css` |
| Box model: margin, padding, border, `box-sizing: border-box` | `CSS/style.css` |
| Layout with `display: flex` and `flex-wrap` (sidebar + content, cards, steps) | `CSS/style.css` |
| Cards, status badges (`ok`, `warn`, `bad`, `info`), progress bars | `CSS/style.css` |
| `const` / `let`, functions, `if / else`, arrow functions | `js/*.js` |
| Events: `onsubmit`, `onclick`, `addEventListener` | `js/*.js` |
| Regular expressions for email, phone and password checks | `js/auth.js` |
| Arrays and objects, `filter`, `find`, `map`, `push` | `js/*.js` |
| DOM: `getElementById`, `querySelector`, `createElement`, `innerHTML`, `textContent` | `js/*.js` |
| Form validation with red error messages next to each field | `js/auth.js`, `js/tables.js` |
| `localStorage` with `JSON.parse` / `JSON.stringify` | `js/*.js` |

## Notes and limitations

- **Folder names are case-sensitive on some hosts** (GitHub Pages, Linux servers). The folders are
  named `CSS`, `Waiter`, `Cashier` and `Admin`, but some links use lowercase (`css/`, `waiter/`,
  `cashier/`, `admin/`). They work on Windows and macOS and may break after deployment.
- Login is for demonstration only. The admin password is visible in `js/auth.js` and user
  passwords are stored as plain text in the browser. Do not use real passwords.
- Menu items, tables, bills and sales figures are sample data written in the HTML.

## Plan for the backend (later)

| Frontend now | Backend later |
|---|---|
| `localStorage` data | MySQL tables: `users`, `menu_items`, `orders`, `reviews`, `bills`, `payments`, `staff` |
| `auth.js` checks the saved `users` list | `login.php` checks the database and starts a `$_SESSION` |
| Fixed admin email and password in `auth.js` | Admin account stored in the database with a hashed password |
| `method="get"` forms handled by JavaScript | `method="post"` forms, validated again in PHP |
| Add / Edit / Delete in `tables.js` | `INSERT` / `UPDATE` / `DELETE` with prepared statements |
| Search inside the saved rows | `SELECT ... WHERE ... LIKE ?` |
