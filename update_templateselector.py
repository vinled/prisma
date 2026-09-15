import re

with open('src/components/TemplateSelector.tsx', 'r') as f:
    content = f.read()

new_template = '''  { 
    id: 'myway', 
    name: 'My Way',
    preview: (
      <div className="w-full h-16 bg-gray-200 relative overflow-hidden rounded-md mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute top-1 left-0 right-0 flex justify-center">
           <div className="w-1/3 h-2 bg-white/80 rounded-full" />
        </div>
        <div className="absolute bottom-1 left-1 right-1 space-y-1">
          <div className="w-1/2 h-2 bg-white rounded-full" />
          <div className="w-3/4 h-2 bg-orange-400 rounded-full" />
          <div className="w-full h-1 bg-white/50 rounded-full" />
        </div>
      </div>
    )
  },
];'''

content = content.replace('];', new_template)

grid_old = 'grid-cols-2 md:grid-cols-5'
grid_new = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
content = content.replace(grid_old, grid_new)

with open('src/components/TemplateSelector.tsx', 'w') as f:
    f.write(content)
