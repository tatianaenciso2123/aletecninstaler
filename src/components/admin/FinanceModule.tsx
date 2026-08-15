import React, { useState } from 'react';
import { Invoice, CashTransaction, WorkOrder } from '../../types';
import { formatCOP, formatDate, formatDateTime } from '../../utils/formatters';
import { BrandLogo } from '../BrandLogo';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Building,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Printer,
  PieChart as PieChartIcon,
  Receipt,
  Download,
  Landmark,
} from 'lucide-react';

interface FinanceModuleProps {
  invoices: Invoice[];
  cashTransactions: CashTransaction[];
  orders: WorkOrder[];
  onAddCashTransaction: (transaction: CashTransaction) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: 'PAGADO' | 'PENDIENTE', method?: any) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  invoices,
  cashTransactions,
  orders,
  onAddCashTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cash_book' | 'profitability'>('overview');
  const [showNewCashModal, setShowNewCashModal] = useState(false);

  // New Cash Transaction form state
  const [newCashAmount, setNewCashAmount] = useState('');
  const [newCashClient, setNewCashClient] = useState('');
  const [newCashConcept, setNewCashConcept] = useState('');
  const [newCashTech, setNewCashTech] = useState('Ing. Carlos Andrés Restrepo');

  // Calculations
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.totalCOP, 0);
  const totalCollected = invoices
    .filter((inv) => inv.paymentStatus === 'PAGADO')
    .reduce((acc, curr) => acc + curr.totalCOP, 0);
  const totalPending = invoices
    .filter((inv) => inv.paymentStatus === 'PENDIENTE')
    .reduce((acc, curr) => acc + curr.totalCOP, 0);
  const totalIvaRecaudado = invoices
    .filter((inv) => inv.paymentStatus === 'PAGADO')
    .reduce((acc, curr) => acc + curr.iva19COP, 0);

  const totalCashInBox = cashTransactions
    .filter((c) => c.status === 'ARQUEADO_EN_CAJA')
    .reduce((acc, curr) => acc + curr.amountCOP, 0);

  const pendingCashReconciliation = cashTransactions
    .filter((c) => c.status === 'PENDIENTE_ARQUEO')
    .reduce((acc, curr) => acc + curr.amountCOP, 0);

  const totalDepositedBank = cashTransactions
    .filter((c) => c.status === 'DEPOSITADO_BANCO')
    .reduce((acc, curr) => acc + curr.amountCOP, 0);

  const estimatedOperatingCosts = orders.length * 380000;
  const estimatedGrossProfit = totalCollected - estimatedOperatingCosts;
  const grossMarginPercent = totalCollected > 0 ? ((estimatedGrossProfit / totalCollected) * 100).toFixed(1) : '0';

  const handleCreateCashReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashAmount || !newCashClient) return;

    const receipt: CashTransaction = {
      id: `cash-${Date.now()}`,
      receiptNumber: `RC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      orderNumber: 'OT-2026-COBRO',
      clientName: newCashClient,
      amountCOP: parseFloat(newCashAmount),
      receivedByTechnician: newCashTech,
      concept: newCashConcept || 'Pago en efectivo de servicio hidráulico',
      status: 'PENDIENTE_ARQUEO',
    };

    onAddCashTransaction(receipt);
    setShowNewCashModal(false);
    setNewCashAmount('');
    setNewCashClient('');
    setNewCashConcept('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <DollarSign className="w-4 h-4" />
            Módulo Financiero & Control de Tesorería
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Gestión Financiera, Caja Menor & Rentabilidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Control de liquidez, arqueo de recaudos en efectivo recogidos en campo y estados financieros del negocio hidráulico.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab('cash_book')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'cash_book'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Libro de Caja Menor ({cashTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('profitability')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'profitability'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rentabilidad & P&G
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recaudo Efectivo Cobrado</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCOP(totalCollected)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ingresos liquidados a la fecha</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cuentas por Cobrar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatCOP(totalPending)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            {invoices.filter((i) => i.paymentStatus === 'PENDIENTE').length} facturas emitidas por cobrar
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Efectivo en Caja Menor</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCOP(totalCashInBox)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            + {formatCOP(pendingCashReconciliation)} en tránsito por arquear
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Margen Bruto Operativo</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <PieChartIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {grossMarginPercent}%
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Utilidad est: {formatCOP(estimatedGrossProfit)}
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Treasury Breakdown */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-sky-500" />
              Estructura de Cuentas & Canales de Recaudo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>PSE / Bancolombia Corriente</span>
                  <span className="text-emerald-600 font-black">72.4%</span>
                </div>
                <p className="text-slate-500">Recaudo automático por pasarela electrónica y transferencias directas de copropiedades.</p>
                <div className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  {formatCOP(totalCollected * 0.724)}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Efectivo en Campo & Caja Menor</span>
                  <span className="text-sky-600 font-black">18.6%</span>
                </div>
                <p className="text-slate-500">Cobros directos en sitio por cuadrillas motorizadas respaldados con recibo de caja numerado.</p>
                <div className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  {formatCOP(totalCashInBox + totalDepositedBank)}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Nequi / Daviplata QR</span>
                  <span className="text-purple-600 font-black">9.0%</span>
                </div>
                <p className="text-slate-500">Pagos móviles inmediatos en sitio validados al instante.</p>
                <div className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  {formatCOP(totalCollected * 0.09)}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>IVA 19% Generado (DIAN)</span>
                  <span className="text-slate-500 font-black">Pasivo Fiscal</span>
                </div>
                <p className="text-slate-500">Impuesto sobre las ventas a declarar y pagar en el bimestre correspondiente.</p>
                <div className="text-sm font-bold text-rose-600 pt-1 border-t border-slate-200 dark:border-slate-700">
                  {formatCOP(totalIvaRecaudado)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Cash Audit Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Arqueo Rápido de Caja</h2>
              <button
                onClick={() => setShowNewCashModal(true)}
                className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {cashTransactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate">{tx.clientName}</span>
                    <span className="font-black text-emerald-600">{formatCOP(tx.amountCOP)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{tx.receiptNumber}</span>
                    <span>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('cash_book')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
            >
              Ver Libro de Caja Completo
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CASH BOOK */}
      {activeTab === 'cash_book' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Libro Auxiliar de Caja Menor & Recaudos en Efectivo
              </h2>
              <p className="text-xs text-slate-500">
                Auditoría obligatoria de todos los recibos de caja emitidos por técnicos en campo.
              </p>
            </div>

            <button
              onClick={() => setShowNewCashModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/30"
            >
              <Plus className="w-4 h-4" />
              Nuevo Recibo de Caja
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Recibo No.</th>
                  <th className="p-3">Fecha & Hora</th>
                  <th className="p-3">Copropiedad / Cliente</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Técnico Receptor</th>
                  <th className="p-3 text-right">Valor COP</th>
                  <th className="p-3 text-center">Estado de Arqueo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {cashTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">{tx.receiptNumber}</td>
                    <td className="p-3 text-slate-500">{tx.date}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{tx.clientName}</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{tx.concept}</td>
                    <td className="p-3">{tx.receivedByTechnician}</td>
                    <td className="p-3 text-right font-black text-slate-900 dark:text-white">{formatCOP(tx.amountCOP)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'ARQUEADO_EN_CAJA'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : tx.status === 'DEPOSITADO_BANCO'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROFITABILITY */}
      {activeTab === 'profitability' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Estado de Resultados Operativo & Análisis de Rentabilidad
            </h2>
            <p className="text-xs text-slate-500">Estimación consolidada de ingresos, costos directos de mano de obra y margen neto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Ingresos Operacionales (Ventas)</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">{formatCOP(totalBilled)}</div>
              <p className="text-[11px] text-slate-500">Facturación de contratos fijos y servicios de emergencia.</p>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-2">
              <span className="font-bold text-rose-800 dark:text-rose-300">Costos Directos de Cuadrillas & Repuestos</span>
              <div className="text-xl font-black text-rose-700 dark:text-rose-400">-{formatCOP(estimatedOperatingCosts)}</div>
              <p className="text-[11px] text-slate-500">Combustible, insumos, amortización de herramientas y horas operario.</p>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900/60 space-y-2">
              <span className="font-bold text-sky-800 dark:text-sky-300">Margen de Contribución Neto</span>
              <div className="text-xl font-black text-sky-700 dark:text-sky-400">{formatCOP(estimatedGrossProfit)}</div>
              <p className="text-[11px] text-slate-500">Rentabilidad neta del {grossMarginPercent}% sobre recaudo total.</p>
            </div>
          </div>
        </div>
      )}

      {/* NEW CASH RECEIPT MODAL */}
      {showNewCashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Registrar Recibo de Caja Menor (Efectivo)
              </h3>
              <button onClick={() => setShowNewCashModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCashReceipt} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Copropiedad o Cliente:
                </label>
                <input
                  type="text"
                  required
                  value={newCashClient}
                  onChange={(e) => setNewCashClient(e.target.value)}
                  placeholder="Ej: Conjunto Residencial Santa Ana"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monto Recaudado en Efectivo (COP):
                </label>
                <input
                  type="number"
                  required
                  value={newCashAmount}
                  onChange={(e) => setNewCashAmount(e.target.value)}
                  placeholder="Ej: 450000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Técnico que Recibe el Dinero:
                </label>
                <select
                  value={newCashTech}
                  onChange={(e) => setNewCashTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Ing. Carlos Andrés Restrepo">Ing. Carlos Andrés Restrepo</option>
                  <option value="Tec. Mauricio Galvis Pardo">Tec. Mauricio Galvis Pardo</option>
                  <option value="Tec. Jhon Fredy Benítez">Tec. Jhon Fredy Benítez</option>
                  <option value="Ing. David Fernando Lozano">Ing. David Fernando Lozano</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Concepto de Recaudo:
                </label>
                <input
                  type="text"
                  required
                  value={newCashConcept}
                  onChange={(e) => setNewCashConcept(e.target.value)}
                  placeholder="Ej: Pago de mantenimiento preventivo y repuestos"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCashModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Generar Recibo de Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
