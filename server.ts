import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ALE. TECNINSTALER S.A.S. Hydraulic Core API' });
});

// AI Predictive Hydraulic Diagnosis Endpoint
app.post('/api/gemini/predictive-diagnosis', async (req, res) => {
  try {
    const {
      equipmentType,
      brand,
      model,
      operatingHours,
      lastMaintenanceMonths,
      suctionPressurePsi,
      dischargePressurePsi,
      motorCurrentAmps,
      nominalCurrentAmps,
      vibrationLevel,
      waterType,
      observedSymptoms,
      previousFailures,
    } = req.body;

    const ai = getGenAI();

    if (!ai) {
      // High-quality local heuristic fallback if API key is not configured
      const currentRatio = nominalCurrentAmps ? motorCurrentAmps / nominalCurrentAmps : 1;
      const pressureDiff = (dischargePressurePsi || 0) - (suctionPressurePsi || 0);
      const isOverloaded = currentRatio > 1.15;
      const highVibration = vibrationLevel === 'critical' || vibrationLevel === 'high';
      const riskScore = Math.min(
        98,
        Math.max(
          18,
          Math.round(
            (operatingHours > 8000 ? 30 : 10) +
            (lastMaintenanceMonths > 6 ? 25 : 5) +
            (isOverloaded ? 25 : 0) +
            (highVibration ? 20 : 5) +
            (observedSymptoms?.length ? observedSymptoms.length * 8 : 0)
          )
        )
      );

      return res.json({
        success: true,
        source: 'local_heuristic_engine',
        riskLevel: riskScore > 75 ? 'CRÍTICO' : riskScore > 45 ? 'MODERADO' : 'NORMAL',
        riskPercentage: riskScore,
        estimatedMTBFDays: Math.max(7, Math.round(180 - (riskScore * 1.6))),
        cavitationRisk: suctionPressurePsi < 5 && pressureDiff > 50 ? 'ALTO' : 'BAJO',
        thermalOverloadRisk: isOverloaded ? 'CRÍTICO' : 'NORMAL',
        imminentFailureProbability: `${riskScore}%`,
        probableRootCauses: [
          isOverloaded ? 'Desbalance de fases o sobrecarga mecánica en rodete/impulsor.' : 'Desgaste progresivo de sellos mecánicos por fricción.',
          highVibration ? 'Desalineación angular de acople motor-bomba o desbalance dinámico.' : 'Sedimentación y calcificación en cuerpo de bomba.',
          suctionPressurePsi < 5 ? 'Vórtice en succión o válvula de pie parcialmente obstruida.' : 'Fatiga en devanados del motor por fluctuaciones de voltaje.'
        ],
        actionProtocol: [
          'Efectuar prueba termográfica en bornes de conexión y carcasa del motor.',
          'Inspeccionar holgura axial y reemplazar sellos mecánicos de carburo de silicio.',
          'Verificar set points de presostato o parámetros de rampa en Variador de Frecuencia (VFD).',
          'Comprobar estado de cheque de retención y amortiguadores de golpe de ariete.'
        ],
        recommendedParts: ['Sello Mecánico 1 1/4" Carburo', 'Juego Rodamientos SKF C3', 'Manómetro Glicerina 0-150 PSI', 'Válvula Check Anti-ariete'],
        executiveSummary: `El equipo ${equipmentType} ${brand || ''} ${model || ''} registra un nivel de riesgo ${riskScore > 75 ? 'CRÍTICO' : 'MODERADO'}. Se evidencia ${highVibration ? 'vibración anómala y ' : ''}${isOverloaded ? 'sobrecorriente del ' + Math.round((currentRatio - 1) * 100) + '% sobre placa' : 'desgaste por horas de servicio'}. Se recomienda intervención preventiva prioritaria.`,
      });
    }

    const prompt = `Actúa como el Ingeniero Jefe Senior de Diagnóstico Hidráulico de "ALE. TECNINSTALER S.A.S.", empresa experta en Colombia en mantenimiento y montaje de sistemas de bombeo, hidroneumáticos, redes contra incendio (RCI) y plantas de tratamiento.
Analiza con rigor técnico los siguientes parámetros del equipo y devuelve un diagnóstico predictivo detallado:

Parámetros del equipo:
- Tipo de equipo: ${equipmentType || 'Bomba centrífuga / Hidroneumático'}
- Marca / Modelo: ${brand || 'No especificada'} ${model || ''}
- Horas de operación acumuladas: ${operatingHours || 4500} hrs
- Meses desde último mantenimiento: ${lastMaintenanceMonths || 4} meses
- Presión de succión: ${suctionPressurePsi ?? 'N/A'} PSI
- Presión de descarga: ${dischargePressurePsi ?? 'N/A'} PSI
- Amperaje medido: ${motorCurrentAmps ?? 'N/A'} A (Nominal en placa: ${nominalCurrentAmps ?? 'N/A'} A)
- Nivel de vibración reportado: ${vibrationLevel || 'moderado'}
- Tipo de fluido / agua: ${waterType || 'Agua potable / Tanque reserva'}
- Síntomas y observaciones: ${Array.isArray(observedSymptoms) ? observedSymptoms.join(', ') : observedSymptoms || 'Ninguno reportado'}
- Fallas previas: ${previousFailures || 'Ninguna reciente'}

Devuelve un JSON estrictamente estructurado con las siguientes propiedades:
{
  "riskLevel": "CRÍTICO" | "MODERADO" | "NORMAL",
  "riskPercentage": número entre 0 y 100,
  "estimatedMTBFDays": número estimado de días antes del próximo fallo probable,
  "cavitationRisk": "ALTO" | "MEDIO" | "BAJO",
  "thermalOverloadRisk": "CRÍTICO" | "MODERADO" | "BAJO",
  "imminentFailureProbability": string con porcentaje (ej: "78%"),
  "probableRootCauses": [string, string, string],
  "actionProtocol": [string, string, string, string],
  "recommendedParts": [string, string, string],
  "executiveSummary": string conciso y técnico dirigido al cliente y al administrador
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      success: true,
      source: 'gemini_3.7_flash',
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error in predictive diagnosis API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing predictive hydraulic diagnosis',
    });
  }
});

// Technical Copilot Chat Assistant for Field Technicians & Customers
app.post('/api/gemini/technical-assistant', async (req, res) => {
  try {
    const { message, contextRole, systemData } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: `[Asistente Técnico ALE. TECNINSTALER]: Hemos recibido tu consulta sobre "${message}". Según las normas hidráulicas colombianas (NTC 1500 / RAS) y buenas prácticas de ALE. TECNINSTALER S.A.S., asegúrate de verificar la presión diferencial de corte (set points de presostato diferencial 20-40 PSI o 40-60 PSI), la precarga de aire en tanques de diafragma (2 PSI por debajo de la presión de encendido) y la rotación trifásica del motor.`,
      });
    }

    const systemInstruction = `Eres "TECNI-COPILOT", el Asistente Técnico y de Servicio al Cliente Inteligente de "ALE. TECNINSTALER S.A.S.", empresa colombiana líder en ingeniería y mantenimiento hidráulico.
Tu rol es asistir a ${contextRole === 'technician' ? 'TÉCNICOS E INGENIEROS DE CAMPO' : 'ADMINISTRADORES DE COPROPIEDADES Y CLIENTES FINALES'}.
Conocimientos clave:
- Curvas hidráulicas de bombeo, cálculo de TDH (Altura Dinámica Total), NPSH disponible vs requerido.
- Marcas comunes en Colombia: Barnes, Grundfos, Pedrollo, Franklin Electric, Evans, Goulds, Danfoss, Square D, Schneider Electric.
- Redes Contra Incendio (NFPA 20 / NFPA 25), Tanques de reserva de agua potable (Decreto 1575 lavado y desinfección), Sistemas de presión constante con VFD.
- Tono: Altamente profesional, respetuoso, preciso y orientado a la seguridad técnica y operativa.
- Moneda y contexto: Colombia (COP, Bogotá y municipios aledaños).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'Sin respuesta generada.',
    });
  } catch (error: any) {
    console.error('Error in technical assistant:', error);
    return res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ALE. TECNINSTALER S.A.S. Server running on port ${PORT}`);
  });
}

startServer();
