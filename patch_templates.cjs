const fs = require('fs');

const badgeHtml = `
      {/* Badge de Oportunidade/Vendido */}
      {options?.badge && (
        <div 
          className="absolute left-0 z-[15] flex items-center justify-center font-black tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          style={{ 
            top: aspectRatio === 'story' ? '280px' : '200px',
            backgroundColor: (
              options.badge === 'VENDIDO' ? '#dc2626' : 
              options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
              options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
              options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#2563eb'
            ),
            borderRadius: '0 12px 12px 0',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: aspectRatio === 'story' ? '38px' : '28px',
            padding: aspectRatio === 'story' ? '16px 24px' : '12px 18px',
            textTransform: 'uppercase'
          }}
        >
          {options.badge}
        </div>
      )}
`;

const templates = [
  'ModernTemplate.tsx',
  'LuxuryTemplate.tsx',
  'BoldTemplate.tsx',
  'ElegantTemplate.tsx',
  'MinimalistTemplate.tsx'
];

for (const tmpl of templates) {
  const path = 'src/templates/' + tmpl;
  let code = fs.readFileSync(path, 'utf8');
  
  if (code.includes('Sem imagem')) {
    code = code.replace(
      '        </div>\n      )}',
      '        </div>\n      )}' + badgeHtml
    );
    fs.writeFileSync(path, code);
  } else {
    console.log("Could not find insertion point in " + tmpl);
  }
}
