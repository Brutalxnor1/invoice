const { 
  root, health, createInvoice, debugInvoice, envDebug, 
  paymentWebhook, testToken, getInvoice, generatePdf 
} = require('../controllers/invoice.controller.js');

module.exports = (app) => {
  // 🏠 Root Route
  app.get('/', root);

  // 🩺 Health Check
  app.get('/health', health);

  // 📋 Create Invoice
  app.post('/api/create-invoice', createInvoice);

  // 🔍 Debug Invoice
  app.get('/debug/:invoiceId', debugInvoice);

  // 🔍 Environment Debug
  app.get('/env-debug', envDebug);

  // 🔔 Payment Webhook
  app.post('/payment/webhook', paymentWebhook);

  // 🧪 Test Token
  app.get('/test-token', testToken);

  // 🔍 Get Single Invoice
  app.get('/api/invoices/:invoiceId', getInvoice);

  // 📄 Generate PDF
  app.get('/api/invoices/:invoiceId/pdf', generatePdf);
};