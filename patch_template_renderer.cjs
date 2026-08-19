const fs = require('fs');
let code = fs.readFileSync('src/components/TemplateRenderer.tsx', 'utf8');

// Import useSafeImage
code = code.replace(
  "import { TemplateId, TemplateProps } from '../types';",
  "import { TemplateId, TemplateProps } from '../types';\nimport { useSafeImage } from '../hooks/useSafeImage';"
);

// Inject into TemplateRenderer
const before = "export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = 'feed', brandKit, options, userPlan = 'free' }: TemplateRendererProps) {";
const after = `export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = 'feed', brandKit, options, userPlan = 'free' }: TemplateRendererProps) {
  const safeImage = useSafeImage(image);
  const safeLogo = useSafeImage(logo);
`;
code = code.replace(before, after);

// Replace image with safeImage and logo with safeLogo
code = code.replace(/image=\{image\}/g, "image={safeImage}");
code = code.replace(/logo=\{logo\}/g, "logo={safeLogo}");

fs.writeFileSync('src/components/TemplateRenderer.tsx', code);
