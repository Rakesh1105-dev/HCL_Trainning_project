import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)
const USER_KEY = 'retail_user'
const TOKEN_KEY = 'retail_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password })
      const payload = response?.data?.data

      if (!payload?.token || !payload?.user) {
        return { success: false, message: 'Login failed. Please try again.' }
      }

      localStorage.setItem(TOKEN_KEY, payload.token)
      setUser(payload.user)
      return { success: true }
    } catch (error) {
      const message = error?.response?.data?.message || 'Invalid credentials.'
      return { success: false, message }
    }
  }

  const register = async (details) => {
    try {
      const payload = {
        name: details.name,
        email: details.email,
        phone: details.phone,
        password: details.password,
      }

      const response = await api.register(payload)
      const data = response?.data?.data

      if (!data?.token || !data?.user) {
        return { success: false, message: 'Registration failed. Please try again.' }
      }

      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed.'
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
