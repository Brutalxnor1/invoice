const axios = require('axios');
const { MYFATOORAH_API_TOKEN, MYFATOORAH_API_URL } = require('../config');

class MyFatoorahService {
  constructor() {
    this.apiUrl = MYFATOORAH_API_URL;
    this.apiToken = MYFATOORAH_API_TOKEN;
    
    if (!this.apiToken) {
      console.error('❌ CRITICAL: MyFatoorah API Token is missing!');
    } else {
      console.log('✅ MyFatoorah service initialized');
    }
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  async createPaymentLink(paymentData) {
    if (!this.apiToken) {
      throw new Error('MyFatoorah API Token is not configured');
    }

    try {
      console.log('🔄 Creating MyFatoorah payment link...');
      
      const response = await axios.post(
        `${this.apiUrl}/SendPayment`,
        paymentData,
        { headers: this.getHeaders() }
      );

      console.log('✅ MyFatoorah response success');
      return response.data;
    } catch (error) {
      console.error('❌ MyFatoorah API Error:', error.response?.data || error.message);
      throw new Error('Failed to create payment link: ' + (error.response?.data?.Message || error.message));
    }
  }
}

module.exports = new MyFatoorahService();