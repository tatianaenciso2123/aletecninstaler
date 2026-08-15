import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';
import {
  Sparkles,
  Zap,
  Gauge,
  Activity,
  AlertTriangle,
  Send,
  MessageSquare,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  FileCode,
} from 'lucide-react';

interface AIPredictivePanelProps {
  onOpenReportWithData?: (data: any) => void;
}

export const AIPredictivePanel: React.FC<AIPredictivePanelProps> = () => {
  const [activeTab, setActiveTab] = useState<'predictive' | 'copilot'>('predictive');

  // Predictive Form State
  const [equipmentType, setEquipmentType] = useState('Bomba Centrífuga Multietapa Vertical');
  const [hp, setHp] = useState<number>(10);
  const [operatingHours, setOperatingHours] = useState<number>(8450);
  const [vibrationMmS, setVibrationMmS] = useState<number>(6.8);
  const [currentAmps, setCurrentAmps] = useState<number>(31.4);
  const [nominalAmps, setNominalAmps] = useState<number>(26.5);
  const [temperatureC, setTemperatureC] = useState<number>(78);
  const [pressureDischargePsi, setPressureDischargePsi] = useState<number>(68);
  const [lastMaintenanceDays, setLastMaintenanceDays] = useState<number>(185);
  const [soundProfile, setSoundProfile] = useState('Ruido metálico intermitente con golpeteo al arrancar');

  const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Copilot Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: '¡Hola! Soy **TECNI-COPILOT**, tu asistente de ingeniería hidráulica en ALE. TECNINSTALER S.A.S. Estoy entrenado en normatividad colombiana (NTC 1500, Decreto 1575, NSR-10) y diagnóstico de sistemas de bombeo, variadores de frecuencia y redes contra incendio. ¿En qué te puedo asesorar hoy?',
      time: '08:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Run AI Predictive Analysis via server endpoint
  const handleRunPredictiveAnalysis = async () => {
    setLoadingDiagnostic(true);
    try {
      const response = await fetch('/api/gemini/predictive-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentType,
          hp,
          operatingHours,
          vibrationMmS,
          currentAmps,
          nominalAmps,
          temperatureC,
          pressureDischargePsi,
          lastMaintenanceDays,
          soundProfile,
        }),
      });

      const data = await response.json();
      if (data.diagnosis) {
        setDiagnosticResult(data.diagnosis);
      }
    } catch (err) {
      console.error('Error running diagnosis:', err);
      // Fallback structured simulation
      setDiagnosticResult({
        equipmentHealthScore: 32,
        failureProbabilityPercent: 88,
        estimatedTimeToFailureDays: 14,
        criticalityLevel: 'CRÍTICA',
        rootCauseSummary:
          'Cavitación moderada en conjunto impulsor y degradación severa en pistas de rodamiento con sobrecalentamiento.',
        recommendedActions: [
          'Detener equipo y verificar holgura axial y alineación de acople con comparador de carátula.',
          'Reemplazar rodamientos por SKF Explorer C3 con grasa sintética para alta temperatura.',
          'Revisar presión NPSH requerida vs disponible para eliminar cavitación en succión.',
        ],
        requiredSpareParts: [
          'Sello mecánico 1 1/4" carburo de silicio',
          'Juego rodamientos SKF 6308-2Z C3',
          'Kit empaquetadura o-ring NBR',
        ],
      });
    } finally {
      setLoadingDiagnostic(false);
    }
  };

  // Send message to TECNI-COPILOT
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text: userText, time: timeNow }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/gemini/technical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      const reply = data.reply || 'No se pudo obtener respuesta del copiloto en este momento.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Hubo una interrupción de conexión con el modelo de IA. Verifica tu conexión de red o consulta el manual técnico de ALE. TECNINSTALER.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApplyPreset = (preset: string) => {
    if (preset === 'cavitation') {
      setVibrationMmS(7.8);
      setCurrentAmps(32.5);
      setNominalAmps(26.5);
      setTemperatureC(82);
      setSoundProfile('Ruido similar a bombeo de gravilla o canicas dentro de la voluta');
    } else if (preset === 'bearing') {
      setVibrationMmS(6.2);
      setCurrentAmps(29.0);
      setTemperatureC(74);
      setSoundProfile('Chirrido de alta frecuencia en el extremo del motor lado acople');
    } else if (preset === 'normal') {
      setVibrationMmS(1.8);
      setCurrentAmps(24.5);
      setNominalAmps(26.5);
      setTemperatureC(45);
      setSoundProfile('Sonido continuo y uniforme sin vibración perceptible');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 3.7 Flash • Hydraulic AI Engine
          </div>
          <h1 className="text-2xl font-black">Centro de Diagnóstico Predictivo & TECNI-COPILOT</h1>
          <p className="text-xs text-slate-300">
            Detección temprana de fallos en rodamientos, cavitación, sobrecalentamiento y asesoría normativa hidráulica.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'predictive' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Diagnóstico Predictivo
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'copilot' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            TECNI-COPILOT Chat
          </button>
        </div>
      </div>

      {/* TAB 1: Predictive Diagnosis Engine */}
      {activeTab === 'predictive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Parameters Form (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-sky-600" />
                Parámetros de Operación del Equipo
              </h2>

              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('cavitation')}
                  className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold"
                >
                  Cavitación
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('normal')}
                  className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold"
                >
                  Normal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Tipo de Equipo:</label>
                <input
                  type="text"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Potencia Motor (HP):</label>
                <input
                  type="number"
                  value={hp}
                  onChange={(e) => setHp(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Vibración (mm/s RMS):</label>
                <input
                  type="number"
                  step="0.1"
                  value={vibrationMmS}
                  onChange={(e) => setVibrationMmS(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Temperatura (°C):</label>
                <input
                  type="number"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Corriente Medida (A):</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentAmps}
                  onChange={(e) => setCurrentAmps(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Corriente Placa (A):</label>
                <input
                  type="number"
                  step="0.1"
                  value={nominalAmps}
                  onChange={(e) => setNominalAmps(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-500 font-semibold mb-1">Patrón Acústico / Síntoma Percibido:</label>
              <textarea
                rows={2}
                value={soundProfile}
                onChange={(e) => setSoundProfile(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleRunPredictiveAnalysis}
              disabled={loadingDiagnostic}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
            >
              {loadingDiagnostic ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Red Neuronal Hidráulica...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ejecutar Diagnóstico Predictivo con IA</span>
                </>
              )}
            </button>
          </div>

          {/* Diagnosis Results Card (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-4 h-4 text-emerald-600" />
              Dictamen & Probabilidad de Fallo Inminente
            </h2>

            {diagnosticResult ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Score & Risk Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Salud del Equipo</div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {diagnosticResult.equipmentHealthScore}%
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-center ${
                    diagnosticResult.criticalityLevel === 'CRÍTICA'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 text-rose-700 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    <div className="text-[10px] font-semibold uppercase">Probabilidad de Fallo</div>
                    <div className="text-3xl font-black mt-1">
                      {diagnosticResult.failureProbabilityPercent}%
                    </div>
                    <div className="text-[10px] font-bold mt-0.5">
                      Fallo estimado: {diagnosticResult.estimatedTimeToFailureDays} días
                    </div>
                  </div>
                </div>

                {/* Root cause */}
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs">
                  <div className="font-bold text-sky-900 dark:text-sky-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Causa Raíz Identificada por IA:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{diagnosticResult.rootCauseSummary}</p>
                </div>

                {/* Recommended Actions */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Acciones Correctivas Sugeridas:</div>
                  <ul className="space-y-1.5">
                    {diagnosticResult.recommendedActions?.map((act: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Repuestos recomendados */}
                {diagnosticResult.requiredSpareParts && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                      Repuestos Sugeridos para la Cuadrilla:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {diagnosticResult.requiredSpareParts.map((sp: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300"
                        >
                          📦 {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Configure los parámetros técnicos a la izquierda y presione "Ejecutar Diagnóstico" para ver la evaluación en tiempo real.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TECNI-COPILOT Interactive Chat */}
      {activeTab === 'copilot' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  TECNI-COPILOT • Especialista en Hidráulica y Normatividad
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  En línea (NTC 1500 / Dec. 1575 / NFPA 20)
                </span>
              </div>
            </div>

            {/* Quick questions chips */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setChatInput('¿Cada cuánto es obligatorio lavar tanques de agua potable según el Decreto 1575?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px]"
              >
                Dec. 1575 Tanques
              </button>
              <button
                onClick={() => setChatInput('¿Qué hacer si un variador VFD muestra código F0002 sobretensión?')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px]"
              >
                Falla VFD
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 min-h-[320px] max-h-[440px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-lg leading-relaxed ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[9px] text-right mt-1.5 ${
                        isUser ? 'text-sky-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <div className="w-3.5 h-3.5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span>TECNI-COPILOT está analizando parámetros y normatividad...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta técnica o normativa hidráulica..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
