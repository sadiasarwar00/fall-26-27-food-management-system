// cashier-report.js
// Khabar Ghor - Cashier Daily Report

(function () {

    const BILL_KEY = "khabarGhorCashierBills";

    function readBills() {
        try {
            return JSON.parse(localStorage.getItem(BILL_KEY)) || [];
        } catch (error) {
            return [];
        }
    }

    function generateDailyReport() {

        const bills = readBills();

        const today = new Date().toISOString().slice(0, 10);

        const todayBills = bills.filter(bill =>
            bill.date && bill.date.slice(0, 10) === today
        );

        const paidBills = todayBills.filter(bill =>
            bill.status === "Paid"
        );

        const pendingBills = todayBills.filter(bill =>
            bill.status !== "Paid"
        );

        const totalCollection = paidBills.reduce(
            (total, bill) => total + Number(bill.amount || 0), 0
        );

        const cashCollection = paidBills
            .filter(bill => bill.paymentMethod === "Cash")
            .reduce((total, bill) => total + Number(bill.amount || 0), 0);

        const digitalCollection = paidBills
            .filter(bill => bill.paymentMethod !== "Cash")
            .reduce((total, bill) => total + Number(bill.amount || 0), 0);

        return {
            date: today,
            totalBills: todayBills.length,
            paidBills: paidBills.length,
            pendingBills: pendingBills.length,
            totalCollection: totalCollection,
            cashCollection: cashCollection,
            digitalCollection: digitalCollection
        };
    }

    window.generateCashierDailyReport = generateDailyReport;

})();