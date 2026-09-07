with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the duplicated properties inside setDetails
bad_str = "purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',"
good_str = "purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',"

content = content.replace(bad_str, good_str)
content = content.replace("purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',", good_str)
content = content.replace("purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '',", good_str)
with open('src/App.tsx', 'w') as f:
    f.write(content)
