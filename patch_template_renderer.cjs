const fs = require('fs');
let code = fs.readFileSync('src/components/TemplateRenderer.tsx', 'utf8');

const oldReturn = `  switch (templateId) {
    case 'modern':
      return <ModernTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'luxury':
      return <LuxuryTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'bold':
      return <BoldTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'elegant':
      return <ElegantTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'minimalist':
      return <MinimalistTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    default:
      return null;
  }`;

const newReturn = `  let TemplateComponent = null;

  switch (templateId) {
    case 'modern':
      TemplateComponent = <ModernTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
    case 'luxury':
      TemplateComponent = <LuxuryTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
    case 'bold':
      TemplateComponent = <BoldTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
    case 'elegant':
      TemplateComponent = <ElegantTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
    case 'minimalist':
      TemplateComponent = <MinimalistTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
  }

  if (!TemplateComponent) return null;

  return (
    <>
      {TemplateComponent}
      {userPlan !== 'pro' && (
        <div 
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '50px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.7)',
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            pointerEvents: 'none',
            fontFamily: 'sans-serif',
            fontWeight: 500
          }}
        >
          Criado com Prisma Imóveis
        </div>
      )}
    </>
  );`;

code = code.replace(
  'export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = \'feed\', brandKit, options }: TemplateRendererProps)',
  'export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = \'feed\', brandKit, options, userPlan = \'free\' }: TemplateRendererProps)'
);

code = code.replace(oldReturn, newReturn);

fs.writeFileSync('src/components/TemplateRenderer.tsx', code);
