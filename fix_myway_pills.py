import re

with open('src/templates/MyWayTemplate.tsx', 'r') as f:
    content = f.read()

old_logic = """  // Construct Pills
  const pills = [];
  if (details.bedrooms?.trim()) {
    let text = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}`;
    if (details.suites?.trim() && Number(details.suites) > 0) {
      text += ` | ${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
    }
    pills.push(text);
  }
  if (details.parking?.trim()) {
    pills.push(`${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'} de Garagem`);
  }
  if (details.porteiraFechada) {
    pills.push('Porteira Fechada');
  } else if (details.leisureArea) {
    pills.push(details.leisureArea);
  } else if (details.area?.trim()) {
    pills.push(`${details.area} m²`);
  }
  
  // Also push differentials if we have room (max 4 pills usually)
  const availableDifferentials = details.differentials || [];
  for (const diff of availableDifferentials) {
    if (pills.length < 4 && !pills.includes(diff)) {
      pills.push(diff);
    }
  }"""

new_logic = """  // Construct Pills
  const pills: string[] = [];
  
  // 1. Dormitórios e Suítes
  if (details.bedrooms?.trim()) {
    let text = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'}`;
    if (details.suites?.trim() && Number(details.suites) > 0) {
      text += ` | ${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
    }
    pills.push(text);
  }
  
  // 2. Vagas de Garagem
  if (details.parking?.trim()) {
    pills.push(`${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'} de Garagem`);
  }
  
  // 3. APENAS UM diferencial
  if (details.porteiraFechada) {
    pills.push('Porteira Fechada');
  } else if (details.leisureArea) {
    pills.push('Lazer Completo');
  } else if (details.differentials && details.differentials.length > 0) {
    pills.push(details.differentials[0]);
  } else if (details.amenities && details.amenities.length > 0) {
    pills.push(details.amenities[0]);
  } else if (details.area?.trim()) {
    pills.push(`${details.area} m²`);
  }"""

content = content.replace(old_logic, new_logic)

with open('src/templates/MyWayTemplate.tsx', 'w') as f:
    f.write(content)

