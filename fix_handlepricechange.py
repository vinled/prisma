import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

old_fn = '''  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) {
      onChange({ ...details, price: '' });
      return;
    }
    const numericValue = parseInt(value, 10);
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
    onChange({ ...details, price: formattedValue });
  };'''

new_fn = '''  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let value = e.target.value.replace(/\D/g, '');
    if (!value) {
      onChange({ ...details, [name]: '' });
      return;
    }
    const numericValue = parseInt(value, 10);
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
    onChange({ ...details, [name]: formattedValue });
  };'''

content = content.replace(old_fn, new_fn)
with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)

