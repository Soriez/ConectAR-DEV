
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import axios from 'axios'; 
import { AuthContext } from './AuthContext'; 

// Definir la URL base de tu backend
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL

// --- Funciones Auxiliares (las dejamos aquí para la lógica interna) ---
const decodeToken = (jwtToken) => {
    try {
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
    }
};

const setAxiosDefaults = (jwtToken) => {
    if (jwtToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};


// 3. El Componente Proveedor (Exportado como Named Export)
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const isAuthenticated = !!token; 

    // --- Función de LOGIN exitoso ---
    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken); 
        setToken(jwtToken);
        const userPayload = userData || decodeToken(jwtToken); 
        setUser(userPayload); 
        setAxiosDefaults(jwtToken); 
        navigate('/'); 
    };

    // --- Función de LOGOUT ---
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAxiosDefaults(null); 
        navigate('/iniciar-sesion');
    };
    
    // --- Efecto de Carga Inicial ---
    useEffect(() => {
        if (initialToken) {
            setAxiosDefaults(initialToken);
            const payload = decodeToken(initialToken);
            
            if (payload && payload.exp * 1000 > Date.now()) {
                // Token válido
                setUser({ _id: payload.id, /* ...datos si están en el payload */ }); 
            } else {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    // 4. Proveer el contexto
    return (
        <AuthContext.Provider 
            value={{ 
                isAuthenticated, 
                user, 
                login, 
                logout, 
                isLoading, 
                BASE_URL 
            }}>
            {children}
        </AuthContext.Provider>
    );
};