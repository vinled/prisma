const fs = require('fs');
let code = fs.readFileSync('.env.example', 'utf8');

if (!code.includes('ASAAS_WEBHOOK_TOKEN')) {
  code += `\n# Asaas Webhook Security Token\nASAAS_WEBHOOK_TOKEN="your-asaas-webhook-token"\n`;
  code += `# Supabase Service Role Key (Bypass RLS for backend)\nSUPABASE_SERVICE_ROLE_KEY="your-service-role-key"\n`;
  fs.writeFileSync('.env.example', code);
}
