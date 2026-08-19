const fs = require('fs');
let code = fs.readFileSync('src/components/BrandKitForm.tsx', 'utf8');

const checkboxCode = `      <div className="flex items-center pt-2 mt-4">
        <input
          type="checkbox"
          id="saveBrandKit"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={brandKit?.isSaved || false}
          onChange={(e) => handleChange('isSaved', e.target.checked)}
        />
        <label htmlFor="saveBrandKit" className="ml-2 block text-sm text-gray-900 dark:text-zinc-300">
          Salvar como minha identidade
        </label>
      </div>`;

code = code.replace(checkboxCode, '');

// update the default to always true
code = code.replace('isSaved: false', 'isSaved: true');

fs.writeFileSync('src/components/BrandKitForm.tsx', code);

let propertyFormCode = fs.readFileSync('src/components/PropertyForm.tsx', 'utf8');
propertyFormCode = propertyFormCode.replace(/brandKit\?\.isSaved && /g, '');
fs.writeFileSync('src/components/PropertyForm.tsx', propertyFormCode);
