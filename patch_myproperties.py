import re

with open('src/components/MyProperties.tsx', 'r') as f:
    content = f.read()

old_caption = """  const handleCopyCaption = (prop: SavedProperty) => {
    const type = prop.details.propertyType || 'Imóvel';
    const location = [prop.details.neighborhood, prop.details.city].filter(Boolean).join(', ');
    const price = prop.details.price ? ` - ${prop.details.price}` : '';
    const caption = `Confira: ${type}${location ? ` em ${location}` : ''}${price}.\\n\\nPara mais informações, entre em contato!`;
    
    navigator.clipboard.writeText(caption)"""

new_caption = """  const handleCopyCaption = (prop: SavedProperty) => {
    let caption = prop.details.generated_copy;
    if (!caption) {
      const type = prop.details.propertyType || 'Imóvel';
      const location = [prop.details.neighborhood, prop.details.city].filter(Boolean).join(', ');
      const price = prop.details.price ? ` - ${prop.details.price}` : '';
      caption = `Confira: ${type}${location ? ` em ${location}` : ''}${price}.\\n\\nPara mais informações, entre em contato!`;
    }
    
    navigator.clipboard.writeText(caption)"""

if old_caption in content:
    content = content.replace(old_caption, new_caption)
else:
    print("Old caption logic not found in MyProperties")

with open('src/components/MyProperties.tsx', 'w') as f:
    f.write(content)
