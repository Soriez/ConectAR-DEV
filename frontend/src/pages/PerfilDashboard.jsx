import React from 'react';

const PerfilDashboard = () => {
  // Datos de prueba
  const user = { name: 'John', surname: 'Don', email: 'johndon@company.com' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mi Perfil</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-center gap-6 max-w-2xl">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
          {user.name.charAt(0)}{user.surname.charAt(0)}
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Nombre Completo</label>
            <h2 className="text-xl font-semibold text-slate-800">{user.name} {user.surname}</h2>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilDashboard;