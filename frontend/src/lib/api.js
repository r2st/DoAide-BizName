const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const token = localStorage.getItem('bizname_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.detail || `Request failed: ${res.status}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export async function generateNames(keyword, industry = '', style = 'modern', count = 10) {
  return request('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ keyword, industry, style, count }),
  })
}

export async function getNameDetails(name) {
  return request(`/api/generate/name/${encodeURIComponent(name)}`)
}

export async function register(email, password, name = '') {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
  localStorage.setItem('bizname_token', data.access_token)
  return data
}

export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('bizname_token', data.access_token)
  return data
}

export async function getMe() {
  return request('/api/auth/me')
}

export async function saveName(generatedNameId, notes = '') {
  return request('/api/saved', {
    method: 'POST',
    body: JSON.stringify({ generated_name_id: generatedNameId, notes }),
  })
}

export async function getSavedNames() {
  return request('/api/saved')
}

export async function deleteSavedName(id) {
  return request(`/api/saved/${id}`, { method: 'DELETE' })
}

export async function getPricing() {
  return request('/api/pricing')
}

export async function submitFeedback(type, message, page) {
  return request('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({ type, message, page }),
  })
}

export function logout() {
  localStorage.removeItem('bizname_token')
}
