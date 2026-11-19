/* =====================================================================
   home.js  -  The home page (index.html)
   ---------------------------------------------------------------------
   The home page needs the menu search only. The menu is an array of
   objects; showMenu() reads the search box (menuSearch) and the category
   list (menuCategory) and fills the table body (menuBody).
   No login is needed to search.
   ===================================================================== */

// ---------- 1. The menu: an array of objects ----------
const menu = [
  { dish: "Chicken Burger",  category: "Burger",   price: 250, prep: 25, status: "Available" },
  { dish: "Cheese Pizza",    category: "Pizza",    price: 550, prep: 30, status: "Available" },
  { dish: "Fried Chicken",   category: "Chicken",  price: 300, prep: 30, status: "Available" },
  { dish: "Cold Coffee",     category: "Drinks",   price: 120, prep: 10, status: "Limited" },
  { dish: "Samosa (2 pcs)",  category: "Starters", price: 40,  prep: 5,  status: "Available" },
  { dish: "Chicken Fry",     category: "Starters", price: 150, prep: 15, status: "Available" },
  { dish: "Beguni (4 pcs)",  category: "Starters", price: 30,  prep: 8,  status: "Available" },
  { dish: "Mango Lassi",     category: "Drinks",   price: 90,  prep: 5,  status: "Available" },
  { dish: "Borhani",         category: "Drinks",   price: 60,  prep: 5,  status: "Available" },
  { dish: "Masala Tea",      category: "Drinks",   price: 30,  prep: 5,  status: "Available" },
  { dish: "Firni",           category: "Desserts", price: 80,  prep: 5,  status: "Available" },
  { dish: "Rasmalai",        category: "Desserts", price: 120, prep: 5,  status: "Sold out" }
];

// ---------- 2. Page elements ----------
const searchBox   = document.getElementById("menuSearch");
const categoryBox = document.getElementById("menuCategory");
const menuBody    = document.getElementById("menuBody");
const menuCount   = document.getElementById("menuCount");

// ---------- 3. Helpers ----------

// true when "text" contains "keyword" (capital letters do not matter)
function containsText(text, keyword) {
  return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}

// the colour of the status label: Available = green, Limited = orange, Sold out = red
function badgeClass(status) {
  switch (status) {
    case "Available": return "ok";
    case "Limited":   return "warn";
    default:          return "bad";
  }
}

// fill the category list from the menu, so every category can be chosen
function fillCategories() {
  const seen = [];
  for (const item of menu) {
    if (seen.indexOf(item.category) === -1) {
      seen.push(item.category);
    }
  }
  categoryBox.innerHTML = "";
  const all = document.createElement("option");
  all.value = "All";
  all.textContent = "All categories";
  categoryBox.appendChild(all);
  for (const name of seen) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categoryBox.appendChild(option);
  }
}

// ---------- 4. Search: draws the table again every time ----------
function showMenu() {
  const keyword  = searchBox.value.trim();
  const category = categoryBox.value;
  let rows  = "";
  let found = 0;

  for (const item of menu) {
    const matchesKeyword  = containsText(item.dish, keyword) || containsText(item.category, keyword);
    const matchesCategory = (category === "All" || item.category === category);

    if (matchesKeyword && matchesCategory) {
      rows += "<tr><td>" + item.dish + "</td><td>" + item.category + "</td><td>৳" + item.price +
              "</td><td>" + item.prep + " min</td><td><span class='badge " + badgeClass(item.status) + "'>" +
              item.status + "</span></td></tr>";
      found++;
    }
  }

  if (found === 0) {
    rows = "<tr><td colspan='5' class='empty'>No dishes found. Try another word or category.</td></tr>";
  }
  menuBody.innerHTML = rows;
  menuCount.textContent = "Showing " + found + " of " + menu.length + " dishes.";
}

// ---------- 5. Start: show every dish, then react to typing and choosing ----------
fillCategories();
showMenu();
searchBox.addEventListener("input", showMenu);
categoryBox.addEventListener("change", showMenu);