import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => { return useContext(ThemeContext); };

export const ThemeProvider = ({ children }) => {
    const[theme, setTheme] = useState(() => {
        return localStorage.getItem('resolver-theme') || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('resolver-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };
    return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};