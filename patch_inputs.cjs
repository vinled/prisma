const fs = require('fs');

let code = fs.readFileSync('src/components/PropertyForm.tsx', 'utf8');

// Replace standard numbers with inputMode="numeric"
const numericNames = ['price', 'area', 'bedrooms', 'suites', 'bathrooms', 'parking', 'propertyCode'];

for (const name of numericNames) {
  // We look for name="name" and ensure inputMode is added. 
  // A safe way is to find `name="NAME"` and inject `inputMode="numeric"` right after it.
  const regex = new RegExp(`name="${name}"`, 'g');
  code = code.replace(regex, `name="${name}"\n            inputMode="numeric"`);
}

// For whatsapp, we want to change type="text" to type="tel" and add inputMode="numeric"
// Since whatsapp appears a few times, we will find `name="whatsapp"` and modify its properties.
code = code.replace(
  /type="text"(\s*)name="whatsapp"/g, 
  'type="tel"$1name="whatsapp"$1inputMode="numeric"'
);

fs.writeFileSync('src/components/PropertyForm.tsx', code);
