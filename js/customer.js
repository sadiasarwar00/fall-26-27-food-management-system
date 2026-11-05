
/* ===== KHABAR GHOR CUSTOMER JAVASCRIPT ===== */

document.addEventListener("DOMContentLoaded", function () {

    /* 1. FOOD SEARCH */

    const searchForm = document.querySelector(".content form");
    const searchInput = document.querySelector(
        '.content input[type="text"]'
    );
    const categorySelect = document.querySelector(
        ".content select"
    );
    const foodCards = document.querySelectorAll(".grid .card");

    if (searchForm && searchInput && foodCards.length > 0) {

        function searchFood() {
            const keyword = searchInput.value.toLowerCase().trim();
            const category = categorySelect
                ? categorySelect.value.toLowerCase()
                : "all categories";

            foodCards.forEach(function (card) {
                const name = card.querySelector("h2")
                    ? card.querySelector("h2").innerText.toLowerCase()
                    : "";

                const details = card.innerText.toLowerCase();

                const nameMatch = name.includes(keyword);
                const categoryMatch =
                    category === "all categories" ||
                    details.includes(category);

                card.style.display =
                    nameMatch && categoryMatch ? "" : "none";
            });
        }

        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            searchFood();
        });

        if (categorySelect) {
            categorySelect.addEventListener("change", searchFood);
        }
    }


    /* 2. FOOD ORDER */

    document.querySelectorAll(".grid .card button").forEach(
        function (button) {
            button.addEventListener("click", function () {
                const card = button.closest(".card");
                const foodName = card.querySelector("h2").innerText;

                alert(foodName + " added to your order!");
            });
        }
    );


    /* 3. ORDER TRACKING */

    const trackButton = document.getElementById("trackButton");

    if (trackButton) {
        trackButton.addEventListener("click", function () {
            const orderID = document.getElementById("orderID").value.trim();

            const orders = {
                "101": "Your order is on the way!",
                "102": "Your order is pending!",
                "103": "Your order is processing!"
            };

            alert(orders[orderID] || "Order not found!");
        });
    }


    /* 4. CUSTOMER REVIEW */

    const reviewForm = document.getElementById("reviewForm");

    if (reviewForm) {
        reviewForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("reviewName").value.trim();
            const rating = document.getElementById("rating").value;
            const review = document.getElementById("reviewText").value.trim();

            if (!name || !review) {
                alert("Please fill all fields!");
                return;
            }

            alert("Thank you " + name + " for your review!");

            console.log("Name:", name);
            console.log("Rating:", rating);
            console.log("Review:", review);

            reviewForm.reset();
        });
    }


    /* 5. DASHBOARD WELCOME */

    const welcomeButton = document.getElementById("welcomeButton");

    if (welcomeButton) {
        welcomeButton.addEventListener("click", function () {
            alert("Welcome to Khabar Ghor Customer Dashboard!");
        });
    }

});
