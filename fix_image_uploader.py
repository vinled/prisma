import re

with open('src/components/ImageUploader.tsx', 'r') as f:
    content = f.read()

# Make sure Camera is imported
content = content.replace("import { Upload, X } from 'lucide-react';", "import { Upload, X, Camera } from 'lucide-react';")

old_img = """<img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover"  />"""
new_img = """<img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover" onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  target.nextElementSibling.classList.remove('hidden');
                }
              }} />
              <div className="hidden w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>"""

content = content.replace(old_img, new_img)

with open('src/components/ImageUploader.tsx', 'w') as f:
    f.write(content)
print("Success")
