with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

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

if "mockDetails = {" not in content:
    content = content.replace("interface LandingPageProps {", mock_data + "\ninterface LandingPageProps {")

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
