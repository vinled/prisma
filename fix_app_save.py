import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update executeSave's propertyData creation
old_property = """      const propertyData: SavedProperty = {
        id: idEmEdicao || Date.now().toString(),
        date: dateStr,
        details,
        selectedTemplate,"""

new_property = """      const propertyData: SavedProperty = {
        id: idEmEdicao || Date.now().toString(),
        date: dateStr,
        details: { ...details, images: finalImages },
        selectedTemplate,"""

content = content.replace(old_property, new_property)

# 2. Update handleEdit
old_edit = """  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.thumbnail ? [prop.thumbnail] : []);
    setIdEmEdicao(prop.id);"""

new_edit = """  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.details.images && prop.details.images.length > 0 ? prop.details.images : (prop.thumbnail ? [prop.thumbnail] : []));
    setIdEmEdicao(prop.id);"""

content = content.replace(old_edit, new_edit)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated executeSave and handleEdit in App.tsx")
