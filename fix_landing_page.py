import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Add imports
if "TemplateRenderer" not in content:
    import_statement = "import { TemplateRenderer } from './TemplateRenderer';\n"
    content = content.replace("import { PostNaMaoLogo } from './PostNaMaoLogo';", "import { PostNaMaoLogo } from './PostNaMaoLogo';\n" + import_statement)

# Prepare Mock data
mock_data = """
const mockDetails = {
  title: "OPORTUNIDADE IMPERDÍVEL",
  price: "R$ 1.250.000",
  neighborhood: "Vila Nova Conceição",
  city: "São Paulo",
  state: "SP",
  area: "120",
  bedrooms: "3",
  suites: "1",
  bathrooms: "3",
  parking: "2",
  propertyCode: "REF001",
  propertyType: "Apartamento",
  propertySubtype: "Padrão",
  amenities: ["Piscina", "Academia", "Churrasqueira"],
  differentials: ["Varanda Gourmet", "Andar Alto"],
  leisureArea: true,
  whatsapp: "11 99999-9999"
};
const mockImageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1080&q=80";
"""

if "mockDetails" not in content:
    content = content.replace("export function LandingPage({ onLogin }: LandingPageProps) {", "export function LandingPage({ onLogin }: LandingPageProps) {\n" + mock_data)

# Replace the "Antes" card content
antes_old = """<div className="flex-grow flex items-center justify-center bg-slate-800 rounded-xl mb-6 aspect-video border border-slate-700/50">
                  <XCircle className="w-16 h-16 text-slate-600" />
                </div>"""
                
antes_new = """<div className="flex-grow flex items-center justify-center bg-slate-800 rounded-xl mb-6 aspect-square border border-slate-700/50 overflow-hidden relative">
                  <img src={mockImageUrl} alt="Antes" className="absolute inset-0 w-full h-full object-cover" />
                </div>"""

# Replace the "Depois" card content
depois_old = """<div className="flex-grow flex items-center justify-center bg-slate-800 rounded-xl mb-6 aspect-video border border-orange-500/30">
                  <PostNaMaoLogo className="h-16 w-auto" />
                </div>"""
                
depois_new = """<div className="flex-grow bg-slate-800 rounded-xl mb-6 aspect-square border border-orange-500/30 overflow-hidden relative group">
                  <div className="absolute inset-0 origin-top-left" style={{ transform: 'scale(1)', width: '1080px', height: '1080px' }}>
                    <TemplateRenderer 
                      templateId="modern" 
                      details={mockDetails} 
                      image={mockImageUrl} 
                      logo={null} 
                      aspectRatio="feed" 
                      options={{ gradientOpacity: 60, imagePositionX: 50, logoSize: 100 }} 
                    />
                  </div>
                </div>"""

content = content.replace(antes_old, antes_new)
content = content.replace(depois_old, depois_new)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
