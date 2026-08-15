import React, { useState } from 'react';
import { WorkOrder, TechnicalReport, MaterialItem } from '../../types';
import { formatCOP, formatDate } from '../../utils/formatters';
import { BrandLogo } from '../BrandLogo';
import { SignatureCanvas } from '../common/SignatureCanvas';
import { INVENTORY_SPARE_PARTS } from '../../data/mockData';
import {
  FileText,
  Gauge,
  Zap,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Camera,
  Printer,
  Save,
  ShieldCheck,
  QrCode,
  ArrowLeft,
} from 'lucide-react';

interface DigitalReportSheetProps {
  order: WorkOrder;
  onSaveReport: (orderId: string, report: TechnicalReport) => void;
  onBack: () => void;
}

export const DigitalReportSheet: React.FC<DigitalReportSheetProps> = ({
  order,
  onSaveReport,
  onBack,
}) => {
  const existingReport = order.technicalReport;

  // Form State
  const [equipmentType, setEquipmentType] = useState(existingReport?.equipmentType || order.equipmentType);
  const [brand, setBrand] = useState(existingReport?.brand || order.brand);
  const [model, setModel] = useState(existingReport?.model || order.model);
  const [hpPower, setHpPower] = useState(existingReport?.hpPower || order.hpPower || 10);
  const [serialNumber, setSerialNumber] = useState(existingReport?.serialNumber || 'BAR-2022-9014');
  const [voltagePhase, setVoltagePhase] = useState<'Trifásico 220V' | 'Trifásico 440V' | 'Monofásico 220V' | 'Monofásico 110V'>(
    existingReport?.voltagePhase || 'Trifásico 220V'
  );

  // Technical readings
  const [suctionPressurePsi, setSuctionPressurePsi] = useState<number>(existingReport?.suctionPressurePsi ?? 4);
  const [dischargePressurePsi, setDischargePressurePsi] = useState<number>(existingReport?.dischargePressurePsi ?? 68);
  const [ampPhaseR, setAmpPhaseR] = useState<number>(existingReport?.ampPhaseR ?? 29.8);
  const [ampPhaseS, setAmpPhaseS] = useState<number>(existingReport?.ampPhaseS ?? 30.1);
  const [ampPhaseT, setAmpPhaseT] = useState<number>(existingReport?.ampPhaseT ?? 31.4);
  const [nominalAmperage, setNominalAmperage] = useState<number>(existingReport?.nominalAmperage ?? 26.5);
  const [insulationResistanceMohm, setInsulationResistanceMohm] = useState<number>(existingReport?.insulationResistanceMohm ?? 85);
  const [vibrationMmS, setVibrationMmS] = useState<number>(existingReport?.vibrationMmS ?? 6.8);

  const [stateBefore, setStateBefore] = useState<'CRÍTICO' | 'REGULAR' | 'BUENO'>(
    existingReport?.generalStateBefore || 'CRÍTICO'
  );
  const [stateAfter, setStateAfter] = useState<'ÓPTIMO' | 'BUENO' | 'OBSERVACIÓN'>(
    existingReport?.generalStateAfter || 'ÓPTIMO'
  );

  const [diagnosticDetails, setDiagnosticDetails] = useState(
    existingReport?.diagnosticDetails ||
      'Desgaste severo en pistas de rodamiento y sello mecánico por cavitación leve y sobrecorriente.'
  );
  const [workPerformed, setWorkPerformed] = useState(
    existingReport?.workPerformed ||
      'Desmontaje de cabezal, cambio de rodamientos SKF Explorer C3, instalación de sello mecánico de carburo de silicio, alineación láser y pruebas de presión estática/dinámica.'
  );
  const [recommendations, setRecommendations] = useState(
    existingReport?.recommendations ||
      'Verificar rampa de aceleración en variador de frecuencia (VFD) y realizar chequeo de vibración en 15 días.'
  );

  // Materials Used
  const [materials, setMaterials] = useState<MaterialItem[]>(
    existingReport?.materialsUsed || [
      {
        id: 'm-1',
        name: 'Sello Mecánico 1 1/4" Carburo de Silicio',
        code: 'SM-CARB-125',
        quantity: 1,
        unit: 'UND',
        unitPriceCOP: 280000,
        totalCOP: 280000,
      },
      {
        id: 'm-2',
        name: 'Juego Rodamientos SKF Explorer 6308-2Z C3',
        code: 'ROD-SKF-6308',
        quantity: 2,
        unit: 'JGO',
        unitPriceCOP: 165000,
        totalCOP: 330000,
      }
    ]
  );

  const [selectedInventoryPartId, setSelectedInventoryPartId] = useState(INVENTORY_SPARE_PARTS[0].id);

  // Signatures
  const [clientSignerName, setClientSignerName] = useState(existingReport?.clientNameSigner || order.clientContact);
  const [clientSignerDoc, setClientSignerDoc] = useState(existingReport?.clientDocumentSigner || 'CC 52.890.114');
  const [clientSignerRole, setClientSignerRole] = useState(existingReport?.clientRoleSigner || 'Administradora Titular');
  const [clientSignatureUrl, setClientSignatureUrl] = useState(existingReport?.clientSignatureDataUrl || '');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const handleAddMaterial = () => {
    const part = INVENTORY_SPARE_PARTS.find((p) => p.id === selectedInventoryPartId);
    if (!part) return;

    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: part.name,
      code: part.code,
      quantity: 1,
      unit: 'UND',
      unitPriceCOP: part.unitPriceCOP,
      totalCOP: part.unitPriceCOP,
    };

    setMaterials([...materials, newItem]);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    const report: TechnicalReport = {
      id: existingReport?.id || `rep-${Date.now()}`,
      orderId: order.id,
      date: new Date().toISOString().split('T')[0],
      technicianName: order.assignedTechnicianName || 'Ing. Carlos Andrés Restrepo',
      technicianDocument: 'CC 1.020.485.932 - TE-048591 (CONTE)',
      equipmentType,
      brand,
      model,
      hpPower,
      serialNumber,
      voltagePhase,
      suctionPressurePsi,
      dischargePressurePsi,
      ampPhaseR,
      ampPhaseS,
      ampPhaseT,
      nominalAmperage,
      insulationResistanceMohm,
      vibrationMmS,
      generalStateBefore: stateBefore,
      generalStateAfter: stateAfter,
      materialsUsed: materials,
      diagnosticDetails,
      workPerformed,
      recommendations,
      clientNameSigner: clientSignerName,
      clientDocumentSigner: clientSignerDoc,
      clientRoleSigner: clientSignerRole,
      clientSignatureDataUrl: clientSignatureUrl,
      approvalStatus: 'PENDIENTE_VALIDACION',
      photoEvidenceUrls: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
      ],
    };

    onSaveReport(order.id, report);
    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 5000);
  };

  const totalMaterialsCostCOP = materials.reduce((acc, m) => acc + m.totalCOP, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Hoja de Reporte Digital & Acta de Entrega
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cliente: <strong>{order.clientName}</strong> • {order.clientAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Acta
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            Guardar & Certificar
          </button>
        </div>
      </div>

      {isSavedSuccessfully && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-sm font-black">¡Ficha Técnica Guardada Exitosamente!</div>
            <div className="text-[11px] font-normal opacity-90">
              Se ha emitido una notificación automática al Administrador y se ha pre-generado la factura electrónica DIAN para su auditoría y visto bueno final.
            </div>
          </div>
        </div>
      )}

      {/* Main Printable / Form Card with Corporate Frame */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Corporate Watermark */}
        <BrandLogo isWatermark className="absolute inset-0 m-auto" />

        {/* Corporate Header */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <BrandLogo size="md" showText={true} textVariant="full" theme="dark" />
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <div className="font-bold text-slate-900 dark:text-white">NIT: 901.458.720-3</div>
            <div>PBX: (601) 745-9000 • Sede Bogotá D.C.</div>
            <div className="text-sky-600 font-semibold">Sistema Hydraulic Precision v3.4</div>
          </div>
        </div>

        {/* Section 1: Equipment Identification */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            1. Datos del Equipo Hidráulico Inspeccionado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Tipo de Equipo:</label>
              <input
                type="text"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Marca y Modelo:</label>
              <input
                type="text"
                value={`${brand} ${model}`}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Potencia (HP) y No. Serie:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={hpPower}
                  onChange={(e) => setHpPower(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="HP"
                />
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Serial"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Field Parameters (Pressures, Electrical & Vibration) */}
        <div className="relative z-10 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            2. Mediciones & Parámetros Técnicos en Operación
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-slate-500 font-semibold mb-1">P. Succión (PSI):</label>
              <input
                type="number"
                value={suctionPressurePsi}
                onChange={(e) => setSuctionPressurePsi(parseFloat(e.target.value) || 0)}
                className="w-full text-base font-bold text-slate-900 dark:text-white bg-transparent border-b border-sky-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Mínimo sugerido: &gt; 5 PSI</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-slate-500 font-semibold mb-1">P. Descarga (PSI):</label>
              <input
                type="number"
                value={dischargePressurePsi}
                onChange={(e) => setDischargePressurePsi(parseFloat(e.target.value) || 0)}
                className="w-full text-base font-bold text-sky-600 dark:text-sky-400 bg-transparent border-b border-sky-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Set point: 65-70 PSI</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-slate-500 font-semibold mb-1">Amperaje R-S-T (A):</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={ampPhaseR}
                  onChange={(e) => setAmpPhaseR(parseFloat(e.target.value) || 0)}
                  className="w-1/3 text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-400"
                  placeholder="R"
                />
                <input
                  type="number"
                  step="0.1"
                  value={ampPhaseS}
                  onChange={(e) => setAmpPhaseS(parseFloat(e.target.value) || 0)}
                  className="w-1/3 text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-400"
                  placeholder="S"
                />
                <input
                  type="number"
                  step="0.1"
                  value={ampPhaseT}
                  onChange={(e) => setAmpPhaseT(parseFloat(e.target.value) || 0)}
                  className="w-1/3 text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-400"
                  placeholder="T"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Placa: {nominalAmperage} A</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-slate-500 font-semibold mb-1">Vibración (mm/s RMS):</label>
              <input
                type="number"
                step="0.1"
                value={vibrationMmS}
                onChange={(e) => setVibrationMmS(parseFloat(e.target.value) || 0)}
                className={`w-full text-base font-bold bg-transparent border-b focus:outline-none ${
                  vibrationMmS > 4.5 ? 'text-rose-600 border-rose-500' : 'text-emerald-600 border-emerald-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">ISO 10816: &lt; 2.8 mm/s</span>
            </div>
          </div>
        </div>

        {/* Section 3: Diagnostic & Work Done */}
        <div className="relative z-10 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <h3 className="font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            3. Diagnóstico Técnico & Trabajos Ejecutados
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Diagnóstico de Hallazgos y Causa Raíz:
              </label>
              <textarea
                rows={3}
                value={diagnosticDetails}
                onChange={(e) => setDiagnosticDetails(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detalle de Trabajos Realizados y Pruebas:
              </label>
              <textarea
                rows={3}
                value={workPerformed}
                onChange={(e) => setWorkPerformed(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Materials & Spare Parts Consumed */}
        <div className="relative z-10 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              4. Registro de Repuestos & Materiales Instalados
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={selectedInventoryPartId}
                onChange={(e) => setSelectedInventoryPartId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {INVENTORY_SPARE_PARTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatCOP(p.unitPriceCOP)})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddMaterial}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-2 px-3">Código</th>
                  <th className="py-2 px-3">Descripción</th>
                  <th className="py-2 px-3 text-center">Cant.</th>
                  <th className="py-2 px-3 text-right">V. Unitario</th>
                  <th className="py-2 px-3 text-right">Total COP</th>
                  <th className="py-2 px-3 text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {materials.map((mat) => (
                  <tr key={mat.id}>
                    <td className="py-2 px-3 font-mono text-slate-500">{mat.code}</td>
                    <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{mat.name}</td>
                    <td className="py-2 px-3 text-center">{mat.quantity} {mat.unit}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{formatCOP(mat.unitPriceCOP)}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatCOP(mat.totalCOP)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleRemoveMaterial(mat.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end font-bold text-slate-900 dark:text-white text-xs">
            Subtotal Materiales: <span className="ml-2 text-sky-600 font-black">{formatCOP(totalMaterialsCostCOP)}</span>
          </div>
        </div>

        {/* Section 5: Digital Signature Capture (Client & Technical Chief) */}
        <div className="relative z-10 space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            5. Firma Digital de Conformidad del Cliente (Receptor Autorizado)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Nombre del Firmante:</label>
              <input
                type="text"
                value={clientSignerName}
                onChange={(e) => setClientSignerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Cédula / Documento:</label>
              <input
                type="text"
                value={clientSignerDoc}
                onChange={(e) => setClientSignerDoc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Cargo en la Copropiedad:</label>
              <input
                type="text"
                value={clientSignerRole}
                onChange={(e) => setClientSignerRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Interactive Touch/Mouse Signature Canvas */}
          <SignatureCanvas
            title="Estampe de Firma Digital Táctil del Cliente"
            signerName={clientSignerName}
            initialSignature={clientSignatureUrl}
            onSaveSignature={(dataUrl) => setClientSignatureUrl(dataUrl)}
          />
        </div>

        {/* Official Footer with QR code & Legal validation */}
        <div className="relative z-10 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <div className="space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              ALE. TECNINSTALER S.A.S. • Registro de Mantenimiento Hidráulico Certificado
            </div>
            <div>
              Documento con validez legal según Ley 527 de 1999 sobre firmas y comercio electrónico en Colombia.
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <QrCode className="w-8 h-8 text-slate-800 dark:text-slate-200" />
            <div className="text-[9px] font-mono">
              VERIFICAR ACTA<br />
              COD: TI-2026-OT084
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
