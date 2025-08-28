const MYFATOORAH_API_TOKEN = process.env.MYFATOORAH_API_TOKEN;
const MYFATOORAH_API_URL = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com/v2';

console.log('🔍 Environment Check:');
console.log("🔑 [DEBUG] MyFatoorah Token being used:", MYFATOORAH_API_TOKEN);
console.log('MYFATOORAH_API_URL:', MYFATOORAH_API_URL);

module.exports = {
  MYFATOORAH_API_TOKEN,
  MYFATOORAH_API_URL
};