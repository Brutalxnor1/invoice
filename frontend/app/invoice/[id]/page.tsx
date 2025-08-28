// File: app/invoice/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  balance: number;
  status: string;
  payment_link?: string;
  sale_agent?: string;
  company?: {
    name: string;
    address: string;
    city: string;
    country: string;
    trn: string;
    email: string;
  };
  customer?: {
    name: string;
    trn?: string;
  };
  contact?: {
    name: string;
    mobile: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    tax_percentage: number;
    amount: number;
    property?: {
      building_name: string;
      property_no: string;
      floor_no: number;
      parkings: string;
      suite_area: number;
      balcony_area: number;
      area_sq_meter: number;
      area_sq_feet: number;
      common_area: number;
    };
  }>;
}

export default function InvoiceView() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.id && typeof params.id === 'string') {
      fetchInvoice(params.id);
    } else {
      setLoading(false);
    }
  }, [params]);

  const fetchInvoice = async (id: string) => {
    try {
      // const response = await fetch(`http://localhost:3001/invoices/${id}`);
      const response = await fetch(`/api/invoices/${id}`);
      const data = await response.json();
      if (data.success) {
        setInvoice(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getPropertyDetails = (property: any) => {
    if (!property) return '';
    return `
      Building: ${property.building_name || 'N/A'},
      Property No: ${property.property_no || 'N/A'},
      Floor: ${property.floor_no || 'N/A'},
      Parkings: ${property.parkings || 'N/A'},
      Suite Area: ${property.suite_area || 0},
      Balcony Area: ${property.balcony_area || 0},
      Sq Meter: ${property.area_sq_meter || 0},
      Sq Feet: ${property.area_sq_feet || 0},
      Common Area: ${property.common_area || 0}
    `;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>Invoice not found</h2>
          <Link href="/" className="btn btn-primary">Back to Invoices</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Invoice Details</h1>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2>TAX INVOICE</h2>
              <h3 style={{ color: '#666', margin: '5px 0' }}># {invoice.invoice_number}</h3>
              <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                Balance: {formatCurrency(invoice.balance)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/" className="btn btn-secondary">
                Back to List
              </Link>
              <a href={`http://localhost:3001/invoices/${invoice.id}/pdf`} className="btn btn-primary" target="_blank">
                Download PDF
              </a>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginBottom: '30px' }}>
            <div>
              <h4>Company Information</h4>
              <div><strong>{invoice.company?.name || 'Company Name'}</strong></div>
              <div>{invoice.company?.address || 'Company Address'}</div>
              <div>{invoice.company?.city || 'City'}, {invoice.company?.country || 'Country'}</div>
              <div>TRN {invoice.company?.trn || 'TRN Number'}</div>
              <div>{invoice.company?.email || 'company@email.com'}</div>
            </div>
            <div>
              <h4>Bill To:</h4>
              <div><strong>{invoice.customer?.name}</strong></div>
              <div>Mobile: {invoice.contact?.mobile || 'N/A'}</div>
              <div>Email: {invoice.contact?.email || 'N/A'}</div>
              <div>TRN: {invoice.customer?.trn || 'N/A'}</div>
              <br />
              <div><strong>Invoice Date:</strong> {formatDate(invoice.invoice_date)}</div>
              <div><strong>Due Date:</strong> {formatDate(invoice.due_date)}</div>
              {invoice.sale_agent && <div><strong>Sale Agent:</strong> {invoice.sale_agent}</div>}
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Property Details</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{getPropertyDetails(item.property)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.rate)}</td>
                  <td>{item.tax_percentage}%</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <strong>Total:</strong>
                <strong>{formatCurrency(invoice.total)}</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                <span>Amount Due:</span>
                <span>{formatCurrency(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {invoice.payment_link && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
              <h4>Payment Information</h4>
              <p>Status: <span style={{ 
                fontWeight: 'bold',
                color: invoice.status === 'paid' ? '#4caf50' : '#ff9800'
              }}>{invoice.status.toUpperCase()}</span></p>
              
              {invoice.status !== 'paid' && (
                <div style={{ marginTop: '15px' }}>
                  <a 
                    href={invoice.payment_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Pay Now via MyFatoorah
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}