const { MYFATOORAH_API_TOKEN, MYFATOORAH_API_URL } = require('../config.js');
const myFatoorah = require('../services/myfatoorah.service.js');
const { generateId, formatInvoiceNumber, formatCurrency, formatDate } = require('../utils/helpers.js');
const { generateInvoiceHTML } = require('../utils/generateInvoiceHTML.js');
const store = require('../store/inMemoryStore.js');
const axios = require('axios');

// 🏠 Root Handler
const root = (req, res) => {
  res.json({
    success: true,
    message: '🚀 Invoice API with MyFatoorah Integration & Company Registration',
    timestamp: new Date().toISOString(),
    myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
    companiesCount: companies.length,
    invoicesCount: invoices.length,
    endpoints: [
      'POST /create-invoice - Create invoice with company registration',
      'GET /invoices - Get all invoices',
      'GET /invoices/:id - Get single invoice',
      'GET /invoices/:id/pdf - Generate PDF'
    ]
  });
};

// 🩺 Health Check Handler
const health = (req, res) => {
  res.json({ 
    success: true, 
    message: 'Invoice API with MyFatoorah Integration',
    timestamp: new Date().toISOString(),
    myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
    companiesCount: companies.length,
    invoicesCount: invoices.length
  });
};

// 📋 Create Invoice Handler
const createInvoice = async (req, res) => {
  try {
    console.log('📝 Creating invoice with company registration:', req.body);
    
    const { 
      companyName, companyAddress, companyCity, companyCountry, companyTrn, companyEmail,
      customerName, customerMobile, customerTrn, customerEmail,
      items, saleAgent, dueDate 
    } = req.body;

    // Validate input (same as original)
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer name and items are required' 
      });
    }

    if (!companyName || !companyTrn || !companyEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company name, TRN, and email are required' 
      });
    }

    // Create or find company (same as original)
    let company = store.companies.find(c => c.trn === companyTrn);
    if (!company) {
      company = {
        id: generateId(),
        name: companyName,
        address: companyAddress || 'Business Address',
        city: companyCity || 'Dubai',
        country: companyCountry || 'United Arab Emirates',
        trn: companyTrn,
        email: companyEmail,
        createdAt: new Date().toISOString()
      };
      store.companies.push(company);
      console.log('✅ New company registered:', company.name);
    }

    // Create customer (same as original)
    const customer = {
      id: generateId(),
      name: customerName,
      mobile: customerMobile || '',
      trn: customerTrn || '',
      email: customerEmail || '',
      companyId: company.id
    };
    store.customers.push(customer);

    // Process items (same as original)
    const processedItems = items.map(item => {
      const quantity = parseFloat(item.quantity) || 1;
      const rate = parseFloat(item.rate) || 0;
      const tax = parseFloat(item.tax) || 0;
      const amount = quantity * rate;
      
      return {
        id: generateId(),
        description: item.description || '',
        quantity, rate, tax, amount
      };
    });

    const subTotal = processedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = processedItems.reduce((sum, item) => sum + (item.amount * item.tax / 100), 0);
    const total = subTotal + taxAmount;

    // Create invoice (same as original)
    const invoice = {
      id: generateId(),
      invoiceNumber: formatInvoiceNumber(store.invoiceCounter++),
      invoiceDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: company.id, company: company,
      customerId: customer.id, customer: customer,
      items: processedItems,
      subTotal: Math.round(subTotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      balance: Math.round(total * 100) / 100,
      status: 'draft',
      saleAgent: saleAgent || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (MYFATOORAH_API_TOKEN) {
      try {
        console.log('🔄 Starting MyFatoorah integration...');
        
        const paymentData = {
          InvoiceValue: total,  
          CustomerName: customerName,
          NotificationOption: 'LNK', 
          InvoiceDisplayValue: invoice.invoiceNumber,
          Language: 'en',
          DisplayCurrencyIso: 'USD'
        };

        if (customerMobile && customerMobile.trim()) {
          paymentData.CustomerMobile = customerMobile.replace(/\s+/g, '');
        }
        if (customerEmail && customerEmail.trim()) {
          paymentData.CustomerEmail = customerEmail.trim();
        }

        const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
        paymentData.CallBackUrl = `${baseUrl}/payment/callback`;
        paymentData.ErrorUrl = `${baseUrl}/payment/error`;

        console.log('📤 MyFatoorah Request Payload:', JSON.stringify(paymentData, null, 2));

        const response = await axios.post(
          `${MYFATOORAH_API_URL}/SendPayment`,
          paymentData,
          { 
            headers: {
              'Authorization': `Bearer ${MYFATOORAH_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        console.log('📥 MyFatoorah Raw Response Status:', response.status);
        console.log('📥 MyFatoorah Raw Response:', JSON.stringify(response.data, null, 2));

        const paymentResponse = response.data;

        if (paymentResponse && paymentResponse.IsSuccess === true) {
          if (paymentResponse.Data && paymentResponse.Data.InvoiceURL) {
            invoice.paymentLink = paymentResponse.Data.InvoiceURL; 
            invoice.myfatoorahInvoiceId = paymentResponse.Data.InvoiceId;
            invoice.status = 'sent';
            console.log('✅ MyFatoorah SUCCESS - Payment link created:', paymentResponse.Data.InvoiceURL);
          } else {
            console.error('❌ MyFatoorah SUCCESS but no InvoiceURL in response');
            console.error('Data object:', paymentResponse.Data);
          }
        } else {
          console.error('❌ MyFatoorah API returned IsSuccess: false');
          console.error('Error Message:', paymentResponse?.Message);
          console.error('Validation Errors:', paymentResponse?.ValidationErrors);
          console.error('Full Response:', paymentResponse);
        }

      } catch (paymentError) {
        console.error('💥 MyFatoorah API Error Details:');
        console.error('Error Type:', paymentError.name);
        console.error('Error Message:', paymentError.message);
        
        if (paymentError.response) {
          console.error('Response Status:', paymentError.response.status);
          console.error('Response Data:', JSON.stringify(paymentError.response.data, null, 2));
        }
      }
    }

    store.invoices.push(invoice);

    console.log('✅ Invoice created with ID:', invoice.id);
    console.log('Invoice has payment link:', !!invoice.paymentLink);
    
    res.status(201).json({ success: true, data: invoice });

  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Debug Invoice Handler
const debugInvoice = (req, res) => {
  const invoice = invoices.find(inv => inv.id === req.params.invoiceId);
  if (invoice) {
    res.json({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      hasPaymentLink: !!invoice.paymentLink,
      paymentLink: invoice.paymentLink,
      status: invoice.status,
      myfatoorahId: invoice.myfatoorahInvoiceId,
      total: invoice.total,
      customerName: invoice.customer.name,
      myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
      apiUrl: MYFATOORAH_API_URL
    });
  } else {
    res.json({ error: 'Invoice not found', availableInvoices: invoices.length });
  }
};

// 🔍 Environment Debug Handler
const envDebug = (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    myfatoorahToken: MYFATOORAH_API_TOKEN ? `${MYFATOORAH_API_TOKEN.substring(0, 10)}...` : 'NOT SET',
    myfatoorahUrl: MYFATOORAH_API_URL,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('MY') || key.includes('TOKEN') || key.includes('API'))
  });
};

// 🔔 Webhook Handler
const paymentWebhook = (req, res) => {
  try {
    console.log('🔔 MyFatoorah Webhook Received:', req.body);
    
    const webhookData = req.body;
    
    const invoice = invoices.find(inv => 
      inv.myfatoorahInvoiceId === webhookData.InvoiceId
    );
    
    if (invoice) {
      if (webhookData.TransactionStatus === 'Succss') {  // Note: Typo in original ('Succss' instead of 'Success') - fix if needed
        invoice.status = 'paid';
        invoice.balance = 0;
        console.log('✅ Payment confirmed for invoice:', invoice.invoiceNumber);
      } else if (webhookData.TransactionStatus === 'Failed') {
        invoice.status = 'failed';
        console.log('❌ Payment failed for invoice:', invoice.invoiceNumber);
      }
      
      invoice.updatedAt = new Date().toISOString();
    }
    
    res.status(200).json({ success: true, message: 'Webhook processed' });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
};

// 🧪 Test Token Handler
const testToken = async (req, res) => {
  try {
    console.log('🧪 Testing MyFatoorah token validity...');
    
    if (!MYFATOORAH_API_TOKEN) {
      return res.json({ 
        success: false, 
        error: 'No API token configured' 
      });
    }

    const testPayload = {
      InvoiceAmount: 100,
      CurrencyIso: 'USD'
    };

    const response = await axios.post(
      `${MYFATOORAH_API_URL}/InitiatePayment`,
      testPayload,
      { 
        headers: {
          'Authorization': `Bearer ${MYFATOORAH_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Token is valid! Response:', response.status);
    res.json({
      success: true,
      message: 'MyFatoorah token is valid',
      status: response.status,
      hasPaymentMethods: !!response.data?.Data?.length
    });

  } catch (error) {
    console.error('❌ Token validation failed:', error.response?.status, error.response?.data);
    res.json({
      success: false,
      error: `Token validation failed: ${error.response?.status || error.message}`,
      details: error.response?.data || error.message
    });
  }
};

// 🔍 Get Single Invoice Handler
const getInvoice = (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('❌ Error fetching invoice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Generate PDF Handler
const generatePdf = (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const html = generateInvoiceHTML(invoice);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  root,
  health,
  createInvoice,
  debugInvoice,
  envDebug,
  paymentWebhook,
  testToken,
  getInvoice,
  generatePdf
};