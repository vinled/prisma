with open('src/templates/MinimalistTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace('<span>{details.area} m²</span>', '<span className="font-bold">{details.area} m²</span>')
content = content.replace("<span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>", '<span className="font-bold">{details.bedrooms} {Number(details.bedrooms) !== 1 ? \'Dorms\' : \'Dorm\'}</span>')
content = content.replace("<span>{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>", '<span className="font-bold">{details.suites} {Number(details.suites) !== 1 ? \'Suítes\' : \'Suíte\'}</span>')
content = content.replace("<span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>", '<span className="font-bold">{details.parking} {Number(details.parking) !== 1 ? \'Vagas\' : \'Vaga\'}</span>')

with open('src/templates/MinimalistTemplate.tsx', 'w') as f:
    f.write(content)
