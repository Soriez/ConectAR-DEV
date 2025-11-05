import React from "react";
import { useNavigate } from "react-router";

const Freelancer = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Página de Freelancers</h1>
      <button
        onClick={() => navigate("/perfil")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Ir al Perfil
      </button>
    </div>
  );
};

export default Freelancer;
