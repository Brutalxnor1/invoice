
// 📄 Generate PDF
// app.get("/invoices/:invoiceId/pdf", async (req, res) => {
//   try {
//     const { invoiceId } = req.params;

//     const { data: invoice, error } = await supabase
//       .from("invoices")
//       .select(
//         "*, company:company_id(*, payment_details(*)), customer:customer_id(*), contact:contact_id(*), items:invoice_items(*)"
//       )
//       .eq("id", invoiceId)
//       .single();

//     if (error || !invoice) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Invoice not found" });
//     }

//     const html = generateInvoiceHTML(invoice);
//     res.setHeader("Content-Type", "text/html");
//     res.send(html);
//   } catch (error) {
//     console.error("❌ Error generating PDF:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });









// api/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { generateInvoiceHTML } = require("./utils/generateInvoiceHTML.js");
const dotenv = require("dotenv");
const { supabase } = require("./config/supabase.js"); // Import Supabase client
dotenv.config();

const app = express();

// 🔥 ENVIRONMENT VARIABLES - PROPERLY LOADED
const MYFATOORAH_API_TOKEN = process.env.MYFATOORAH_API_TOKEN;
const MYFATOORAH_API_URL =
  process.env.MYFATOORAH_API_URL || "https://apitest.myfatoorah.com/v2";

console.log("🔍 Environment Check:");
console.log("🔑 [DEBUG] MyFatoorah Token being used:", MYFATOORAH_API_TOKEN);
console.log("MYFATOORAH_API_URL:", MYFATOORAH_API_URL);

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins for Vercel
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Helper functions
const formatInvoiceNumber = (num) => `INV-${String(num).padStart(6, "0")}`;
const formatCurrency = (amount) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB");

// MyFatoorah Service
class MyFatoorahService {
  constructor() {
    this.apiUrl = MYFATOORAH_API_URL;
    this.apiToken = MYFATOORAH_API_TOKEN;

    if (!this.apiToken) {
      console.error("❌ CRITICAL: MyFatoorah API Token is missing!");
    } else {
      console.log("✅ MyFatoorah service initialized");
    }
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
    };
  }

  async createPaymentLink(paymentData) {
    if (!this.apiToken) {
      throw new Error("MyFatoorah API Token is not configured");
    }

    try {
      console.log("🔄 Creating MyFatoorah payment link...");

      const response = await axios.post(
        `${this.apiUrl}/SendPayment`,
        paymentData,
        { headers: this.getHeaders() }
      );

      console.log("✅ MyFatoorah response success");
      return response.data;
    } catch (error) {
      console.error(
        "❌ MyFatoorah API Error:",
        error.response?.data || error.message
      );
      throw new Error(
        "Failed to create payment link: " +
          (error.response?.data?.Message || error.message)
      );
    }
  }
}

const myFatoorah = new MyFatoorahService();

// 🏠 Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "🚀 Invoice API with MyFatoorah Integration & Company Registration",
    timestamp: new Date().toISOString(),
    myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
    endpoints: [
      "POST /api/create-invoice - Create invoice with company registration",
      "GET /api/invoices - Get all invoices",
      "GET /api/invoices/:id - Get single invoice",
      "GET /api/invoices/:id/pdf - Generate PDF",
    ],
  });
});

// 🩺 Health Check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Invoice API with MyFatoorah Integration",
    timestamp: new Date().toISOString(),
    myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
  });
});

// 📋 Create Invoice with Enhanced MyFatoorah Debugging
app.post("/api/create-invoice", async (req, res) => {
  try {
    console.log("📝 Creating invoice with company registration:", req.body);

    const {
      companyName,
      companyAddress,
      companyCity,
      companyCountry,
      companyTrn,
      companyEmail,
      paymentType,
      providerName,
      accountHolder,
      bankIban,
      bankBic,
      bankAddress,
      otherDetails,
      customerName,
      customerMobile,
      customerTrn,
      customerEmail,
      items,
      saleAgent,
      dueDate,
    } = req.body;

    // Validate input
    if (
      !customerName ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer name and items are required",
      });
    }

    if (!companyName || !companyTrn || !companyEmail) {
      return res.status(400).json({
        success: false,
        message: "Company name, TRN, and email are required",
      });
    }

    // Find or create company
    // let { data: company, error: companyError } = await supabase
    //   .from("companies")
    //   .select("*")
    //   .eq("trn", companyTrn)
    //   .single();

    const company = {
      id: 'temp-' + Date.now(), // temporary ID for this session
      name: companyName,
      address: companyAddress || 'Business Address',
      city: companyCity || 'Dubai',
      country: companyCountry || 'United Arab Emirates',
      trn: companyTrn,
      email: companyEmail
    };



    if (companyError && companyError.code !== "PGRST116") {
      // PGRST116 is no rows
      throw companyError;
    }

    if (!company) {
      const { data: newCompany, error: insertError } = await supabase
        .from("companies")
        .insert({
          name: companyName,
          address: companyAddress || "Business Address",
          city: companyCity || "Dubai",
          country: companyCountry || "United Arab Emirates",
          trn: companyTrn,
          email: companyEmail,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      company = newCompany;
      console.log("✅ New company registered:", company.name);
    }

    // Insert payment details if provided
    if (paymentType) {
      let otherDetailsJson = null;
      try {
        otherDetailsJson = JSON.parse(otherDetails || '{}');
      } catch (e) {
        console.error('Invalid other_details JSON:', e);
        otherDetailsJson = null; // or handle error
      }

      const { error: paymentError } = await supabase
        .from('payment_details')
        .insert({
          company_id: company.id,
          type: paymentType,
          provider_name: providerName || null,
          account_holder: accountHolder || null,
          bank_iban: bankIban || null,
          bank_bic: bankBic || null,
          bank_address: bankAddress || null,
          other_details: otherDetailsJson
        });

      if (paymentError) throw paymentError;
      console.log('✅ Payment details added for company:', company.name);
    }

    // Create customer (always new, to match original code; can add check for trn if needed)
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        company_id: company.id,
        name: customerName,
        trn: customerTrn || null,
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Create contact if email or mobile provided
    let contact = null;
    if (customerEmail || customerMobile) {
      const { data: newContact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          customer_id: customer.id,
          name: customerName, // Using customerName as contact name since no separate field
          email: customerEmail || null,
          mobile: customerMobile || null,
          is_primary: true,
        })
        .select()
        .single();

      if (contactError) throw contactError;
      contact = newContact;
    }

    // Process items and calculate totals
    const processedItems = items.map((item) => {
      const quantity = parseFloat(item.quantity) || 1;
      const rate = parseFloat(item.rate) || 0;
      const tax = parseFloat(item.tax) || 0;
      const amount = quantity * rate;

      return {
        description: item.description || "",
        quantity,
        rate,
        tax_percentage: tax,
        amount,
      };
    });

    const subTotal = processedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = processedItems.reduce(
      (sum, item) => sum + (item.amount * item.tax_percentage) / 100,
      0
    );
    const total = subTotal + taxAmount;

    // Generate invoice number (sequential per company)
    const { data: maxInvoice, error: maxError } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("company_id", company.id)
      .order("invoice_number", { ascending: false })
      .limit(1);

    if (maxError) throw maxError;

    let invoiceNum = 1;
    if (maxInvoice && maxInvoice.length > 0) {
      const lastNum = parseInt(
        maxInvoice[0].invoice_number.replace("INV-", "")
      );
      invoiceNum = lastNum + 1;
    }
    const invoiceNumber = formatInvoiceNumber(invoiceNum);

    // Create invoice
    const invoiceDate = new Date().toISOString().split("T")[0];
    const invoiceDueDate = dueDate
      ? new Date(dueDate).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        balance: Math.round(total * 100) / 100,
        invoice_date: invoiceDate,
        due_date: invoiceDueDate,
        company_id: company.id,
        customer_id: customer.id,
        contact_id: contact ? contact.id : null,
        sale_agent: saleAgent || null,
        sub_total: Math.round(subTotal * 100) / 100,
        tax_amount: Math.round(taxAmount * 100) / 100,
        total: Math.round(total * 100) / 100,
        status: "draft",
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    const itemsToInsert = processedItems.map((item) => ({
      invoice_id: invoice.id,
      ...item,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 🔥 ENHANCED MYFATOORAH INTEGRATION WITH DEBUGGING
    let paymentLink = null;
    let myfatoorahInvoiceId = null;
    if (MYFATOORAH_API_TOKEN && total > 0) {
      try {
        console.log("🔄 Starting MyFatoorah integration...");

        // ✅ COMPLETE PAYLOAD WITH ALL REQUIRED FIELDS
        const paymentData = {
          InvoiceValue: total, // ✅ Changed from InvoiceAmount to InvoiceValue
          CustomerName: customerName,
          NotificationOption: "LNK", // ✅ REQUIRED FIELD - was missing!
          InvoiceDisplayValue: invoice.invoice_number,
          Language: "en",
          DisplayCurrencyIso: "USD",
        };

        // Add optional fields if they exist
        if (customerMobile && customerMobile.trim()) {
          paymentData.CustomerMobile = customerMobile.replace(/\s+/g, "");
        }
        if (customerEmail && customerEmail.trim()) {
          paymentData.CustomerEmail = customerEmail.trim();
        }

        // Add callback URLs
        const baseUrl = process.env.VERCEL_URL || "http://localhost:3000";
        paymentData.CallBackUrl = `${baseUrl}/payment/callback`;
        paymentData.ErrorUrl = `${baseUrl}/payment/error`;

        console.log(
          "📤 MyFatoorah Request Payload:",
          JSON.stringify(paymentData, null, 2)
        );

        // Make the API call
        const response = await axios.post(
          `${MYFATOORAH_API_URL}/SendPayment`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${MYFATOORAH_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            timeout: 30000,
          }
        );

        console.log("📥 MyFatoorah Raw Response Status:", response.status);
        console.log(
          "📥 MyFatoorah Raw Response:",
          JSON.stringify(response.data, null, 2)
        );

        const paymentResponse = response.data;

        // Check if the response is successful
        if (paymentResponse && paymentResponse.IsSuccess === true) {
          if (paymentResponse.Data && paymentResponse.Data.InvoiceURL) {
            paymentLink = paymentResponse.Data.InvoiceURL; // ✅ Changed from PaymentURL to InvoiceURL
            myfatoorahInvoiceId = paymentResponse.Data.InvoiceId;
            console.log(
              "✅ MyFatoorah SUCCESS - Payment link created:",
              paymentResponse.Data.InvoiceURL
            );
          } else {
            console.error(
              "❌ MyFatoorah SUCCESS but no InvoiceURL in response"
            );
            console.error("Data object:", paymentResponse.Data);
          }
        } else {
          console.error("❌ MyFatoorah API returned IsSuccess: false");
          console.error("Error Message:", paymentResponse?.Message);
          console.error(
            "Validation Errors:",
            paymentResponse?.ValidationErrors
          );
          console.error("Full Response:", paymentResponse);
        }
      } catch (paymentError) {
        console.error("💥 MyFatoorah API Error Details:");
        console.error("Error Type:", paymentError.name);
        console.error("Error Message:", paymentError.message);

        if (paymentError.response) {
          console.error("Response Status:", paymentError.response.status);
          console.error(
            "Response Data:",
            JSON.stringify(paymentError.response.data, null, 2)
          );
        }
      }
    } else if (total <= 0) {
      console.warn("⚠️ Skipping MyFatoorah integration because total <= 0");
    }

    // Update invoice with payment details if successful
    let updatedInvoice = invoice;
    if (paymentLink) {
      const { data: updated, error: updateError } = await supabase
        .from("invoices")
        .update({
          payment_link: paymentLink,
          myfatoorah_invoice_id: myfatoorahInvoiceId,
          status: "sent",
        })
        .eq("id", invoice.id)
        .select()
        .single();

      if (updateError) throw updateError;
      updatedInvoice = updated;
    }

    // Fetch full invoice with relations
    const { data: fullInvoice, error: fetchError } = await supabase
      .from("invoices")
      .select(
        "*, company:company_id(*, payment_details(*)), customer:customer_id(*), contact:contact_id(*), items:invoice_items(*)"
      )
      .eq("id", updatedInvoice.id)
      .single();

    if (fetchError) throw fetchError;

    console.log("✅ Invoice created with ID:", fullInvoice.id);
    console.log("Invoice has payment link:", !!fullInvoice.payment_link);

    res.status(201).json({ success: true, data: fullInvoice });
  } catch (error) {
    console.error("❌ Error creating invoice:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔍 Get single invoice
app.get("/api/invoices/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        "*, company:company_id(*, payment_details(*)), customer:customer_id(*), contact:contact_id(*), items:invoice_items(*)"
      )
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error("❌ Error fetching invoice:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// In api/index.js, update the PDF route:
app.get("/api/invoices/:invoiceId/pdf", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        "*, company:company_id(*, payment_details(*)), customer:customer_id(*), contact:contact_id(*), items:invoice_items(*)"
      )
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const html = await generateInvoiceHTML(invoice); // Add await here
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



app.post("/api/payment/webhook", async (req, res) => {
  try {
    console.log("🔔 MyFatoorah Webhook Received:", req.body);

    const webhookData = req.body;

    // Find the invoice by MyFatoorah Invoice ID
    const { data: invoice, error: findError } = await supabase
      .from("invoices")
      .select("*")
      .eq("myfatoorah_invoice_id", webhookData.InvoiceId)
      .single();

    if (findError || !invoice) {
      console.error("Invoice not found for webhook");
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    let newStatus = invoice.status;
    let newBalance = invoice.balance;

    // Update invoice status based on payment status
    if (webhookData.TransactionStatus === "Success") {
      // Fixed typo from 'Succss'
      newStatus = "paid";
      newBalance = 0;
      console.log("✅ Payment confirmed for invoice:", invoice.invoice_number);
    } else if (webhookData.TransactionStatus === "Failed") {
      newStatus = "failed";
      console.log("❌ Payment failed for invoice:", invoice.invoice_number);
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: newStatus,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice.id);

    if (updateError) throw updateError;

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ success: false, message: "Webhook error" });
  }
});

// 🔍 Add Token Validation Endpoint
app.get("/api/test-token", async (req, res) => {
  try {
    console.log("🧪 Testing MyFatoorah token validity...");

    if (!MYFATOORAH_API_TOKEN) {
      return res.json({
        success: false,
        error: "No API token configured",
      });
    }

    // ✅ Use InitiatePayment instead (this endpoint exists)
    const testPayload = {
      InvoiceAmount: 100,
      CurrencyIso: "USD",
    };

    const response = await axios.post(
      `${MYFATOORAH_API_URL}/InitiatePayment`,
      testPayload,
      {
        headers: {
          Authorization: `Bearer ${MYFATOORAH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Token is valid! Response:", response.status);
    res.json({
      success: true,
      message: "MyFatoorah token is valid",
      status: response.status,
      hasPaymentMethods: !!response.data?.Data?.length,
    });
  } catch (error) {
    console.error(
      "❌ Token validation failed:",
      error.response?.status,
      error.response?.data
    );
    res.json({
      success: false,
      error: `Token validation failed: ${
        error.response?.status || error.message
      }`,
      details: error.response?.data || error.message,
    });
  }
});

// 🔍 Add Debug Endpoint
app.get("/api/debug/:invoiceId", async (req, res) => {
  try {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", req.params.invoiceId)
      .single();

    if (error || !invoice) {
      return res.json({ error: "Invoice not found" });
    }

    res.json({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      hasPaymentLink: !!invoice.payment_link,
      paymentLink: invoice.payment_link,
      status: invoice.status,
      myfatoorahId: invoice.myfatoorah_invoice_id,
      total: invoice.total,
      customerName: invoice.customer_id ? "Check full invoice" : null,
      myfatoorahConfigured: !!MYFATOORAH_API_TOKEN,
      apiUrl: MYFATOORAH_API_URL,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Add Environment Debug Endpoint
app.get("/api/env-debug", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    myfatoorahToken: MYFATOORAH_API_TOKEN
      ? `${MYFATOORAH_API_TOKEN.substring(0, 10)}...`
      : "NOT SET",
    myfatoorahUrl: MYFATOORAH_API_URL,
    allEnvKeys: Object.keys(process.env).filter(
      (key) =>
        key.includes("MY") || key.includes("TOKEN") || key.includes("API")
    ),
  });
});

// For local development
// if (require.main === module) {
//   const PORT = process.env.PORT || 3001;
//   app.listen(PORT, () => {
//     console.log(`
// 🚀 Invoice API Server Running!
// 📍 Server: http://localhost:${PORT}
// 💳 MyFatoorah: ${MYFATOORAH_API_TOKEN ? "✅ Configured" : "❌ Not Configured"}
// 📋 Ready for company registration and invoices!
//     `);
//   });
// }


module.exports = (req, res) => {
  return app(req, res);
};

// Export for Vercel
// module.exports = app;