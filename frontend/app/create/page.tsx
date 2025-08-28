// File: app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Company Information (Self-Registration)
    companyName: '',
    companyAddress: '',
    companyCity: 'Dubai',
    companyCountry: 'United Arab Emirates',
    companyTrn: '',
    companyEmail: '',
    // Payment Details for Company
    paymentType: '',
    providerName: '',
    accountHolder: '',
    bankIban: '',
    bankBic: '',
    bankAddress: '',
    otherDetails: '',
    // Customer Information
    customerName: '',
    customerMobile: '',
    customerTrn: '',
    customerEmail: '',
    saleAgent: '',
    dueDate: '',
    items: [{
      description: '',
      quantity: 1,
      rate: 0,
      tax: 0,
      // Property Details for Item
      buildingName: '',
      propertyNo: '',
      floorNo: 0,
      parkings: '',
      suiteArea: 0,
      balconyArea: 0,
      areaSqMeter: 0,
      areaSqFeet: 0,
      commonArea: 0
    }]
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        rate: 0,
        tax: 0,
        buildingName: '',
        propertyNo: '',
        floorNo: 0,
        parkings: '',
        suiteArea: 0,
        balconyArea: 0,
        areaSqMeter: 0,
        areaSqFeet: 0,
        commonArea: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const calculateItemTotal = (item: any) => {
    const subtotal = item.quantity * item.rate;
    const tax = subtotal * (item.tax / 100);
    return subtotal + tax;
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🚀 Submitting invoice with company registration:', formData);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://invoice-back-one.vercel.app';
      // const response = await fetch('http://localhost:3001/create-invoice', {
      const response = await fetch(`${API_BASE_URL}/api/create-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success data:', data);

      if (data.success) {
        alert('🎉 Company registered and invoice created successfully with MyFatoorah integration!');
        router.push(`/invoice/${data.data.id}`);
      } else {
        alert('❌ Error creating invoice: ' + data.message);
      }
    } catch (error) {
      console.error('💥 Full error:', error);
      alert('💥 Failed to create invoice: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>🧾 Create New Invoice</h1>
          <p>Register your company and create invoice with MyFatoorah payment integration</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Company Registration Section */}
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '2px solid #4caf50'
            }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 20px 0' }}>
                🏢 Your Company Information
              </h3>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label>🏢 Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name LLC"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>📧 Company Email *</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>📍 Company Address</label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  placeholder="Business address, building, office number"
                />
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label>🏙️ City</label>
                  <input
                    type="text"
                    value={formData.companyCity}
                    onChange={(e) => handleInputChange('companyCity', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>🌍 Country</label>
                  <input
                    type="text"
                    value={formData.companyCountry}
                    onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>🆔 Company TRN *</label>
                  <input
                    type="text"
                    value={formData.companyTrn}
                    onChange={(e) => handleInputChange('companyTrn', e.target.value)}
                    placeholder="Tax Registration Number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Company Payment Details Section */}
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '2px solid #4caf50'
            }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 20px 0' }}>
                💳 Company Payment Details
              </h3>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Type *</label>
                  <input
                    type="text"
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    placeholder="e.g., bank"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Provider Name</label>
                  <input
                    type="text"
                    value={formData.providerName}
                    onChange={(e) => handleInputChange('providerName', e.target.value)}
                    placeholder="Bank name"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Account Holder</label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
                <div className="form-group">
                  <label>Bank IBAN</label>
                  <input
                    type="text"
                    value={formData.bankIban}
                    onChange={(e) => handleInputChange('bankIban', e.target.value)}
                    placeholder="IBAN number"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Bank BIC</label>
                  <input
                    type="text"
                    value={formData.bankBic}
                    onChange={(e) => handleInputChange('bankBic', e.target.value)}
                    placeholder="BIC/SWIFT code"
                  />
                </div>
                <div className="form-group">
                  <label>Bank Address</label>
                  <input
                    type="text"
                    value={formData.bankAddress}
                    onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                    placeholder="Bank address"
                  />
                </div>
              </div>

              {/* <div className="form-group">
                <label>Other Details (JSON)</label>
                <textarea
                  value={formData.otherDetails}
                  onChange={(e) => handleInputChange('otherDetails', e.target.value)}
                  rows={3}
                  placeholder='{"key": "value"}'
                />
              </div> */}
            </div>

            {/* Customer Information */}
            <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>
              👤 Customer Information
            </h3>

            <div className="grid grid-2">
              <div className="form-group">
                <label>👤 Customer Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="form-group">
                <label>📱 Customer Mobile</label>
                <input
                  type="text"
                  value={formData.customerMobile}
                  onChange={(e) => handleInputChange('customerMobile', e.target.value)}
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>🆔 Customer TRN</label>
                <input
                  type="text"
                  value={formData.customerTrn}
                  onChange={(e) => handleInputChange('customerTrn', e.target.value)}
                  placeholder="Customer Tax Registration Number"
                />
              </div>
              <div className="form-group">
                <label>📧 Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>👨‍💼 Sale Agent</label>
                <input
                  type="text"
                  value={formData.saleAgent}
                  onChange={(e) => handleInputChange('saleAgent', e.target.value)}
                  placeholder="Sales representative name"
                />
              </div>
              <div className="form-group">
                <label>📅 Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>
              📦 Invoice Items
            </h3>

            {formData.items.map((item, index) => (
              <div key={index} className="card" style={{ 
                backgroundColor: '#f9f9f9',
                border: '2px solid #e0e0e0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px' 
                }}>
                  <h4 style={{ color: '#1976d2' }}>📋 Item #{index + 1}</h4>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-secondary"
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      ❌ Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>📝 Description *</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    rows={3}
                    placeholder="Describe the product or service..."
                    required
                  />
                </div>

                {/* <h5 style={{ color: '#1976d2', marginBottom: '10px' }}>🏠 Property Details (Optional)</h5>
                <div className="grid grid-3">
                  <div className="form-group">
                    <label>Building Name</label>
                    <input
                      type="text"
                      value={item.buildingName}
                      onChange={(e) => handleItemChange(index, 'buildingName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Property No</label>
                    <input
                      type="text"
                      value={item.propertyNo}
                      onChange={(e) => handleItemChange(index, 'propertyNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Floor No</label>
                    <input
                      type="number"
                      value={item.floorNo}
                      onChange={(e) => handleItemChange(index, 'floorNo', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid grid-3">
                  <div className="form-group">
                    <label>Parkings</label>
                    <input
                      type="text"
                      value={item.parkings}
                      onChange={(e) => handleItemChange(index, 'parkings', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Suite Area</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.suiteArea}
                      onChange={(e) => handleItemChange(index, 'suiteArea', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Balcony Area</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.balconyArea}
                      onChange={(e) => handleItemChange(index, 'balconyArea', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid grid-3">
                  <div className="form-group">
                    <label>Area Sq Meter</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.areaSqMeter}
                      onChange={(e) => handleItemChange(index, 'areaSqMeter', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Area Sq Feet</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.areaSqFeet}
                      onChange={(e) => handleItemChange(index, 'areaSqFeet', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Common Area</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.commonArea}
                      onChange={(e) => handleItemChange(index, 'commonArea', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div> */}

                <div className="grid grid-3">
                  <div className="form-group">
                    <label>🔢 Quantity</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                  <div className="form-group">
                    <label>💰 Rate (USD)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>📊 Tax (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.tax}
                      onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                  padding: '10px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '6px',
                  border: '1px solid #4caf50'
                }}>
                  <strong style={{ color: '#2e7d32' }}>
                    💵 Item Total: ${calculateItemTotal(item).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary"
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none'
                }}
              >
                ➕ Add Another Item
              </button>
            </div>

            {/* Grand Total Display */}
            <div style={{
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              <h2 style={{ color: '#856404', margin: '0' }}>
                🧮 Grand Total: ${calculateGrandTotal().toFixed(2)}
              </h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#856404' }}>
                Includes all items with taxes
              </p>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                ❌ Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !formData.companyName || !formData.customerName}
                style={{
                  backgroundColor: loading ? '#ccc' : '#1976d2',
                  minWidth: '250px'
                }}
              >
                {loading ? (
                  '🔄 Creating Invoice...'
                ) : (
                  '🚀 Register Company & Create Invoice'
                )}
              </button>
            </div>

            {/* MyFatoorah Integration Notice */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              border: '1px solid #2196f3',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>
                💳 MyFatoorah Payment Integration
              </h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#1565c0' }}>
                Upon invoice creation, your company will be registered and a secure payment link 
                will be automatically generated via MyFatoorah for seamless customer payments.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}