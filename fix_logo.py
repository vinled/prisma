import re

with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

old_code = """              // DO NOT fill background with white if it's a PNG!
              if (file.type !== 'image/png') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
              } else {
                ctx.clearRect(0, 0, width, height); // ensure transparent
              }
              ctx.drawImage(img, 0, 0, width, height);
              
              const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
              const quality = outType === 'image/jpeg' ? 0.9 : undefined;
              
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject('Blob conversion failed');
              }, outType, quality);
            };
            img.onerror = () => reject('Image load failed');
            img.src = URL.createObjectURL(file);
          });

          const isPng = file.type === 'image/png';
          const fileExt = isPng ? 'png' : 'jpg';"""

new_code = """              const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');
              
              // DO NOT fill background with white if it's a PNG!
              if (!isPng) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
              } else {
                ctx.clearRect(0, 0, width, height); // ensure transparent
              }
              ctx.drawImage(img, 0, 0, width, height);
              
              const outType = isPng ? 'image/png' : 'image/jpeg';
              const quality = isPng ? undefined : 0.9;
              
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject('Blob conversion failed');
              }, outType, quality);
            };
            img.onerror = () => reject('Image load failed');
            img.src = URL.createObjectURL(file);
          });

          const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');
          const fileExt = isPng ? 'png' : 'jpg';"""

content = content.replace(old_code, new_code)
with open('src/components/LogoUploader.tsx', 'w') as f:
    f.write(content)
