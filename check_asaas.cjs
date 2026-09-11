const https = require('https');

const data = JSON.stringify({
  billingType: "UNDEFINED",
  chargeType: "DETACHED",
  name: "Plano PRO",
  value: 29.90,
  description: "Plano PRO",
  dueDateLimitDays: 3,
  externalReference: "test-user-id"
});

const options = {
  hostname: 'api.asaas.com',
  port: 443,
  path: '/v3/paymentLinks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY || 'fake-key' // We expect 401 if fake
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
