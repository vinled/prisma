import re

with open('src/templates/MyWayTemplate.tsx', 'r') as f:
    content = f.read()

old_logic = """  // 1. Dormitórios e Suítes
  if (details.bedrooms?.trim()) {
    let text = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'}`;
    if (details.suites?.trim() && Number(details.suites) > 0) {
      text += ` | ${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
    }
    pills.push(text);
  }"""

new_logic = """  // 1. Dormitórios e Suítes
  let bedSuiteText = '';
  const hasBedrooms = details.bedrooms && details.bedrooms.trim() !== '';
  const hasSuites = details.suites && details.suites.trim() !== '' && Number(details.suites) > 0;
  
  if (hasBedrooms && hasSuites) {
    bedSuiteText = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'} | ${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
  } else if (hasBedrooms) {
    bedSuiteText = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'}`;
  } else if (hasSuites) {
    bedSuiteText = `${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
  }
  
  if (bedSuiteText) {
    pills.push(bedSuiteText);
  }"""

content = content.replace(old_logic, new_logic)

with open('src/templates/MyWayTemplate.tsx', 'w') as f:
    f.write(content)

