import { createContext, useContext, useEffect, useState } from 'react'
import { THEMES } from '../constants/themes'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark')

  // Aplicar tema al documento
  const applyTheme = (themeName) => {
    const theme = THEMES[themeName]
    if (!theme) return

    // Para TailwindCSS v4 @theme, necesitamos actualizar las variables CSS
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'nombre') {
        root.style.setProperty(`--color-${key}`, value)
      }
    })

    // También establecemos las variables en el body para compatibilidad
    document.body.style.setProperty('--color-texto', theme.texto)
    document.body.style.setProperty('--color-fondo', theme.fondo) 
    document.body.style.setProperty('--color-primario', theme.primario)
    document.body.style.setProperty('--color-secundario', theme.secundario)
    document.body.style.setProperty('--color-acento', theme.acento)
  }

  // Cargar tema desde localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('redfi-theme')
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Aplicar tema por defecto
      applyTheme('dark')
    }
  }, [])

  // Cambiar tema
  const changeTheme = (themeName) => {
    if (!THEMES[themeName]) return

    setCurrentTheme(themeName)
    applyTheme(themeName)
    localStorage.setItem('redfi-theme', themeName)
  }

  // Obtener siguiente tema (para botón toggle)
  const getNextTheme = () => {
    const themeNames = Object.keys(THEMES)
    const currentIndex = themeNames.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themeNames.length
    return themeNames[nextIndex]
  }

  // Toggle entre temas
  const toggleTheme = () => {
    const nextTheme = getNextTheme()
    changeTheme(nextTheme)
  }

  const value = {
    currentTheme,
    availableThemes: Object.keys(THEMES),
    themeData: THEMES[currentTheme],
    changeTheme,
    toggleTheme,
    getNextTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
