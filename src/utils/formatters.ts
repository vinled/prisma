export function formatLocation(neighborhood: string, city: string, state: string): string {
  const parts = [];
  if (neighborhood) parts.push(neighborhood);
  
  const cityState = [];
  if (city) cityState.push(city);
  if (state) cityState.push(state);
  
  if (cityState.length > 0) {
    parts.push(cityState.join('/'));
  }
  
  return parts.join(' • ');
}
