
import { useState, useEffect } from 'react';
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
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
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
    const login = async (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setAxiosDefaults(jwtToken);

        // Obtener datos completos del usuario
        const payload = decodeToken(jwtToken);
        try {
            const response = await axios.get(`${BASE_URL}/api/users/${payload.id}`);
            setUser(response.data);
        } catch (error) {
            setUser(userData || payload);
        }

        navigate('/');
    };

    // --- Función de LOGOUT ---
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAxiosDefaults(null);
    };

    // --- Actualizar a Freelancer Premium ---
    const upgradeToPremium = async () => {
        try {
            // Asumiendo que esta es tu ruta backend definida anteriormente
            const response = await axios.put(`${BASE_URL}/api/users/upgrade-premium`);

            // Actualizamos el estado local del usuario con la respuesta (que trae isPremium: true)
            setUser(response.data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Error al actualizar" };
        }
    };

    // --- Efecto de Carga Inicial ---
    useEffect(() => {
        const loadUser = async () => {
            if (initialToken) {
                setAxiosDefaults(initialToken);
                const payload = decodeToken(initialToken);

                if (payload && payload.exp * 1000 > Date.now()) {
                    // Token válido, ahora obtenemos los datos completos del usuario
                    try {
                        const response = await axios.get(`${BASE_URL}/api/users/${payload.id}`);
                        setUser(response.data);
                    } catch (error) {
                        logout();
                    }
                } else {
                    logout();
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    // 4. Proveer el contexto
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                token,
                login,
                logout,
                isLoading,
                BASE_URL,
                setUser,
                upgradeToPremium
            }}>
            {children}
        </AuthContext.Provider>
    );
};