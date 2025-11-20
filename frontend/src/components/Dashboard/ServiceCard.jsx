import { Server } from 'lucide-react';

const ServiceCard = ({ service }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between mb-4">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Server size={24}/></div>
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded h-fit">ACTIVO</span>
    </div>
    <h3 className="font-bold text-lg mb-1">{service.name}</h3>
    <p className="text-slate-500 text-sm mb-4">{service.desc}</p>
    <span className="font-bold text-slate-900 block pt-4 border-t border-slate-100">{service.price}</span>
  </div>
);
export default ServiceCard;