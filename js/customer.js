
/* ===== KHABAR GHOR CUSTOMER JAVASCRIPT ===== */


/* 1. FOOD SEARCH */

function searchFood() {
    let input = document.getElementById("searchInput");
    let filter = input.value.toLowerCase();

    let cards = document.querySelectorAll(".food-card");

    cards.forEach(function(card) {
        let foodName = card.querySelector("h2").innerText.toLowerCase();

        if (foodName.includes(filter)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


/* 2. ORDER TRACKING */

function trackOrder() {
    let orderID = document.getElementById("orderID").value;

    if (orderID == "101") {
        alert("Order #101: Your order is on the way!");
    }
    else if (orderID == "102") {
        alert("Order #102: Your order is pending!");
    }
    else if (orderID == "103") {
        alert("Order #103: Your order is processing!");
    }
    else {
        alert("Order not found!");
    }
}


/* 3. FOOD ORDER */

function orderFood(foodName) {
    alert(foodName + " added to your order!");
}


/* 4. COMBO ORDER */

function buyCombo(comboName) {
    alert(comboName + " selected successfully!");
}


/* 5. CUSTOMER REVIEW */

function submitReview() {
    let name = document.getElementById("reviewName").value;
    let rating = document.getElementById("rating").value;
    let review = document.getElementById("reviewText").value;

    if (name == "" || review == "") {
        alert("Please fill all fields!");
    }
    else {
        alert("Thank you " + name + " for your review!");

        console.log("Name: " + name);
        console.log("Rating: " + rating);
        console.log("Review: " + review);

        document.getElementById("reviewForm").reset();
    }
}


/* 6. DASHBOARD MESSAGE */

function showWelcome() {
    alert("Welcome to Khabar Ghor Customer Dashboard!");
}
