// Basic test to see if we can get a valid JSON response from the server script (we can run it with node)
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/generate-caption',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fake_token_for_test'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data);
    try {
      const json = JSON.parse(data);
      console.log("JSON parsed successfully:", json);
    } catch (e) {
      console.log("Error parsing JSON:", e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(JSON.stringify({ promptText: 'Test', targetAudience: 'Luxo/Exclusividade (Pro)' }));
req.end();
