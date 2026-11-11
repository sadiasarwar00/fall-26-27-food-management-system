// cashier.js - Khabar Ghor Cashier Panel

(function () {

  const BILL_KEY = "khabarGhorCashierBills";
  const RECON_KEY = "khabarGhorReconciliation";

  function today() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function read(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function money(amount) {
    return "৳" + Number(amount).toFixed(2);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      const chars = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return chars[char];
    });
  }

  // Initial sample bills
  function getBills() {
    let bills = read(BILL_KEY, null);

    if (!Array.isArray(bills)) {
      bills = [
        {
          id: "B001",
          customer: "Rahim",
          amount: 850,
          method: "Cash",
          status: "Pending",
          transactionId: "",
          paidDate: ""
        },
        {
          id: "B002",
          customer: "Karim",
          amount: 1000,
          method: "bKash",
          status: "Pending",
          transactionId: "",
          paidDate: ""
        },
        {
          id: "B003",
          customer: "Sumaiya",
          amount: 600,
          method: "Nagad",
          status: "Paid",
          transactionId: "NG123456",
          paidDate: today()
        }
      ];

      save(BILL_KEY, bills);
    }

    return bills;
  }

  // Dashboard
  function dashboard() {
    const totalBills = document.getElementById("totalBills");

    if (!totalBills) return;

    const bills = getBills();

    const collected = bills
      .filter(function (bill) {
        return bill.status === "Paid" && bill.paidDate === today();
      })
      .reduce(function (sum, bill) {
        return sum + Number(bill.amount);
      }, 0);

    const pending = bills.filter(function (bill) {
      return bill.status === "Pending";
    }).length;

    totalBills.textContent = bills.length;
    document.getElementById("collectedToday").textContent = money(collected);
    document.getElementById("pendingPayments").textContent = pending;
  }

  // Bills page
  function billsPage() {
    const tableBody = document.getElementById("billTableBody");

    if (!tableBody) return;

    const search = document.getElementById("billSearch");

    function showBills() {
      const bills = getBills();

      const keyword = search.value.toLowerCase();

      const filtered = bills.filter(function (bill) {
        return (
          bill.id.toLowerCase().includes(keyword) ||
          bill.customer.toLowerCase().includes(keyword) ||
          bill.method.toLowerCase().includes(keyword)
        );
      });

      tableBody.innerHTML = "";

      filtered.forEach(function (bill) {
        let action = "";

        if (bill.status === "Paid") {
          action = '<span class="ok">Completed</span>';
        } else if (bill.method === "Cash") {
          action = '<button type="button" data-collect="' +
            escapeHTML(bill.id) + '">Collect Cash</button>';
        } else {
          action = '<a href="verification.html">Verify Payment</a>';
        }

        const row = document.createElement("tr");

        row.innerHTML =
          "<td>" + escapeHTML(bill.id) + "</td>" +
          "<td>" + escapeHTML(bill.customer) + "</td>" +
          "<td>" + money(bill.amount) + "</td>" +
          "<td>" + escapeHTML(bill.method) + "</td>" +
          "<td>" + escapeHTML(bill.status) + "</td>" +
          "<td>" + action + "</td>";

        tableBody.appendChild(row);
      });

      document.getElementById("billCount").textContent = bills.length;

      const pendingAmount = bills
        .filter(function (bill) {
          return bill.status === "Pending";
        })
        .reduce(function (sum, bill) {
          return sum + Number(bill.amount);
        }, 0);

      document.getElementById("pendingAmount").textContent =
        money(pendingAmount);
    }

    search.addEventListener("input", showBills);

    tableBody.addEventListener("click", function (event) {
      const button = event.target.closest("[data-collect]");

      if (!button) return;

      const billId = button.getAttribute("data-collect");
      const bills = getBills();

      const bill = bills.find(function (item) {
        return item.id === billId;
      });

      if (!bill || bill.status === "Paid") return;

      if (confirm("Collect " + money(bill.amount) + " from " + bill.customer + "?")) {
        bill.status = "Paid";
        bill.paidDate = today();

        save(BILL_KEY, bills);

        showBills();
        dashboard();

        alert("Cash collected successfully!");
      }
    });

    showBills();
  }

  // Payment verification
  function verificationPage() {
    const verifyButton = document.getElementById("verifyBtn");

    if (!verifyButton) return;

    verifyButton.addEventListener("click", function () {

      const billId = document.getElementById("verifyBillId").value.trim();
      const method = document.getElementById("paymentMethod").value;
      const transactionId = document.getElementById("transactionId").value.trim();
      const amount = Number(document.getElementById("verifyAmount").value);
      const result = document.getElementById("verifyResult");

      result.textContent = "";
      result.className = "note";

      if (!billId || !method || !document.getElementById("verifyAmount").value) {
        result.textContent = "Please fill in all required fields.";
        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        result.textContent = "Please enter a valid amount.";
        return;
      }

      if (method !== "Cash" && !transactionId) {
        result.textContent = "Please enter the transaction ID.";
        return;
      }

      const bills = getBills();

      const bill = bills.find(function (item) {
        return item.id.toLowerCase() === billId.toLowerCase();
      });

      if (!bill) {
        result.textContent = "Bill ID not found.";
        return;
      }

      if (bill.status === "Paid") {
        result.textContent = "This bill is already paid.";
        return;
      }

      if (bill.method !== method) {
        result.textContent = "Payment method does not match the bill.";
        return;
      }

      if (Number(bill.amount) !== amount) {
        result.textContent = "Payment amount does not match the bill.";
        return;
      }

      if (transactionId) {
        const duplicate = bills.some(function (item) {
          return item.transactionId &&
            item.transactionId.toLowerCase() === transactionId.toLowerCase();
        });

        if (duplicate) {
          result.textContent = "This transaction ID has already been used.";
          return;
        }
      }

      bill.status = "Paid";
      bill.transactionId = transactionId;
      bill.paidDate = today();

      save(BILL_KEY, bills);

      result.textContent = "Payment verified successfully!";
      result.className = "ok";

      dashboard();
    });
  }

  // Cash reconciliation
  function reconciliationPage() {
    const calculateButton = document.getElementById("calculateCash");

    if (!calculateButton) return;

    const expectedInput = document.getElementById("expectedCash");
    const actualInput = document.getElementById("actualCash");
    const differenceResult = document.getElementById("differenceResult");
    const cashStatus = document.getElementById("cashStatus");
    const lastRecord = document.getElementById("lastReconciliation");

    function showLastRecord() {
      const record = read(RECON_KEY, null);

      if (!record) {
        lastRecord.textContent = "No reconciliation record yet.";
        return;
      }

      lastRecord.textContent =
        "Date: " + record.date +
        " | Expected: " + money(record.expected) +
        " | Actual: " + money(record.actual) +
        " | Difference: " + money(record.difference) +
        " | Status: " + record.status;
    }

    calculateButton.addEventListener("click", function () {

      if (expectedInput.value === "" || actualInput.value === "") {
        cashStatus.textContent = "Please enter both amounts.";
        return;
      }

      const expected = Number(expectedInput.value);
      const actual = Number(actualInput.value);

      if (
        !Number.isFinite(expected) ||
        !Number.isFinite(actual) ||
        expected < 0 ||
        actual < 0
      ) {
        cashStatus.textContent = "Please enter valid amounts.";
        return;
      }

      const difference = actual - expected;

      let status = "Balanced";

      if (difference < 0) {
        status = "Shortage";
      } else if (difference > 0) {
        status = "Excess";
      }

      differenceResult.textContent =
        "Difference: " + money(Math.abs(difference));

      cashStatus.textContent = "Status: " + status;

      const record = {
        date: today(),
        expected: expected,
        actual: actual,
        difference: Math.abs(difference),
        status: status
      };

      save(RECON_KEY, record);

      showLastRecord();
    });

    showLastRecord();
  }

  // Run the correct function on each page
  getBills();
  dashboard();
  billsPage();
  verificationPage();
  reconciliationPage();

})();