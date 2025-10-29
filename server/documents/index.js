import moment from 'moment'

export default function ({
  name, address, phone, email, dueDate, date, id, notes, subTotal, type, vat,
  total, items, status, totalAmountReceived, balanceDue, company
}) {
  const today = new Date();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      padding: 0; margin: 0;
      font-family: 'Roboto', Arial, sans-serif;
      background: #fff;
      width: 800px;
      margin: 0 auto;
      color: #333;
    }
    .header-table {
      width: 100%; border: none; margin-bottom: 24px;
    }
    .header-table td {
      padding: 2px 5px; border: none;
      vertical-align: top;
    }
    .logo-cell { width: 140px; }
    .company-info {
      font-size: 15px;
      line-height: 1.4;
    }
    .title-big {
      font-size: 30px;
      font-weight: bold;
      color: #888;
      text-align: right;
    }
    .invoice-num {
      text-align: right; color: #666; font-size: 14px;
      padding-top: 20px;
    }
    .bill-table {
      width: 100%;
      margin-bottom: 24px;
      border: none;
      table-layout: fixed;
    }
    .bill-table td {
      padding: 2px 10px; border: none;
      vertical-align: top;
    }
    .billto {
      color: #888; font-size: 11px; padding-bottom: 2px; font-weight: bold
    }
    .right-details {
      text-align: right;
      font-size: 14px;
      line-height: 1.8;
    }
    .status-unpaid { color: #c00; font-weight: bold; }
    .status-paid { color: #27ae60; font-weight: bold; }
    .amount-big { font-size: 20px; font-weight: bold; }
    table.items {
      border-collapse: collapse;
      width: 100%;
      margin-top: 16px;
    }
    table.items th, table.items td {
      border: 1px solid #ddd;
      font-size: 13px;
      padding: 8px 6px;
      text-align: left;
    }
    table.items th {
      background: #fafafa;
      color: #555;
      font-weight: 500;
    }
    table.summary {
      float: right; margin-top: 16px;
      width: 300px;
      border-collapse: collapse;
    }
    table.summary th, table.summary td {
      border: none;
      padding: 7px 8px;
      font-size: 13px;
      text-align: right;
    }
    table.summary th {
      text-align: left;
      color: #666;
      font-weight: 400;
    }
    table.summary tr:last-child th, 
    table.summary tr:last-child td {
      font-weight: bold;
      color: #000;
      font-size: 15px;
    }
    .notes-section {
      clear: both;
      margin-top: 36px;
      border-top: 1px solid #ddd;
      padding-top: 16px;
      font-size: 13px;
    }
    .notes-label { font-weight:bold; }
    @media print {
      body { width: auto; }
      table.summary { float: none; margin: 0; }
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td class="logo-cell">
        ${company?.logo ? `<img src="${company.logo}" style="width:110px;max-height:80px;" />` : ''}
      </td>
      <td class="company-info">
        <div style="font-size:17px; font-weight:bold; margin-bottom:2px">
          ${company.businessName || company.name || ''}
        </div>
        <div>${company.email || ''}</div>
        <div>${company.phoneNumber || ''}</div>
        <div>${company.contactAddress || ''}</div>
      </td>
      <td>
        <div class="title-big">${type || 'Invoice'}</div>
        <div class="invoice-num">NO: ${id}</div>
      </td>
    </tr>
  </table>

  <table class="bill-table">
    <tr>
      <td style="width: 46%">
        <div class="billto">BILL TO</div>
        <div>${name}</div>
        <div>${email}</div>
        <div>${phone}</div>
        <div>${address}</div>
      </td>
      <td style="width: 8%"></td>
      <td class="right-details">
        <div style="font-size:11px; color:#888">STATUS</div>
        <div class="${Number(balanceDue) <= 0 ? 'status-paid' : 'status-unpaid'}">
          ${Number(balanceDue) <= 0 ? "Paid" : "Unpaid"}
        </div>
        <div style="font-size:11px; color:#888; margin-top:9px">DATE</div>
        <div>${moment(date).format('ll')}</div>
        <div style="font-size:11px; color:#888; margin-top:9px">DUE DATE</div>
        <div>${moment(dueDate).format('ll')}</div>
        <div style="font-size:11px; color:#888; margin-top:9px">AMOUNT DUE</div>
        <div class="amount-big">${balanceDue}</div>
      </td>
    </tr>
  </table>

  <table class="items">
    <tr>
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Disc(%)</th>
      <th style="text-align: right;">Amount</th>
    </tr>
    ${items.map(item => `
      <tr>
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice}</td>
        <td>${item.discount}</td>
        <td style="text-align:right;">${(item.quantity * item.unitPrice - item.quantity * item.unitPrice * item.discount / 100).toFixed(2)}</td>
      </tr>
    `).join('')}
  </table>

  <table class="summary">
    <tr><th>Invoice Summary</th><td></td></tr>
    <tr><th>Subtotal:</th><td>${subTotal}</td></tr>
    <tr><th>VAT(8%):</th><td>${(vat)}</td></tr>
    <tr><th>Total</th><td>${total}</td></tr>
    <tr><th>Paid</th><td>INR ${totalAmountReceived}</td></tr>
    <tr><th>Balance</th><td>INR ${balanceDue}</td></tr>
  </table>
  <div style="clear:both;"></div>

  <div class="notes-section">
    <span class="notes-label">Note/Payment Info</span>
    <div>${notes || ''}</div>
  </div>
</body>
</html>
`;
}
