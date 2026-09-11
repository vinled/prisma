const https = require('https');

const asaasKey = process.env.ASAAS_API_KEY || 'fake';

async function req(path, method, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.asaas.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasKey
      }
    };
    const request = https.request(options, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    request.write(data);
    request.end();
  });
}

(async () => {
  // Test if we can make a payment without CPF
  // Note: we can't really test without a real key
})();
