'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calculator');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const amountLoan = parseFloat(document.getElementById('amount-loan').value);
        const yearlyInterest = parseFloat(document.getElementById('yearly-interest').value);
        const repaymentPeriod = parseInt(document.getElementById('repayment-period').value);

        const interest = yearlyInterest / 100 / 12;
        const payments = repaymentPeriod * 12;

        const x = Math.pow(1 + interest, payments);
        const monthlyPayment = (amountLoan * x * interest) / (x - 1);

        if (isFinite(monthlyPayment)) {
            const totalPayment = monthlyPayment * payments;
            const totalInterest = monthlyPayment * payments - amountLoan;

            document.getElementById('monthly-payment').innerText = 'R$ ' + monthlyPayment.toFixed(2);
            document.getElementById('total-payment').innerText = 'R$ ' + totalPayment.toFixed(2);
            document.getElementById('total-interest').innerText = 'R$ ' + totalInterest.toFixed(2);

            chart(amountLoan, interest, monthlyPayment, payments);

            document.querySelector('.graph h2').style.display = 'block';
            document.getElementById('graph').style.display = 'block';
        }
    });
});

function chart(principal, interest, monthly, payments) {
    const graph = document.getElementById('graph');
    graph.width = graph.width;

    if (arguments.length === 0 || !graph.getContext) return;

    const g = graph.getContext('2d');
    const width = graph.width;
    const height = graph.height;

    function paymentToX(n) {
        return (n * width) / payments;
    }

    function amountToY(a) {
        return height - (a * height) / (monthly * payments * 1.05);
    }

    // Pagamentos
    g.moveTo(paymentToX(0), amountToY(0));
    g.lineTo(paymentToX(payments), amountToY(monthly * payments));
    g.lineTo(paymentToX(payments), amountToY(0));
    g.closePath();
    g.fillStyle = '#e17055';
    g.fill();
    g.font = 'normal 11px sans-serif';
    g.fillText('Pagamentos do juro total', 20, 20);

    // Acumulado
    let equity = 0;
    g.beginPath();
    g.moveTo(paymentToX(0), amountToY(0));

    for (let p = 1; p <= payments; p++) {
        let thisMonthsInterest = (principal - equity) * interest;
        equity += monthly - thisMonthsInterest;
        g.lineTo(paymentToX(p), amountToY(equity));
    }

    g.lineTo(paymentToX(payments), amountToY(0));
    g.closePath();
    g.fillStyle = '#00b894';
    g.fill();
    g.fillText('Equidade acumulada', 20, 35);

    // Saldo devedor
    let bal = principal;
    g.beginPath();
    g.moveTo(paymentToX(0), amountToY(bal));

    for (let p = 1; p <= payments; p++) {
        let thisMonthsInterest = bal * interest;
        bal -= monthly - thisMonthsInterest;
        g.lineTo(paymentToX(p), amountToY(bal));
    }

    g.lineWidth = 1;
    g.stroke();
    g.fillStyle = '#2d3436';
    g.fillText('Saldo devedor', 20, 50);

    // Marcações anuais
    g.textAlign = 'center';

    let y = amountToY(0);

    for (let year = 1; year * 12 <= payments; year++) {
        let x = paymentToX(year * 12);
        g.fillRect(x - 0.5, y - 3, 1, 3);
        if (year === 1) g.fillText('Ano', x, y - 5);
        if (year % 5 === 0 && year * 12 !== payments) g.fillText(String(year), x, y - 5);
    }

    // Marcações de pagamento
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    let ticks = [monthly * payments, principal];
    let rightEdge = paymentToX(payments);

    for (let i = 0; i < ticks.length; i++) {
        let y = amountToY(ticks[i]);
        g.fillRect(rightEdge - 3, y - 0.5, 3, 1);
        g.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, y);
    }
}
