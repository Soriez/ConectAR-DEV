
import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

// Creamos y exportamos ÚNICAMENTE el hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};