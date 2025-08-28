const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const formatInvoiceNumber = (num) => `INV-${String(num).padStart(6, '0')}`;
const formatCurrency = (amount) => (amount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

module.exports = {
  generateId,
  formatInvoiceNumber,
  formatCurrency,
  formatDate
};