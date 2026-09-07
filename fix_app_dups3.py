with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false,\n                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',", "                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',")
content = content.replace("                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false,\n                title: '',", "                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',")


with open('src/App.tsx', 'w') as f:
    f.write(content)
