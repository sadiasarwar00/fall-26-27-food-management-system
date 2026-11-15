
/* ===== KHABAR GHOR CUSTOMER JAVASCRIPT ===== */

document.addEventListener("DOMContentLoaded", function () {

    // LOCAL STORAGE

    function getData(key) {
        return JSON.parse(localStorage.getItem(key) || "[]");
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    let orders = getData("khabarOrders");
    let reviews = getData("khabarReviews");


    // 1. FOOD SEARCH

    const searchForm = document.getElementById("foodSearchForm");
    const searchInput = searchForm?.querySelector('input[type="text"]');
    const categorySelect = searchForm?.querySelector("select");
    const foodCards = document.querySelectorAll("#foodList .card");

    if (searchForm) {

        function searchFood() {

            const keyword = searchInput.value.toLowerCase().trim();
            const category = categorySelect.value.toLowerCase();

            foodCards.forEach(function (card) {

                const name = card.querySelector("h2").innerText.toLowerCase();
                const details = card.innerText.toLowerCase();

                const nameMatch = name.includes(keyword);

                const categoryMatch =
                    category === "all categories" ||
                    details.includes(category);

                card.style.display =
                    nameMatch && categoryMatch ? "" : "none";
            });
        }

        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            searchFood();
        });

        categorySelect.addEventListener("change", searchFood);
    }


    // 2. FOOD ORDER

    document.querySelectorAll("#foodList .card button").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const card = button.closest(".card");

                const foodName = card.querySelector("h2").innerText;

                const priceText = card.querySelector("p").innerText;
                const price = Number(priceText.match(/\d+/)?.[0] || 0);

                const newOrder = {
                    id: orders.length
                        ? Math.max(...orders.map(o => o.id)) + 1
                        : 101,

                    food: foodName,
                    price: price,
                    status: "Pending"
                };

                orders.push(newOrder);

                saveData("khabarOrders", orders);

                alert(
                    "Order Successful!\nYour Order ID: " + newOrder.id
                );

            });
        }
    );

    // 2.5 OFFERS AND COMBO ORDER

    document.querySelectorAll(
        "#offerList .card button, #comboList .card button"
    ).forEach(function (button) {

        button.addEventListener("click", function () {

            const card = button.closest(".card");

            const foodName = card.querySelector("h2").innerText;

            const priceText = card.innerText.match(/Price:\s*(\d+)\s*Tk/i);

            if (!priceText) {
                alert("Price is not specified for this offer!");
                return;
            }

            const newOrder = {
                id: orders.length
                    ? Math.max(...orders.map(o => o.id)) + 1
                    : 101,

                food: foodName,
                price: Number(priceText[1]),
                status: "Pending"
            };

            orders.push(newOrder);

            saveData("khabarOrders", orders);

            alert(
                "Order Successful!\nYour Order ID: " + newOrder.id
            );

        });

    });



    // 3. ORDER TRACKING

    const trackButton = document.getElementById("trackButton");

    if (trackButton) {

        trackButton.addEventListener("click", function () {

            const orderID = document.getElementById("orderID").value.trim();

            const result = document.getElementById("orderResult");

            const order = orders.find(function (item) {
                return String(item.id) === orderID;
            });

            if (!order) {
                result.innerHTML = "<p>Order not found!</p>";
                return;
            }

            result.innerHTML = "";

            const card = document.createElement("div");
            card.className = "card";

            const heading = document.createElement("h2");
            heading.textContent = "Order #" + order.id;

            const food = document.createElement("p");
            food.textContent = "Food: " + order.food;

            const price = document.createElement("p");
            price.textContent = "Price: " + order.price + " Tk";

            const status = document.createElement("p");
            status.textContent = "Status: " + order.status;

            card.append(heading, food, price, status);

            result.appendChild(card);

        });
    }


    // 4. CUSTOMER REVIEWS

    const reviewForm = document.getElementById("reviewForm");

    function displayReview(review) {

        const reviewList = document.getElementById("reviewList");

        if (!reviewList) return;

        const card = document.createElement("div");
        card.className = "card";

        const name = document.createElement("h2");
        name.textContent = review.name;

        const rating = document.createElement("p");
        rating.textContent = "Rating: " + review.rating + "/5";

        const message = document.createElement("p");
        message.textContent = review.text;

        const badge = document.createElement("span");
        badge.className = "badge ok";
        badge.textContent = "Customer Review";

        card.append(name, rating, message, badge);

        reviewList.prepend(card);
    }


    if (reviewForm) {

        // Show previously saved reviews

        reviews.forEach(displayReview);

        reviewForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const name = document.getElementById("reviewName").value.trim();

            const rating = document.getElementById("rating").value;

            const reviewText = document.getElementById("reviewText").value.trim();

            if (!name || !reviewText) {
                alert("Please fill all fields!");
                return;
            }

            const newReview = {
                name: name,
                rating: rating,
                text: reviewText
            };

            reviews.push(newReview);

            saveData("khabarReviews", reviews);

            displayReview(newReview);

            alert("Thank you " + name + " for your review!");

            reviewForm.reset();

        });
    }


    // 5. DASHBOARD

    const totalOrders = document.getElementById("totalOrders");

    if (totalOrders) {

        const pending = orders.filter(o => o.status === "Pending").length;

        const completed = orders.filter(o => o.status === "Delivered").length;

        totalOrders.textContent = orders.length;

        document.getElementById("pendingOrders").textContent = pending;

        document.getElementById("completedOrders").textContent = completed;

        const table = document.getElementById("recentOrders");

        table.innerHTML = "";

        orders.forEach(function (order) {

            const row = document.createElement("tr");

            [order.id, order.food, order.price + " Tk", order.status]
                .forEach(function (value) {

                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);

                });

            table.appendChild(row);

        });
    }

});
