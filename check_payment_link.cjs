const https = require('https');

function request(path, method, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'sandbox.asaas.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwMDE2NTE6OiRhYWN0XzIwNWQxZDhlLTYxNGEtNGJkYi1hMGY2LThlNWNiZGIxOTZhOA=='
      }
    };
    const req = https.request(options, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  const res = await request('/api/v3/paymentLinks', 'POST', {
    name: "Teste Link Dinamico",
    value: 49.90,
    chargeType: "DETACHED",
    billingType: "UNDEFINED",
    description: "Teste de ref",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    externalReference: "meu-uuid-1234"
  });
  console.log("PAYMENT LINK:", res.status, res.body);
})();
