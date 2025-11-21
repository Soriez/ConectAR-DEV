import React, { useState } from 'react';
import { Outlet } from 'react-router'; 
import { Menu } from 'lucide-react';
import Sidebar from '../components/Dashboard/Sidebar';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      
      {/* Pasamos el estado y la función de cerrar al Sidebar */}
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        
        {/* HEADER MÓVIL: Solo visible en pantallas pequeñas (md:hidden) */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800">Dashboard</span>
          </div>
          {/* Aquí podrías poner el avatar pequeño si quisieras */}
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            JD
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="p-4 md:p-8 overflow-y-auto flex-1">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;