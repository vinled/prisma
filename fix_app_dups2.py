import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, ", "")
content = content.replace("title: '',", "purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',")

with open('src/App.tsx', 'w') as f:
    f.write(content)
