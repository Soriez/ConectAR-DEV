```javascript
import { Navigate, Outlet } from 'react-router';

// --- BLOQUEO 1: Solo para Usuarios que NO son Freelancers ---
// (Protege la ruta /hacerse-freelancer)
export const OnlyUsers = ({ user, isLoading }) => {
  // 1. Si estamos cargando el usuario, mostramos un spinner o nada (para evitar rebotes raros)
  if (isLoading) return <div>Cargando...</div>; 

  // 2. Si no hay usuario logueado, mandarlo al login
  if (!user) return <Navigate to="/login" replace />;

  // 3. Si YA es freelancer, no tiene nada que hacer aquí -> Dashboard
  if (user.role === 'freelancer') {
    return <Navigate to="/dashboard/perfil" replace />;
  }

  // 4. Si pasa los filtros, muestra la página (Outlet)
  return <Outlet />;
};

// --- BLOQUEO 2: Solo para Freelancers que NO son Premium ---
// (Protege la ruta /hacerse-premium)
export const OnlyStandardFreelancers = ({ user, isLoading }) => {
  if (isLoading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // 1. Si NO es freelancer, primero tiene que hacerse uno
  if (user.role !== 'freelancer') {
     return <Navigate to="/hacerse-freelancer" replace />;
  }

  // 2. Si YA es premium, no le cobramos de nuevo -> Dashboard
  if (user.plan === 'premium') {
     return <Navigate to="/dashboard/perfil" replace />;
  }

  return <Outlet />;
};
```