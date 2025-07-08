export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  const get = async (endpoint: string, options: RequestInit = {}) => {
    return apiCall(endpoint, { ...options, method: 'GET' })
  }

  const post = async (endpoint: string, data?: any, options: RequestInit = {}) => {
    return apiCall(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  const put = async (endpoint: string, data?: any, options: RequestInit = {}) => {
    return apiCall(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  const del = async (endpoint: string, options: RequestInit = {}) => {
    return apiCall(endpoint, { ...options, method: 'DELETE' })
  }

  // Helper function to build URLs (useful for image URLs, etc.)
  const buildUrl = (endpoint: string) => {
    return `${baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  }

  return {
    get,
    post,
    put,
    delete: del,
    buildUrl,
    baseURL
  }
}
