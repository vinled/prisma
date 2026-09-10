import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# For preview: it uses image={images[previewIndex] || null} 
# so we can find options={{...templateOptions, badge: seloAtivo}}
# and replace the one near image={images[previewIndex] || null}

preview_block = """                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={{...templateOptions, badge: seloAtivo}}"""

preview_new = """                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}}"""

if preview_block in content:
    content = content.replace(preview_block, preview_new)
else:
    print("Preview block not found")

export_block = """              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}
              options={{...templateOptions, badge: seloAtivo}}"""

export_new = """              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}
              options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[idx] ?? templateOptions.imagePositionX ?? 50}}"""

if export_block in content:
    content = content.replace(export_block, export_new)
else:
    print("Export block not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
