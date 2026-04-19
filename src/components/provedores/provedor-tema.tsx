'use client'

import { createContext, useContext, useEffect, useState } from "react"

type Tema = "light" | "dark"

interface TemaContexto {
  theme: Tema
  resolvedTheme: Tema
  setTheme: (tema: Tema) => void
}

const ContextoTema = createContext<TemaContexto>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
})

export function useTheme(): TemaContexto {
  return useContext(ContextoTema)
}

export function ProvedorTema({ children }: { children: React.ReactNode }) {
  const [tema, setTemaState] = useState<Tema>("light")
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const salvo = localStorage.getItem("ws-tema") as Tema | null
    if (salvo === "dark" || salvo === "light") {
      setTemaState(salvo)
    }
    setMontado(true)
  }, [])

  useEffect(() => {
    if (!montado) return
    const root = document.documentElement
    if (tema === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("ws-tema", tema)
  }, [tema, montado])

  function setTheme(novoTema: Tema) {
    setTemaState(novoTema)
  }

  return (
    <ContextoTema.Provider value={{ theme: tema, resolvedTheme: tema, setTheme }}>
      {children}
    </ContextoTema.Provider>
  )
}
