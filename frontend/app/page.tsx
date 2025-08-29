
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  total: number;
  status: string;
  customer?: {
    name: string;
  };
}

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // const response = await fetch('/api/invoices');
      const response = await fetch('http://localhost:3001/invoices');
      const data = await response.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
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

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Invoice Generator</h1>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Invoices</h2>
            <Link href="/create" className="btn btn-primary">
              Create New Invoice
            </Link>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center">
              <p>No invoices found</p>
              <Link href="/create" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customer?.name || 'N/A'}</td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: invoice.status === 'paid' ? '#4caf50' : 
                               invoice.status === 'sent' ? '#ff9800' : '#666'
                      }}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <Link href={`/invoice/${invoice.id}`} className="btn btn-secondary" style={{ marginRight: '8px' }}>
                        View
                      </Link>
                      <a href={`http://localhost:3001/invoices/${invoice.id}/pdf`} className="btn btn-secondary" target="_blank">
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
