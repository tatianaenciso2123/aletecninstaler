import React, { useState } from 'react';
import { WorkOrder, Invoice, Technician, ClientAccount } from '../../types';
import { formatCOP, formatDate } from '../../utils/formatters';
import { INVENTORY_SPARE_PARTS } from '../../data/mockData';
import {
  TrendingUp,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Clock,
  DollarSign,
  PackageCheck,
  Zap,
  ArrowUpRight,
  Users,
  Building,
  PlusCircle,
  Eye,
  FileText,
  Filter,
} from 'lucide-react';

interface AdminDashboardProps {
  orders: WorkOrder[];
  invoices: Invoice[];
  technicians: Technician[];
  clients: ClientAccount[];
  onOpenNewOrder: () => void;
  onSelectOrder: (order: WorkOrder) => void;
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  invoices,
  technicians,
  clients,
  onOpenNewOrder,
  onSelectOrder,
  onSelectTab,
}) => {
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'EMERGENCIA' | 'EN_EJECUCION' | 'PENDIENTE'>('ALL');

  // Strategic Calculations
  const totalRevenueCOP = invoices
    .filter((inv) => inv.paymentStatus === 'PAGADO')
    .reduce((acc, curr) => acc + curr.totalCOP, 0);

  const pendingRevenueCOP = invoices
    .filter((inv) => inv.paymentStatus === 'PENDIENTE')
    .reduce((acc, curr) => acc + curr.totalCOP, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'EN_EJECUCION' || o.status === 'EN_RUTA' || o.status === 'PENDIENTE'
  ).length;

  const emergencyOrders = orders.filter((o) => o.priority === 'EMERGENCIA' && o.status !== 'FINALIZADA');

  const lowStockParts = INVENTORY_SPARE_PARTS.filter((p) => p.stock <= p.minStock);

  const availableTechs = technicians.filter((t) => t.status === 'DISPONIBLE').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'EMERGENCIA') return o.priority === 'EMERGENCIA';
    if (orderFilter === 'EN_EJECUCION') return o.status === 'EN_EJECUCION';
    if (orderFilter === 'PENDIENTE') return o.status === 'PENDIENTE';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Dashboard Estratégico & Control Hidráulico
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supervisión integral de operaciones de bombeo, finanzas, inventarios y despacho en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('predictive-ai')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl hover:bg-sky-100 transition-colors"
          >
            <Zap className="w-4 h-4 text-sky-600" />
            Diagnóstico IA
          </button>

          <button
            onClick={onOpenNewOrder}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-600/30 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Orden de Trabajo (OT)
          </button>
        </div>
      </div>

      {/* Critical Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ingresos Recaudados (Mes)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCOP(totalRevenueCOP)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs mes anterior</span>
            <span className="text-slate-400 text-[11px]">({formatCOP(pendingRevenueCOP)} por cobrar)</span>
          </div>
        </div>

        {/* Active Work Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Órdenes Activas</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeOrdersCount} Servicios
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span>{orders.filter((o) => o.status === 'EN_EJECUCION').length} en ejecución en sitio</span>
          </div>
        </div>

        {/* Emergencies & Critical Alarms */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-all ${
          emergencyOrders.length > 0
            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Urgencias Hidráulicas</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {emergencyOrders.length} Críticas
          </div>
          <div className="text-xs font-medium text-rose-700 dark:text-rose-300 mt-2">
            {emergencyOrders.length > 0
              ? 'Atención prioritaria en curso'
              : 'Sin fallas catastróficas activas'}
          </div>
        </div>

        {/* Technical Availability & Inventory */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Personal & Repuestos</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span>{availableTechs} / {technicians.length} Disp.</span>
            {lowStockParts.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                {lowStockParts.length} Stock bajo
              </span>
            )}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            {clients.length} Copropiedades con contrato activo
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Management & Intelligence Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Work Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                Control de Órdenes de Trabajo (OT)
              </h2>
              <p className="text-xs text-slate-500">
                Seguimiento operativo desde recepción hasta conformidad y facturación
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setOrderFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  orderFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Todas ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('EMERGENCIA')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  orderFilter === 'EMERGENCIA'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                Emergencias
              </button>
              <button
                onClick={() => setOrderFilter('EN_EJECUCION')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  orderFilter === 'EN_EJECUCION'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                En Ejecución
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isEmergency = order.priority === 'EMERGENCIA';
              return (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    isEmergency
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-sky-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.priority === 'EMERGENCIA'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : order.priority === 'ALTA'
                            ? 'bg-amber-500 text-white'
                            : 'bg-sky-600 text-white'
                        }`}
                      >
                        {order.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {order.clientName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          order.status === 'FINALIZADA'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.status === 'EN_EJECUCION'
                            ? 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {formatCOP(order.totalCostCOP)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    <strong className="text-slate-700 dark:text-slate-200">Equipo:</strong> {order.equipmentType} ({order.brand} {order.model}) — {order.reportedIssue}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>📍 {order.neighborhood} ({order.clientAddress})</span>
                      <span>👨‍🔧 {order.assignedTechnicianName || 'Sin asignar'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-500">
                      <span>Ver Ficha Técnica</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inventory Critical Alerts & Strategic Financial BI (1 Col) */}
        <div className="space-y-6">
          {/* Inventory Critical Stock Alert */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertas Críticas de Inventario
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Reabastecimiento
              </span>
            </div>

            <div className="space-y-2.5">
              {lowStockParts.map((part) => (
                <div
                  key={part.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{part.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Cód: {part.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-600 dark:text-rose-400">
                      {part.stock} disp. (Mín {part.minStock})
                    </div>
                    <div className="text-[10px] text-slate-400">{formatCOP(part.unitPriceCOP)}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab('finance-invoicing')}
              className="w-full py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 rounded-xl hover:bg-sky-100 transition-colors text-center block"
            >
              Generar Orden de Compra a Proveedores
            </button>
          </div>

          {/* Technicians On-Duty Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                Estado del Equipo Técnico
              </h3>
              <button
                onClick={() => onSelectTab('dispatch-map')}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                Ver Mapa GPS
              </button>
            </div>

            <div className="space-y-3">
              {technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {tech.fullName.split(' ')[1]?.[0] || 'T'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{tech.fullName}</div>
                      <div className="text-[10px] text-slate-500">{tech.specialty}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tech.status === 'DISPONIBLE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : tech.status === 'EN_SERVICIO'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {tech.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
