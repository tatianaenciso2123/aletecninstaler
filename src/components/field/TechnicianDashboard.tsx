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
  FileText,
  Building,
  Calendar,
  X,
} from 'lucide-react';

interface TechnicianDashboardProps {
  orders: WorkOrder[];
  technicians: Technician[];
  currentTechId?: string;
  onSelectOrderForReport: (order: WorkOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  orders,
  technicians,
  currentTechId = 'tech-1',
  onSelectOrderForReport,
  onUpdateOrderStatus,
}) => {
  const currentTech = technicians.find((t) => t.id === currentTechId) || technicians[0];
  const techOrders = orders.filter((o) => o.assignedTechnicianId === currentTech.id);

  const [simulatedGpsActive, setSimulatedGpsActive] = useState(false);
  const [navigatingOrderId, setNavigatingOrderId] = useState<string | null>(null);
  const [viewingRequestOrder, setViewingRequestOrder] = useState<WorkOrder | null>(null);

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md">
              {currentTech.fullName.split(' ')[1]?.[0] || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black">{currentTech.fullName}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentTech.conteLicense}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Especialidad: <span className="text-emerald-300 font-semibold">{currentTech.specialty}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              Operador Técnico de Campo
            </span>
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
            <Clock className="w-5 h-5 text-emerald-600" />
            Agenda de Servicios para Hoy ({techOrders.length} OTs Asignadas)
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
                        isEmergency ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
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
                      <strong>Diagnóstico preliminar / Falla reportada por el cliente:</strong> {order.reportedIssue}
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
                      Llamar
                    </a>

                    <button
                      onClick={() => handleStartNavigation(order.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600" />
                      Waze GPS
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Ver Formato Llenado por Cliente */}
                    <button
                      type="button"
                      onClick={() => setViewingRequestOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-500" />
                      Ver Solicitud Cliente
                    </button>

                    {/* Abrir Hoja de Reporte */}
                    <button
                      type="button"
                      onClick={() => onSelectOrderForReport(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
                    >
                      <FileEdit className="w-4 h-4" />
                      Abrir Hoja de Reporte
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Formato Diligenciado por el Cliente */}
      {viewingRequestOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-4 relative my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    FORMATO SOLICITUD DE CLIENTE • OT {viewingRequestOrder.orderNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    Detalles de la Visita a Realizar
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setViewingRequestOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-500" />
                    Datos de la Copropiedad / Cliente
                  </div>
                  <div className="font-black text-slate-900 dark:text-white text-sm">
                    {viewingRequestOrder.clientName}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{viewingRequestOrder.clientAddress} • Barrio {viewingRequestOrder.neighborhood}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Contacto: <strong>{viewingRequestOrder.clientContact}</strong> ({viewingRequestOrder.clientPhone})</span>
                  </div>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-sky-500" />
                    Equipo Hidráulico & Programación
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {viewingRequestOrder.equipmentType} ({viewingRequestOrder.brand} {viewingRequestOrder.model})
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                      Tipo: {viewingRequestOrder.type}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        viewingRequestOrder.priority === 'EMERGENCIA'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      Prioridad: {viewingRequestOrder.priority}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Visita: <strong>{viewingRequestOrder.scheduledDate}</strong> a las <strong>{viewingRequestOrder.scheduledTime} hrs</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Descripción de la Falla / Motivo de la Visita (Llenado por el Cliente):
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                  {viewingRequestOrder.reportedIssue || 'Mantenimiento preventivo e inspección técnica general de presiones.'}
                </div>
                {viewingRequestOrder.notes && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <strong>Notas Adicionales de Administración:</strong> {viewingRequestOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Cerrar & Abrir Hoja de Reporte */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setViewingRequestOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = viewingRequestOrder;
                  setViewingRequestOrder(null);
                  onSelectOrderForReport(target);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-transform"
              >
                <FileEdit className="w-4 h-4" />
                <span>Abrir Hoja de Reporte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
