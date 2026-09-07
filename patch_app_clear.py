import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_clear_1 = """                  setDetails({
                    title: '', price: '', neighborhood: '', city: '', state: '',
                    area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                    propertyCode: '', propertyType: '', propertySubtype: '',
                    description: '', features: [], amenities: [], differentials: [], whatsapp: ''
                  });"""

new_clear_1 = """                  setDetails({
                    purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: False,
                    title: '', price: '', neighborhood: '', city: '', state: '',
                    area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                    propertyCode: '', propertyType: '', propertySubtype: '',
                    amenities: [], differentials: [], leisureArea: null, whatsapp: ''
                  });"""

old_clear_2 = """              setDetails({
                title: '', price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });"""

new_clear_2 = """              setDetails({
                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false,
                title: '', price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });"""
              
if old_clear_2 in content:
    content = content.replace(old_clear_2, new_clear_2)
    # The first one has description, features which are not in types, they are wrong anyway, let's fix that.
    content = re.sub(r'setDetails\(\{\s*title: \'\', price: \'\',.*?whatsapp: \'\'\s*\}\);', new_clear_2.strip(), content, flags=re.DOTALL)
    
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patched state clearing")
else:
    print("Could not find state clearing")
