const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiCall(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => 
    params[key] !== undefined && url.searchParams.append(key, params[key])
  );
  
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  return response.json();
}

export const mangsakala = {
  getCalendar: (year, region = 'kebumen') => 
    apiCall('/api/calendar', { year, region }),
  
  getDrift: (region = 'kebumen', start_year = 1995, end_year = 2025) => 
    apiCall('/api/drift', { region, start_year, end_year }),
  
  getAlert: (year, region = 'kebumen', threshold_days = 14) => 
    apiCall('/api/alert', { year, region, threshold_days }),
  
  health: () => apiCall('/api/health')
};  