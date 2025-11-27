import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../context/AuthContext';

// --- BLOQUEO 1: Solo para Usuarios que NO son Freelancers ---
// (Protege la ruta /hacerse-freelancer)
export const OnlyNonFreelancers = () => {
  const { user, isLoading } = useContext(AuthContext);

  // 1. Si estamos cargando el usuario, mostramos un spinner o nada
  if (isLoading) return <div>Cargando...</div>;

  // 2. Si no hay usuario logueado, mandarlo al login
  if (!user) return <Navigate to="/iniciar-sesion" replace />;

  // 3. Si YA es freelancer, no tiene nada que hacer aquí -> Dashboard
  if (user.role === 'freelancer') {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Si pasa los filtros, muestra la página (Outlet)
  return <Outlet />;
};

// --- BLOQUEO 2: Solo para Freelancers que NO son Premium ---
// (Protege la ruta /hacerse-premium)
export const OnlyStandardFreelancers = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/iniciar-sesion" replace />;

  console.log("OnlyStandardFreelancers Check - User:", user);


  // Si YA es premium, no le cobramos de nuevo -> Dashboard
  if (user.plan === 'premium') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

// --- BLOQUEO 3: Solo Freelancers (Para rutas internas del Dashboard) ---
export const RequireFreelancer = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/iniciar-sesion" replace />;

  // Si no es freelancer, al inicio del dashboard
  if (user.role !== 'freelancer') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};
