// const { formatCurrency, formatDate } = require('./helpers.js');

// function generateInvoiceHTML(invoice) {
//   const company = invoice.company;
//   const customer = invoice.customer;
//   const contact = invoice.contact || {};
  
//   const invoiceData = {
//     invoiceNumber: invoice.invoice_number,
//     balance: invoice.balance,
//     invoiceDate: formatDate(invoice.invoice_date),
//     dueDate: formatDate(invoice.due_date),
//     saleAgent: invoice.sale_agent,
//     subTotal: invoice.sub_total,
//     total: invoice.total,
//     items: invoice.items || []
//   };

//   return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="UTF-8">
//     <title>Invoice ${invoiceData.invoiceNumber}</title>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
        
//         body {
//             font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
//             color: #1a1a1a;
//             background: white;
//             font-size: 13px;
//             line-height: 1.5;
//         }
        
//         .invoice-container {
//             max-width: 800px;
//             margin: 0 auto;
//             padding: 40px;
//             background: white;
//         }
        
//         /* Header Section */
//         .invoice-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             margin-bottom: 40px;
//             padding-bottom: 20px;
//         }
        
//         .company-section {
//             flex: 1;
//         }
        
//         .company-logo {
//             width: 150px;
//             height: auto;
//             margin-bottom: 15px;
//         }
        
//         .company-name {
//             font-size: 16px;
//             font-weight: 700;
//             color: #1a1a1a;
//             margin-bottom: 8px;
//         }
        
//         .company-details {
//             color: #4a4a4a;
//             line-height: 1.6;
//         }
        
//         .company-details div {
//             margin-bottom: 2px;
//         }
        
//         .invoice-title-section {
//             text-align: right;
//         }
        
//         .invoice-badge {
//             display: inline-block;
//             background: #f5f5f5;
//             padding: 8px 16px;
//             border-radius: 4px;
//             font-size: 11px;
//             font-weight: 600;
//             letter-spacing: 0.5px;
//             color: #666;
//             margin-bottom: 8px;
//         }
        
//         .invoice-number {
//             font-size: 24px;
//             font-weight: 700;
//             color: #1a1a1a;
//             margin-bottom: 10px;
//         }
        
//         .invoice-balance {
//             font-size: 14px;
//             font-weight: 600;
//             color: #dc2626;
//         }
        
//         /* Billing Section */
//         .billing-section {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 30px;
//             padding: 20px;
//             background: #fafafa;
//             border-radius: 8px;
//         }
        
//         .bill-to {
//             flex: 1;
//         }
        
//         .bill-to h3 {
//             font-size: 12px;
//             font-weight: 600;
//             color: #666;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             margin-bottom: 10px;
//         }
        
//         .customer-name {
//             font-size: 16px;
//             font-weight: 600;
//             color: #1a1a1a;
//             margin-bottom: 6px;
//         }
        
//         .customer-details {
//             color: #666;
//             font-size: 13px;
//         }
        
//         .invoice-meta {
//             text-align: right;
//         }
        
//         .invoice-meta div {
//             margin-bottom: 6px;
//             font-size: 13px;
//         }
        
//         .invoice-meta strong {
//             color: #333;
//             font-weight: 600;
//         }
        
//         /* Table Section */
//         .invoice-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 30px;
//         }
        
//         .invoice-table thead {
//             background: #f8f8f8;
//             border-top: 1px solid #e5e5e5;
//             border-bottom: 1px solid #e5e5e5;
//         }
        
//         .invoice-table th {
//             padding: 12px;
//             text-align: left;
//             font-size: 11px;
//             font-weight: 600;
//             color: #666;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
        
//         .invoice-table th.text-center {
//             text-align: center;
//         }
        
//         .invoice-table th.text-right {
//             text-align: right;
//         }
        
//         .invoice-table tbody tr {
//             border-bottom: 1px solid #f0f0f0;
//         }
        
//         .invoice-table tbody tr:hover {
//             background: #fafafa;
//         }
        
//         .invoice-table td {
//             padding: 14px 12px;
//             color: #333;
//             font-size: 13px;
//         }
        
//         .invoice-table td.text-center {
//             text-align: center;
//         }
        
//         .invoice-table td.text-right {
//             text-align: right;
//             font-weight: 500;
//         }
        
//         .item-description {
//             line-height: 1.5;
//             color: #1a1a1a;
//         }
        
//         .item-details {
//             font-size: 11px;
//             color: #666;
//             margin-top: 4px;
//             line-height: 1.4;
//         }
        
//         /* Totals Section */
//         .totals-section {
//             display: flex;
//             justify-content: flex-end;
//             margin-bottom: 40px;
//         }
        
//         .totals-table {
//             width: 300px;
//         }
        
//         .totals-table tr {
//             border-bottom: 1px solid #f0f0f0;
//         }
        
//         .totals-table td {
//             padding: 10px 12px;
//             font-size: 13px;
//         }
        
//         .totals-table td:last-child {
//             text-align: right;
//             font-weight: 600;
//         }
        
//         .totals-table tr.total-row {
//             background: #f8f8f8;
//             border-top: 2px solid #e5e5e5;
//             border-bottom: 2px solid #e5e5e5;
//         }
        
//         .totals-table tr.total-row td {
//             font-size: 14px;
//             font-weight: 700;
//             color: #1a1a1a;
//         }
        
//         /* Payment Information Section */
//         .payment-section {
//             margin-top: 40px;
//             padding: 25px;
//             background: #f8fafb;
//             border: 1px solid #e0e7ff;
//             border-radius: 8px;
//         }
        
//         .payment-section h3 {
//             font-size: 14px;
//             font-weight: 600;
//             color: #1a1a1a;
//             margin-bottom: 20px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
        
//         .payment-methods {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 30px;
//             margin-bottom: 20px;
//         }
        
//         .payment-method {
//             padding: 15px;
//             background: white;
//             border-radius: 6px;
//             border: 1px solid #e5e5e5;
//         }
        
//         .payment-method h4 {
//             font-size: 12px;
//             font-weight: 600;
//             color: #666;
//             margin-bottom: 10px;
//             text-transform: uppercase;
//             letter-spacing: 0.3px;
//         }
        
//         .payment-details {
//             font-size: 12px;
//             color: #333;
//             line-height: 1.6;
//         }
        
//         .payment-details div {
//             margin-bottom: 4px;
//         }
        
//         .payment-details strong {
//             font-weight: 600;
//             color: #1a1a1a;
//         }
        
//         .payment-link {
//             display: inline-block;
//             margin-top: 10px;
//             padding: 10px 20px;
//             background: #3b82f6;
//             color: white;
//             text-decoration: none;
//             border-radius: 6px;
//             font-size: 12px;
//             font-weight: 600;
//             transition: background 0.2s;
//         }
        
//         .payment-link:hover {
//             background: #2563eb;
//         }
        
//         /* Signature Section */
//         .signature-section {
//             margin-top: 50px;
//             padding-top: 20px;
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-end;
//         }
        
//         .signature-box {
//             width: 250px;
//         }
        
//         .signature-line {
//             border-bottom: 1px solid #333;
//             margin-bottom: 8px;
//             height: 40px;
//         }
        
//         .signature-label {
//             font-size: 11px;
//             color: #666;
//             text-align: center;
//         }
        
//         /* Print Styles */
//         @media print {
//             body {
//                 background: white;
//             }
            
//             .invoice-container {
//                 padding: 20px;
//             }
            
//             .payment-link {
//                 display: none;
//             }
//         }
        
//         /* Mobile Responsive */
//         @media (max-width: 640px) {
//             .invoice-container {
//                 padding: 20px;
//             }
            
//             .invoice-header {
//                 flex-direction: column;
//             }
            
//             .invoice-title-section {
//                 text-align: left;
//                 margin-top: 20px;
//             }
            
//             .billing-section {
//                 flex-direction: column;
//             }
            
//             .invoice-meta {
//                 text-align: left;
//                 margin-top: 20px;
//             }
            
//             .payment-methods {
//                 grid-template-columns: 1fr;
//             }
            
//             .invoice-table {
//                 font-size: 11px;
//             }
            
//             .invoice-table th,
//             .invoice-table td {
//                 padding: 8px 6px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <!-- Header -->
//         <div class="invoice-header">
//             <div class="company-section">
//                 <!-- Logo placeholder - يمكنك إضافة اللوجو هنا -->
//                 <!-- ${company.logo_url ? `<img src="${company.logo_url}" alt="${company.name}" class="company-logo">` : ''} -->
//                 <img src="https://res.cloudinary.com/dgtvafpiv/image/upload/v1756392558/WhatsApp_Image_2025-08-28_at_13.59.10_d7fe56b0_y4pw4z.jpg" alt="${company.name}" class="company-logo">
//                 <div class="company-name">${company.name}</div>
//                 <div class="company-details">
//                     <div>${company.address}</div>
//                     <div>${company.city}, ${company.country}</div>
//                     <div>TRN ${company.trn}</div>
//                     <div>${company.email}</div>
//                 </div>
//             </div>
//             <div class="invoice-title-section">
//                 <div class="invoice-badge">TAX INVOICE</div>
//                 <div class="invoice-number"># ${invoiceData.invoiceNumber}</div>
//                 <div class="invoice-balance">Balance: ${formatCurrency(invoiceData.balance)}</div>
//             </div>
//         </div>

//         <!-- Billing Information -->
//         <div class="billing-section">
//             <div class="bill-to">
//                 <h3>Bill To:</h3>
//                 <div class="customer-name">${customer.name}</div>
//                 <div class="customer-details">
//                     <div>Mobile: ${contact.mobile || ''}</div>
//                     <div>TRN: ${customer.trn || ''}</div>
//                 </div>
//             </div>
//             <div class="invoice-meta">
//                 <div><strong>Invoice Date:</strong> ${invoiceData.invoiceDate}</div>
//                 <div><strong>Due Date:</strong> ${invoiceData.dueDate}</div>
//                 ${invoiceData.saleAgent ? `<div><strong>Sale Agent:</strong> ${invoiceData.saleAgent}</div>` : ''}
//             </div>
//         </div>

//         <!-- Items Table -->
//         <table class="invoice-table">
//             <thead>
//                 <tr>
//                     <th class="text-center">#</th>
//                     <th>Item</th>
//                     <th class="text-center">Qty</th>
//                     <th class="text-right">Rate</th>
//                     <th class="text-center">Tax</th>
//                     <th class="text-right">Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${invoiceData.items.map((item, index) => {
//                     // Parse property details if in description
//                     const description = item.description || '';
//                     const lines = description.split('\\n').filter(line => line.trim());
//                     const mainDescription = lines[0] || '';
//                     const details = lines.slice(1).join('<br>');
                    
//                     return `
//                     <tr>
//                         <td class="text-center">${index + 1}</td>
//                         <td>
//                             <div class="item-description">${mainDescription}</div>
//                             ${details ? `<div class="item-details">${details}</div>` : ''}
//                         </td>
//                         <td class="text-center">${item.quantity}</td>
//                         <td class="text-right">${formatCurrency(item.rate)}</td>
//                         <td class="text-center">${item.tax_percentage || 0}%</td>
//                         <td class="text-right">${formatCurrency(item.amount)}</td>
//                     </tr>
//                     `;
//                 }).join('')}
//             </tbody>
//         </table>

//         <!-- Totals -->
//         <div class="totals-section">
//             <table class="totals-table">
//                 <tr>
//                     <td>Sub Total</td>
//                     <td>${formatCurrency(invoiceData.subTotal)}</td>
//                 </tr>
//                 <tr>
//                     <td>Total</td>
//                     <td>${formatCurrency(invoiceData.total)}</td>
//                 </tr>
//                 <tr class="total-row">
//                     <td>Amount Due</td>
//                     <td>${formatCurrency(invoiceData.balance)}</td>
//                 </tr>
//             </table>
//         </div>

//         <!-- Payment Information -->
//         ${invoice.payment_link || invoice.bank_details ? `
//         <div class="payment-section">
//             <h3>Payment Information</h3>
//             <div class="payment-methods">
//                 ${invoice.payment_link ? `
//                 <div class="payment-method">
//                     <h4>VisaNet Link</h4>
//                     <div class="payment-details">
//                         <a href="${invoice.payment_link}"  target="_blank">
//                             ${invoice.payment_link}
//                         </a>
//                     </div>
//                 </div>
//                 ` : ''}
                
//                 ${invoice.visanet_account ? `
//                 <div class="payment-method">
//                     <h4>VisaNet Account</h4>
//                     <div class="payment-details">
//                         <div><strong>IAC:</strong> ${invoice.visanet_account.iac || '912695'}</div>
//                         <div><strong>IAT:</strong> ${invoice.visanet_account.iat || '99185108487291'}</div>
//                     </div>
//                 </div>
//                 ` : ''}
                
//                 ${invoice.bank_account || company.bank_account ? `
//                 <div class="payment-method">
//                     <h4>Bank Account</h4>
//                     <div class="payment-details">
//                         <div><strong>Account Holder:</strong> ${company.name}</div>
//                         <div><strong>IBAN:</strong> ${invoice.bank_iban || company.bank_iban || 'AE720860000009331712472'}</div>
//                         <div><strong>BIC:</strong> ${invoice.bank_bic || company.bank_bic || 'WIOBAEADXXX'}</div>
//                         <div><strong>Business Address:</strong> ${company.business_address || `${company.address}, ${company.city}, ${company.country}`}</div>
//                     </div>
//                 </div>
//                 ` : ''}
                
//             </div>

//         </div>
//         ` : ''}
//         <div>
//             <img src="https://res.cloudinary.com/dgtvafpiv/image/upload/v1756392557/WhatsApp_Image_2025-08-28_at_13.59.00_2c742e21_n3cz0r.jpg" />
//         </div>
//     </div>
// </body>
// </html>`;
// }

// module.exports = { generateInvoiceHTML };


const { formatCurrency, formatDate } = require('./helpers.js');

async function generateInvoiceHTML(invoice) {
  const company = invoice.company;
  const customer = invoice.customer;
  const contact = invoice.contact || {};
  
  const invoiceData = {
    invoiceNumber: invoice.invoice_number,
    balance: invoice.balance,
    invoiceDate: formatDate(invoice.invoice_date),
    dueDate: formatDate(invoice.due_date),
    saleAgent: invoice.sale_agent,
    subTotal: invoice.sub_total,
    total: invoice.total,
    items: invoice.items || []
  };

  // Generate QR code data
  const qrCodeData = `Invoice: ${invoiceData.invoiceNumber}\nAmount: ${formatCurrency(invoiceData.total)}\nDue: ${invoiceData.dueDate}${invoice.payment_link ? '\n' + invoice.payment_link : ''}`;
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #1a1a1a;
            background: white;
            font-size: 13px;
            line-height: 1.5;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }

        /* Header Section */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
        }
        
        .company-section {
            flex: 1;
        }
        
        .company-logo {
            width: 150px;
            height: auto;
            margin-bottom: 15px;
        }
        
        .company-name {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        
        .company-details {
            color: #4a4a4a;
            line-height: 1.6;
        }
        
        .company-details div {
            margin-bottom: 2px;
        }
        
        .invoice-title-section {
            text-align: right;
        }
        
        .invoice-badge {
            display: inline-block;
            background: #f5f5f5;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            color: #666;
            margin-bottom: 8px;
        }
        
        .invoice-number {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        
        .invoice-balance {
            font-size: 14px;
            font-weight: 600;
            color: #dc2626;
        }

        /* Billing Section */
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #fafafa;
            border-radius: 8px;
        }
        
        .bill-to {
            flex: 1;
        }
        
        .bill-to h3 {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }
        
        .customer-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6px;
        }
        
        .customer-details {
            color: #666;
            font-size: 13px;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-meta div {
            margin-bottom: 6px;
            font-size: 13px;
        }
        
        .invoice-meta strong {
            color: #333;
            font-weight: 600;
        }

        /* Table Section */
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .invoice-table thead {
            background: #f8f8f8;
            border-top: 1px solid #e5e5e5;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .invoice-table th {
            padding: 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .invoice-table th.text-center {
            text-align: center;
        }
        
        .invoice-table th.text-right {
            text-align: right;
        }
        
        .invoice-table tbody tr {
            border-bottom: 1px solid #f0f0f0;
        }
        
        .invoice-table td {
            padding: 14px 12px;
            color: #333;
            font-size: 13px;
        }
        
        .invoice-table td.text-center {
            text-align: center;
        }
        
        .invoice-table td.text-right {
            text-align: right;
            font-weight: 500;
        }
        
        .item-description {
            line-height: 1.5;
            color: #1a1a1a;
        }

        /* Totals Section */
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        
        .totals-table {
            width: 300px;
        }
        
        .totals-table tr {
            border-bottom: 1px solid #f0f0f0;
        }
        
        .totals-table td {
            padding: 10px 12px;
            font-size: 13px;
        }
        
        .totals-table td:last-child {
            text-align: right;
            font-weight: 600;
        }
        
        .totals-table tr.total-row {
            background: #f8f8f8;
            border-top: 2px solid #e5e5e5;
            border-bottom: 2px solid #e5e5e5;
        }
        
        .totals-table tr.total-row td {
            font-size: 14px;
            font-weight: 700;
            color: #1a1a1a;
        }

        /* Payment Section - Compact Version */
        .payment-section {
            margin-top: 30px;
            padding: 20px;
            background: #f8fafb;
            border: 1px solid #e0e7ff;
            border-radius: 8px;
        }
        
        .payment-section h3 {
            font-size: 12px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        
        .payment-methods {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .payment-method {
            padding: 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e5e5;
        }
        
        .payment-method h4 {
            font-size: 10px;
            font-weight: 600;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .payment-details {
            font-size: 10px;
            color: #333;
            line-height: 1.4;
        }

        /* Footer Section with QR Code and Payment Links */
        .invoice-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
        }
        
        .qr-section {
            text-align: left;
        }
        
        .qr-section h4 {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .qr-code {
            width: 120px;
            height: 120px;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
        }
        
        .payment-links-section {
            text-align: right;
            max-width: 400px;
        }
        
        .payment-links-section h4 {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        
        .payment-link-item {
            margin-bottom: 10px;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 11px;
        }
        
        .payment-link-item strong {
            color: #1a1a1a;
            display: block;
            margin-bottom: 4px;
        }
        
        .payment-link-item a {
            color: #3b82f6;
            text-decoration: none;
            word-break: break-all;
            font-size: 10px;
        }
        
        .visanet-logo {
            width: 80px;
            height: auto;
            margin-top: 10px;
            opacity: 0.8;
        }
        
        @media print {
            .invoice-container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-section">
                <img src="https://res.cloudinary.com/dgtvafpiv/image/upload/v1756392558/WhatsApp_Image_2025-08-28_at_13.59.10_d7fe56b0_y4pw4z.jpg" alt="${company.name}" class="company-logo">
                <div class="company-name">${company.name}</div>
                <div class="company-details">
                    <div>${company.address}</div>
                    <div>${company.city}, ${company.country}</div>
                    <div>TRN ${company.trn}</div>
                    <div>${company.email}</div>
                </div>
            </div>
            <div class="invoice-title-section">
                <div class="invoice-badge">TAX INVOICE</div>
                <div class="invoice-number"># ${invoiceData.invoiceNumber}</div>
                <div class="invoice-balance">Balance: ${formatCurrency(invoiceData.balance)}</div>
            </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
            <div class="bill-to">
                <h3>Bill To:</h3>
                <div class="customer-name">${customer.name}</div>
                <div class="customer-details">
                    <div>Mobile: ${contact.mobile || ''}</div>
                    <div>TRN: ${customer.trn || ''}</div>
                </div>
            </div>
            <div class="invoice-meta">
                <div><strong>Invoice Date:</strong> ${invoiceData.invoiceDate}</div>
                <div><strong>Due Date:</strong> ${invoiceData.dueDate}</div>
                ${invoiceData.saleAgent ? `<div><strong>Sale Agent:</strong> ${invoiceData.saleAgent}</div>` : ''}
            </div>
        </div>

        <!-- Items Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th class="text-center">#</th>
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Rate</th>
                    <th class="text-center">Tax</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map((item, index) => `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>
                            <div class="item-description">${item.description}</div>
                        </td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${formatCurrency(item.rate)}</td>
                        <td class="text-center">${item.tax_percentage || 0}%</td>
                        <td class="text-right">${formatCurrency(item.amount)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td>Sub Total</td>
                    <td>${formatCurrency(invoiceData.subTotal)}</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>${formatCurrency(invoiceData.total)}</td>
                </tr>
                <tr class="total-row">
                    <td>Amount Due</td>
                    <td>${formatCurrency(invoiceData.balance)}</td>
                </tr>
            </table>
        </div>

        <!-- Compact Payment Information -->
        <div class="payment-section">
            <h3>Payment Information</h3>
            <div class="payment-methods">
                ${invoice.payment_link ? `
                <div class="payment-method">
                    <h4>Online Payment</h4>
                    <div class="payment-details">
                        <div><strong>Status:</strong> Available</div>
                        <div><strong>Method:</strong> Card/Bank</div>
                    </div>
                </div>
                ` : ''}
                
                <div class="payment-method">
                    <h4>VisaNet Account</h4>
                    <div class="payment-details">
                        <div><strong>IAC:</strong> 912695</div>
                        <div><strong>IAT:</strong> 99185108487291</div>
                    </div>
                </div>
                
                <div class="payment-method">
                    <h4>Bank Transfer</h4>
                    <div class="payment-details">
                        <div><strong>IBAN:</strong> AE720860000009331712472</div>
                        <div><strong>BIC:</strong> WIOBAEADXXX</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer with QR Code and Payment Links -->
        <div class="invoice-footer">
            <div class="qr-section">
                <h4>Invoice QR Code</h4>
                <img src="${qrCodeURL}" alt="Invoice QR Code" class="qr-code">
            </div>
            
            <div class="payment-links-section">
                <h4>Quick Payment</h4>
                ${invoice.payment_link ? `
                <div class="payment-link-item">
                    <strong>💳 Payment Link:</strong>
                    <a href="${invoice.payment_link}" target="_blank">${invoice.payment_link}</a>
                </div>
                ` : ''}
                <div class="payment-link-item">
                    <strong>🌐 VisaNet Portal:</strong>
                    <a href="https://clink-visanet.it.com" target="_blank">clink-visanet.it.com</a>
                </div>
                <img src="https://res.cloudinary.com/dgtvafpiv/image/upload/v1756392557/WhatsApp_Image_2025-08-28_at_13.59.00_2c742e21_n3cz0r.jpg" alt="VisaNet" class="visanet-logo">
            </div>
        </div>
    </div>
</body>
</html>`;
}

module.exports = { generateInvoiceHTML };
