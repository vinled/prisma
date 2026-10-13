import { authenticateBilling, claimLease, releaseLease, requireToken, respondBillingError, BillingError, type BillingLease } from '../server/billing';
import { createOrReuseCheckout } from '../server/checkout';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  let lease: BillingLease;
  let admin;
  try {
    requireToken(req);
    const cpf = typeof req.body?.cpf === 'string' ? req.body.cpf.replace(/\D/g, '') : '';
    if (!/^(\d{11}|\d{14})$/.test(cpf)) throw new BillingError(400, 'Informe um CPF ou CNPJ válido.');
    const context = await authenticateBilling(req);
    admin = context.admin;
    lease = await claimLease(admin, context.user.id);
    const result = await createOrReuseCheckout(admin, context.apiKey, context.user, cpf, lease);
    return res.status(200).json(result);
  } catch (error) { return respondBillingError(res, error); }
  finally { if (lease) await releaseLease(admin, lease); }
}
