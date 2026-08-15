import React, { useState } from 'react';
import { ClientAccount, WorkOrder, Invoice, TechnicalReport } from '../../types';
import { formatCOP, formatDate } from '../../utils/formatters';
import { BrandLogo } from '../BrandLogo';
import {
  Building,
  ShieldCheck,
  Clock,
  Wrench,
  AlertTriangle,
  CreditCard,
  BookOpen,
  FileCheck,
  Plus,
  CheckCircle2,
  Phone,
  QrCode,
  Sparkles,
  DollarSign,
  Droplets,
  Calendar,
  Layers,
  Eye,
  Printer,
  Gauge,
  Landmark,
  Smartphone,
  ExternalLink,
  Download,
  FileText,
} from 'lucide-react';

interface ClientPortalProps {
  client: ClientAccount;
  orders: WorkOrder[];
  invoices: Invoice[];
  onRequestNewOrder: (newOrder: Partial<WorkOrder>) => void;
  onPayInvoice: (invoiceId: string, method: string) => void;
  onOpenCopilot: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  client,
  orders,
  invoices,
  onRequestNewOrder,
  onPayInvoice,
  onOpenCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'request' | 'payments' | 'knowledge'>('status');
  const [showPaymentModal, setShowPaymentModal] = useState<Invoice | null>(null);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'PSE' | 'NEQUI' | 'DAVIPLATA' | 'CARD'>('PSE');
  const [pseBank, setPseBank] = useState('Bancolombia');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Inspection modals state for client
  const [selectedReportToView, setSelectedReportToView] = useState<{ report: TechnicalReport; order: WorkOrder } | null>(null);
  const [selectedInvoiceToView, setSelectedInvoiceToView] = useState<Invoice | null>(null);

  // New Service Request form state
  const [reqEquipmentType, setReqEquipmentType] = useState('Sistema Hidroneumático de Presión Constante');
  const [reqPriority, setReqPriority] = useState<'NORMAL' | 'ALTA' | 'EMERGENCIA'>('NORMAL');
  const [reqDescription, setReqDescription] = useState('');
  const [reqContactName, setReqContactName] = useState(client.adminName);
  const [reqContactPhone, setReqContactPhone] = useState(client.phone);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Filter orders and invoices for this client (by id or by name match)
  const clientOrders = orders.filter(
    (o) => o.clientId === client.id || o.clientName.toLowerCase().includes(client.companyName.toLowerCase().slice(0, 8))
  );

  const clientInvoices = invoices.filter(
    (inv) => inv.clientId === client.id || inv.clientName.toLowerCase().includes(client.companyName.toLowerCase().slice(0, 8))
  );

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDescription) return;

    onRequestNewOrder({
      clientId: client.id,
      clientName: client.companyName,
      clientAddress: client.address,
      neighborhood: client.neighborhood,
      clientPhone: reqContactPhone,
      clientContact: reqContactName,
      equipmentType: reqEquipmentType,
      brand: 'Barnes / Pedrollo',
      model: 'Instalación Central',
      reportedIssue: reqDescription,
      priority: reqPriority,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:00 AM',
    });

    setRequestSubmitted(true);
    setReqDescription('');
    setTimeout(() => {
      setRequestSubmitted(false);
      setActiveTab('status');
    }, 2500);
  };

  const handleProcessPayment = () => {
    if (!showPaymentModal) return;
    onPayInvoice(showPaymentModal.id, selectedPaymentGateway);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Client Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <BrandLogo isWatermark className="absolute right-0 top-0 opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold">
              <Building className="w-3.5 h-3.5" />
              Portal de Autoservicio para Copropiedades
            </div>
            <h1 className="text-2xl font-black">{client.companyName}</h1>
            <p className="text-xs text-slate-300">
              NIT: {client.nit} • {client.address} ({client.neighborhood}) • Admin: <strong>{client.adminName}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setActiveTab('request')}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Solicitar Servicio / Urgencia
            </button>

            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              Consultar Copiloto IA
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'status' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Estado del Sistema & Reportes ({clientOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'payments' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Facturación & Pagos en Línea ({clientInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'request' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nueva Solicitud de Servicio
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'knowledge' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Normativa RETIE & Guías
          </button>
        </div>
      </div>

      {/* TAB 1: System Status & Live Order Tracking with Approved Reports */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Hydraulic Health Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {client.equipments.map((eq) => (
              <div
                key={eq.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {eq.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eq.riskLevel === 'CRÍTICO'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : eq.riskLevel === 'MODERADO'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}
                  >
                    Salud: {100 - eq.riskScore}%
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Marca: <strong>{eq.brand} {eq.model}</strong> ({eq.hp} HP)</div>
                  <div>Ubicación: {eq.locationInBuilding}</div>
                  <div className="text-sky-600 dark:text-sky-400 font-medium">
                    Próx. Mantenimiento: {formatDate(eq.nextMaintenanceDate)}
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      eq.riskScore > 60 ? 'bg-rose-500' : eq.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${100 - eq.riskScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Active Work Orders Timeline with FULL REPORT VIEW */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              Historial de Servicios & Fichas Técnicas Recibidas
            </h2>

            {clientOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay órdenes registradas.</p>
            ) : (
              <div className="space-y-4">
                {clientOrders.map((order) => {
                  const hasReport = !!order.technicalReport;
                  const isApproved = order.technicalReport?.approvalStatus === 'APROBADO_ENVIADO';

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                            {order.orderNumber}
                          </span>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {order.equipmentType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Reporte Técnico Aprobado
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              order.status === 'FINALIZADA' || order.status === 'FACTURADA'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : order.status === 'EN_EJECUCION' || order.status === 'EN_RUTA'
                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 animate-pulse'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Novedad Reportada:</strong> {order.reportedIssue}
                      </p>

                      {/* Technical Report Preview & Action Button for Client */}
                      {hasReport && order.technicalReport && (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4 text-sky-600" />
                              Ficha Técnica Registrada por {order.technicalReport.technicianName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Lecturas: Descarga {order.technicalReport.dischargePressurePsi} PSI • Amperaje R: {order.technicalReport.ampPhaseR}A • Materiales: {order.technicalReport.materialsUsed.length} repuestos
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedReportToView({ report: order.technicalReport!, order })}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Ficha Técnica Completa
                          </button>
                        </div>
                      )}

                      {/* Progress step bar */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Técnico a cargo: <strong>{order.assignedTechnicianName || 'Por asignar'}</strong></span>
                        <span>Programado: {order.scheduledDate} ({order.scheduledTime})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT INVOICES AND COMPLETE PAYMENT VIEW */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Facturación Electrónica DIAN & Pasarela de Pagos
              </h2>
              <p className="text-xs text-slate-500">
                Consulta tus facturas electrónicas oficiales generadas a partir de los reportes técnicos y paga en línea con PSE o Nequi.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {clientInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No hay facturas registradas para esta copropiedad.</p>
            ) : (
              clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm hover:shadow-md transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sky-600 dark:text-sky-400 text-sm">
                        {inv.invoiceNumber}
                      </span>
                      {inv.orderNumber && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {inv.orderNumber}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          inv.paymentStatus === 'PAGADO'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-300'
                        }`}
                      >
                        {inv.paymentStatus === 'PAGADO' ? 'PAGADA & CONCILIADA' : 'PENDIENTE DE PAGO'}
                      </span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-300 font-medium">
                      {inv.items[0]?.description} {inv.items.length > 1 && `(+${inv.items.length - 1} conceptos adicionales)`}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Emisión: <strong>{inv.issueDate}</strong></span>
                      <span>Vencimiento: <strong>{inv.dueDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Liquidado:</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {formatCOP(inv.totalCOP)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        IVA 19% incl. ({formatCOP(inv.iva19COP)})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* View Full Invoice Button */}
                      <button
                        onClick={() => setSelectedInvoiceToView(inv)}
                        className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-sky-500" />
                        Ver Factura DIAN
                      </button>

                      {/* Pay button */}
                      {inv.paymentStatus === 'PENDIENTE' ? (
                        <button
                          onClick={() => setShowPaymentModal(inv)}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md shadow-emerald-600/30 transition-transform active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                          <DollarSign className="w-4 h-4" />
                          Pagar Factura
                        </button>
                      ) : (
                        <div className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-4 h-4" /> Pagada ({inv.paidDate})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: New Service Request */}
      {activeTab === 'request' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-sky-600" />
              Solicitud de Asistencia Técnica o Mantenimiento
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Despacho directo al equipo de ingenieros de guardia de ALE. TECNINSTALER S.A.S.
            </p>
          </div>

          {requestSubmitted && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>¡Solicitud enviada exitosamente! Se ha creado una Orden de Trabajo con prioridad seleccionada.</span>
            </div>
          )}

          <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sistema / Equipo que Presenta Novedad:
                </label>
                <select
                  value={reqEquipmentType}
                  onChange={(e) => setReqEquipmentType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Sistema Hidroneumático de Presión Constante">Sistema Hidroneumático de Presión Constante</option>
                  <option value="Bomba Sumergible de Pozo / Aguas Negras">Bomba Sumergible de Pozo / Aguas Negras</option>
                  <option value="Red Contra Incendio (RCI) / Gabinetes">Red Contra Incendio (RCI) / Gabinetes</option>
                  <option value="Lavado y Desinfección de Tanques Potables">Lavado y Desinfección de Tanques Potables</option>
                  <option value="Tablero Eléctrico / Variador de Frecuencia">Tablero Eléctrico / Variador de Frecuencia</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nivel de Urgencia:
                </label>
                <select
                  value={reqPriority}
                  onChange={(e) => setReqPriority(e.target.value as any)}
                  className={`w-full px-3 py-2.5 rounded-xl border font-bold ${
                    reqPriority === 'EMERGENCIA'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="NORMAL">Normal (Programar según ruta)</option>
                  <option value="ALTA">Alta (Atención hoy)</option>
                  <option value="EMERGENCIA">🚨 Emergencia (Corte de agua / Inundación)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descripción de la Falla o Ruidos Anómalos:
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describa el síntoma: ej. La bomba 2 no arranca y el tablero emite pitido continuo, o baja presión en pisos altos..."
                value={reqDescription}
                onChange={(e) => setReqDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de Quien Reporta (Admin / Conserje):
                </label>
                <input
                  type="text"
                  value={reqContactName}
                  onChange={(e) => setReqContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono de Contacto en Sitio:
                </label>
                <input
                  type="text"
                  value={reqContactPhone}
                  onChange={(e) => setReqContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl shadow-lg shadow-sky-600/30 transition-transform active:scale-98"
            >
              Enviar Solicitud al Centro de Despacho
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: RETIE & Regulations */}
      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              Decreto 1575 de 2007 (Agua Potable)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Obligación legal para administradores de propiedad horizontal en Colombia de realizar el <strong>lavado y desinfección semestral (cada 6 meses)</strong> de tanques de reserva de agua potable con laboratorio acreditado IDEAM.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Reglamento NSR-10 (Red Contra Incendio)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Exige inspección mensual y prueba hidrostática de bombas de RCI con encendido automático de bomba jockey y diesel según parámetros NFPA 20 y NFPA 25.
            </p>
          </div>
        </div>
      )}

      {/* CLIENT FULL REPORT INSPECTION MODAL */}
      {selectedReportToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Copia Oficial de Ficha Técnica & Servicio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Orden: <strong>{selectedReportToView.order.orderNumber}</strong> • Realizado el {selectedReportToView.report.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReportToView(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Equipment & Electric Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px]">Equipo Intervenido:</span>
                <p className="font-bold text-sky-600 dark:text-sky-400">{selectedReportToView.report.equipmentType}</p>
                <p className="text-slate-500">Marca: {selectedReportToView.report.brand} • Potencia: {selectedReportToView.report.hpPower} HP</p>
                <p className="text-slate-500">Voltaje: {selectedReportToView.report.voltagePhase}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px]">Lecturas Técnicas:</span>
                <p className="text-slate-600 dark:text-slate-300">Presión Descarga: <strong>{selectedReportToView.report.dischargePressurePsi} PSI</strong></p>
                <p className="text-slate-600 dark:text-slate-300">Amperaje R/S/T: <strong>{selectedReportToView.report.ampPhaseR}A / {selectedReportToView.report.ampPhaseS}A / {selectedReportToView.report.ampPhaseT}A</strong></p>
                <p className="text-slate-600 dark:text-slate-300">Vibración: <strong>{selectedReportToView.report.vibrationMmS} mm/s</strong></p>
              </div>
            </div>

            {/* Diagnostics & Work Performed */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Trabajo Efectuado:</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedReportToView.report.workPerformed}</p>
              </div>

              <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl space-y-1 border border-sky-100 dark:border-sky-900">
                <span className="font-bold text-sky-900 dark:text-sky-200">Recomendaciones Técnicas:</span>
                <p className="text-sky-700 dark:text-sky-300">{selectedReportToView.report.recommendations}</p>
              </div>
            </div>

            {/* Materials Used Table */}
            {selectedReportToView.report.materialsUsed.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Materiales e Insumos Instalados:</span>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold text-[10px]">
                      <tr>
                        <th className="p-2">Código</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2 text-center">Cant.</th>
                        <th className="p-2 text-right">Total COP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedReportToView.report.materialsUsed.map((m) => (
                        <tr key={m.id}>
                          <td className="p-2 font-mono text-[11px]">{m.code}</td>
                          <td className="p-2">{m.name}</td>
                          <td className="p-2 text-center">{m.quantity} {m.unit}</td>
                          <td className="p-2 text-right font-bold">{formatCOP(m.totalCOP)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400">Técnico Certificado:</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedReportToView.report.technicianName}</p>
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matrícula Verificada
                </p>
              </div>

              <div>
                <span className="text-slate-400">Recibido a Conformidad:</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedReportToView.report.clientNameSigner}</p>
                <p className="text-[11px] text-slate-500">{selectedReportToView.report.clientRoleSigner}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Copia
              </button>

              <button
                type="button"
                onClick={() => setSelectedReportToView(null)}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT FULL INVOICE VIEW MODAL */}
      {selectedInvoiceToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <BrandLogo size="md" />
              <div className="text-right space-y-1">
                <div className="font-mono text-xl font-black text-sky-600 dark:text-sky-400">
                  {selectedInvoiceToView.invoiceNumber}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Factura Electrónica de Venta</div>
                <div className="text-[11px] text-slate-400">Emisión: {selectedInvoiceToView.issueDate}</div>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Conceptos y Repuestos Facturados:</span>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">Vlr. Unitario</th>
                      <th className="p-3 text-right">Total COP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedInvoiceToView.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-medium">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCOP(item.unitPriceCOP)}</td>
                        <td className="p-3 text-right font-bold">{formatCOP(item.totalCOP)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total and CUFE */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-1 text-slate-400 text-[10px] font-mono break-all flex-1">
                <strong>CUFE DIAN:</strong> {selectedInvoiceToView.dianCufe}
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCOP(selectedInvoiceToView.subtotalCOP)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>IVA (19%):</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCOP(selectedInvoiceToView.iva19COP)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Liquidado:</span>
                  <span className="text-emerald-600">{formatCOP(selectedInvoiceToView.totalCOP)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Factura
              </button>

              <div className="flex items-center gap-2">
                {selectedInvoiceToView.paymentStatus === 'PENDIENTE' && (
                  <button
                    onClick={() => {
                      setSelectedInvoiceToView(null);
                      setShowPaymentModal(selectedInvoiceToView);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Proceder al Pago
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedInvoiceToView(null)}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Pasarela de Pago Segura
              </h3>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  ¡Pago Aprobado Exitosamente!
                </h4>
                <p className="text-xs text-slate-500">
                  Transacción CUS-{Math.floor(100000 + Math.random() * 900000)} • Factura {showPaymentModal.invoiceNumber}
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <div className="text-slate-500">Total a Pagar:</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCOP(showPaymentModal.totalCOP)}
                  </div>
                  <div className="text-[10px] text-slate-400">Factura {showPaymentModal.invoiceNumber}</div>
                </div>

                {/* Gateway Selector */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Seleccione Medio de Pago:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'PSE', name: 'PSE (Bancos)' },
                      { id: 'NEQUI', name: 'Nequi QR' },
                      { id: 'DAVIPLATA', name: 'Daviplata' },
                      { id: 'CARD', name: 'Tarjeta Crédito' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedPaymentGateway(g.id as any)}
                        className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                          selectedPaymentGateway === g.id
                            ? 'bg-sky-50 dark:bg-sky-950 border-sky-500 text-sky-700 dark:text-sky-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPaymentGateway === 'PSE' && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Banco Emisor en Colombia:
                    </label>
                    <select
                      value={pseBank}
                      onChange={(e) => setPseBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                      <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                      <option value="Banco Itaú">Banco Itaú</option>
                    </select>
                  </div>
                )}

                {selectedPaymentGateway === 'NEQUI' && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-center space-y-2">
                    <div className="text-purple-800 dark:text-purple-300 font-bold">Escanea el código QR desde tu App Nequi:</div>
                    <div className="w-24 h-24 bg-white p-2 mx-auto rounded-lg border border-purple-300 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-purple-900" />
                    </div>
                    <p className="text-[10px] text-purple-600">Número de comercio: 300 447 8151</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-600/30 transition-transform active:scale-98"
                >
                  Confirmar y Pagar {formatCOP(showPaymentModal.totalCOP)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
