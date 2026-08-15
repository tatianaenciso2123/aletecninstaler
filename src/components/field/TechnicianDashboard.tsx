import React, { useState } from 'react';
import { WorkOrder, Technician } from '../../types';
import { formatCOP } from '../../utils/formatters';
import {
  Wrench,
  Navigation,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileEdit,
  MapPin,
  Compass,
  Zap,
  Gauge,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface TechnicianDashboardProps {
  orders: WorkOrder[];
  technicians: Technician[];
  currentTechId?: string;
  onSelectOrderForReport: (order: WorkOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onOpenHydraulicTools: () => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  orders,
  technicians,
  currentTechId = 'tech-1',
  onSelectOrderForReport,
  onUpdateOrderStatus,
  onOpenHydraulicTools,
}) => {
  const currentTech = technicians.find((t) => t.id === currentTechId) || technicians[0];
  const techOrders = orders.filter((o) => o.assignedTechnicianId === currentTech.id);

  const [simulatedGpsActive, setSimulatedGpsActive] = useState(false);
  const [navigatingOrderId, setNavigatingOrderId] = useState<string | null>(null);

  const handleStartNavigation = (orderId: string) => {
    setNavigatingOrderId(orderId);
    setSimulatedGpsActive(true);
    onUpdateOrderStatus(orderId, 'EN_RUTA');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mobile-Friendly Technician Profile Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white font-black text-xl flex items-center justify-center shadow-md">
              {currentTech.fullName.split(' ')[1]?.[0] || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black">{currentTech.fullName}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {currentTech.conteLicense}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Especialidad: <span className="text-sky-300 font-semibold">{currentTech.specialty}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHydraulicTools}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              <Gauge className="w-4 h-4 text-sky-400" />
              Calculadoras Hidráulicas
            </button>
          </div>
        </div>

        {/* Quick GPS Status */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Sector asignado: <strong className="text-slate-200">{currentTech.currentLocationName}</strong></span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            GPS Activo
          </span>
        </div>
      </div>

      {/* Simulated GPS Navigation Banner */}
      {simulatedGpsActive && (
        <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white p-4 rounded-2xl border border-sky-700 shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500 text-white animate-bounce">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Ruta GPS en Progreso (Waze / Maps)</div>
              <div className="text-sm font-bold">En camino hacia Cra 7 # 116-50 (18 min estimados)</div>
            </div>
          </div>
          <button
            onClick={() => setSimulatedGpsActive(false)}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg"
          >
            Llegué al Sitio
          </button>
        </div>
      )}

      {/* Daily Assigned Agenda & OTs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Agenda de Servicios para Hoy ({techOrders.length} OTs)
          </h2>
          <span className="text-xs text-slate-500">Prioridad operacional</span>
        </div>

        {techOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
            No tienes órdenes asignadas pendientes en este momento.
          </div>
        ) : (
          techOrders.map((order) => {
            const isEmergency = order.priority === 'EMERGENCIA';
            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isEmergency
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-slate-900 text-white">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isEmergency ? 'bg-rose-600 text-white animate-pulse' : 'bg-sky-600 text-white'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{order.scheduledTime} hrs</span>
                  </div>
                </div>

                {/* Main Client and Equipment Details */}
                <div className="mt-3 space-y-2">
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {order.clientName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{order.clientAddress} ({order.neighborhood})</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      🔧 {order.equipmentType} ({order.brand} {order.model})
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      <strong>Diagnóstico preliminar / Falla:</strong> {order.reportedIssue}
                    </div>
                  </div>

                  {/* Report Status Banner if already registered */}
                  {order.technicalReport && (
                    <div className={`p-3 rounded-xl text-xs space-y-1 border ${
                      order.technicalReport.approvalStatus === 'APROBADO_ENVIADO'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                        : order.technicalReport.approvalStatus === 'RECHAZADO_CORRECCION'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5">
                        {order.technicalReport.approvalStatus === 'APROBADO_ENVIADO' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Ficha Técnica Aprobada por Administración • Copia y Factura enviadas al cliente
                          </>
                        ) : order.technicalReport.approvalStatus === 'RECHAZADO_CORRECCION' ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            Corrección Solicitada por Administración
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                            Ficha Técnica Guardada • En Validación por Administración
                          </>
                        )}
                      </div>
                      {order.technicalReport.adminNotes && order.technicalReport.approvalStatus === 'RECHAZADO_CORRECCION' && (
                        <p className="text-[11px] font-medium bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg mt-1 text-rose-700 dark:text-rose-300">
                          <strong>Nota del Administrador:</strong> {order.technicalReport.adminNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Field Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.clientPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Llamar Contacto
                    </a>

                    <button
                      onClick={() => handleStartNavigation(order.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600" />
                      Iniciar GPS Waze
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectOrderForReport(order)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/30 transition-transform active:scale-95"
                  >
                    <FileEdit className="w-4 h-4" />
                    Abrir Hoja de Reporte & Firma
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
