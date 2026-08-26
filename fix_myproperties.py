import re

with open('src/components/MyProperties.tsx', 'r') as f:
    content = f.read()

# Add Camera to imports
content = content.replace(
    "import { Edit2, Copy, Trash2, Image as ImageIcon, Home, Search } from 'lucide-react';",
    "import { Edit2, Copy, Trash2, Image as ImageIcon, Home, Search, Camera } from 'lucide-react';"
)

# Add SafeImage component
safe_image_component = """
const SafeImage = ({ src, alt, className, iconClassName }: any) => {
  const [error, setError] = React.useState(false);
  
  if (!src || error) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-zinc-800 flex items-center justify-center`}>
        <Camera className={iconClassName || "w-5 h-5 text-gray-400"} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

interface Props {
"""
content = content.replace("interface Props {", safe_image_component)

# Replace <img> rendering
# Desktop version
content = re.sub(
    r'\{property\.thumbnail \? \([\s\S]*?<img[\s\S]*?className="([^"]+)"[\s\S]*?\/>[\s\S]*?\) : \([\s\S]*?<ImageIcon className="([^"]+)" \/>[\s\S]*?\) \}',
    r'<SafeImage src={property.thumbnail} alt={title} className="\1" iconClassName="\2" />',
    content
)

# Replace it in one more place (Mobile version)
with open('src/components/MyProperties.tsx', 'w') as f:
    f.write(content)
print("Success")
