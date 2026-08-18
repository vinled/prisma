const fs = require('fs');

// 1. ModernTemplate
let modern = fs.readFileSync('src/templates/ModernTemplate.tsx', 'utf8');
modern = modern.replace(
  "features.push({ icon: BedDouble, label: \`\${details.bedrooms} \${aspectRatio === 'story' ? 'Dorms' : 'Dorm'}\` });",
  "features.push({ icon: BedDouble, label: \`\${details.bedrooms} \${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}\` });"
);
modern = modern.replace(
  "features.push({ icon: Bath, label: \`\${details.suites} \${aspectRatio === 'story' ? 'Suítes' : 'Suíte'}\` });",
  "features.push({ icon: Bath, label: \`\${details.suites} \${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}\` });"
);
modern = modern.replace(
  "features.push({ icon: Bath, label: \`\${details.bathrooms} \${aspectRatio === 'story' ? 'Banh' : 'Banh'}\` });",
  "features.push({ icon: Bath, label: \`\${details.bathrooms} \${Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh'}\` });"
);
modern = modern.replace(
  "features.push({ icon: Car, label: \`\${details.parking} \${aspectRatio === 'story' ? 'Vagas' : 'Vaga'}\` });",
  "features.push({ icon: Car, label: \`\${details.parking} \${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}\` });"
);
fs.writeFileSync('src/templates/ModernTemplate.tsx', modern);


// 2. LuxuryTemplate
let luxury = fs.readFileSync('src/templates/LuxuryTemplate.tsx', 'utf8');
luxury = luxury.replace(
  "features.push({ icon: BedDouble, text: \`\${details.bedrooms} Dorm.\` });",
  "features.push({ icon: BedDouble, text: \`\${details.bedrooms} \${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}\` });"
);
luxury = luxury.replace(
  "features.push({ icon: Bath, text: \`\${details.suites?.trim() ? details.suites : details.bathrooms} \${details.suites?.trim() ? 'Suítes' : 'Banh.'}\` });",
  "features.push({ icon: Bath, text: \`\${details.suites?.trim() ? details.suites : details.bathrooms} \${details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}\` });"
);
luxury = luxury.replace(
  "features.push({ icon: Car, text: \`\${details.parking} Vagas\` });",
  "features.push({ icon: Car, text: \`\${details.parking} \${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}\` });"
);
fs.writeFileSync('src/templates/LuxuryTemplate.tsx', luxury);


// 3. BoldTemplate
let bold = fs.readFileSync('src/templates/BoldTemplate.tsx', 'utf8');
bold = bold.replace(
  "<span>{details.bedrooms} Qts</span>",
  "<span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>"
);
bold = bold.replace(
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.bedrooms} Qts</span>",
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>"
);
bold = bold.replace(
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.suites} Suít</span>",
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>"
);
bold = bold.replace(
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.parking} Vagas</span>",
  "<span className={`font-bold ${aspectRatio === 'story' ? 'text-lg' : 'text-[12px]'} drop-shadow`}>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>"
);
fs.writeFileSync('src/templates/BoldTemplate.tsx', bold);


// 4. ElegantTemplate
let elegant = fs.readFileSync('src/templates/ElegantTemplate.tsx', 'utf8');
elegant = elegant.replace(
  "<span>{details.bedrooms}</span>",
  "<span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>"
);
elegant = elegant.replace(
  "<span>{details.suites?.trim() ? details.suites : details.bathrooms}</span>",
  "<span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>"
);
elegant = elegant.replace(
  "<span>{details.parking}</span>",
  "<span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>"
);
fs.writeFileSync('src/templates/ElegantTemplate.tsx', elegant);


// 5. MinimalistTemplate
let minimalist = fs.readFileSync('src/templates/MinimalistTemplate.tsx', 'utf8');
minimalist = minimalist.replace(
  "<span>{details.bedrooms} {aspectRatio === 'story' ? 'Dorms' : 'Qts'}</span>",
  "<span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>"
);
minimalist = minimalist.replace(
  "<span>{details.suites} {aspectRatio === 'story' ? 'Suítes' : 'Suít'}</span>",
  "<span>{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>"
);
minimalist = minimalist.replace(
  "<span>{details.parking} {aspectRatio === 'story' ? 'Vagas' : 'Vagas'}</span>",
  "<span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>"
);
fs.writeFileSync('src/templates/MinimalistTemplate.tsx', minimalist);

