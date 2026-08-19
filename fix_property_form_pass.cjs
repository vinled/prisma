const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<PropertyForm details={details} brandKit={brandKit} onChange={setDetails} />',
  '<PropertyForm details={details} brandKit={applyBrandKit ? brandKit : null} onChange={setDetails} />'
);

fs.writeFileSync('src/App.tsx', code);
