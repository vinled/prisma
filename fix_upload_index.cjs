const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<ImageUploader images={images} onImagesChange={setImages} />',
  `<ImageUploader 
                images={images} 
                onImagesChange={(newImages) => {
                  setImages(newImages);
                  if (newImages.length > images.length) {
                    setPreviewIndex(newImages.length - 1);
                  }
                }} 
              />`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed upload index');
