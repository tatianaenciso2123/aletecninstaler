export type UserRole = 'admin' | 'technician' | 'client';

export type PriorityLevel = 'EMERGENCIA' | 'ALTA' | 'MEDIA' | 'PROGRAMADO';
export type OrderStatus = 'PENDIENTE' | 'EN_RUTA' | 'EN_EJECUCION' | 'FINALIZADA' | 'FACTURADA';
export type ApprovalStatus = 'PENDIENTE_VALIDACION' | 'APROBADO_ENVIADO' | 'RECHAZADO_CORRECCION' | 'BORRADOR';
export type PaymentStatus = 'PENDIENTE' | 'PAGADO' | 'EN_VERIFICACION' | 'ANULADA';
export type PaymentMethod = 'PSE' | 'TARJETA' | 'NEQUI' | 'DAVIPLATA' | 'EFECTIVO_VERIFICADO' | 'TRANSFERENCIA_BANCARIA';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'REPORT_SUBMITTED' | 'INVOICE_GENERATED' | 'REPORT_APPROVED' | 'REPORT_REJECTED' | 'PAYMENT_RECEIVED' | 'EMERGENCIA';
  targetRole: 'admin' | 'technician' | 'client' | 'all';
  targetClientId?: string;
  targetTechId?: string;
  orderId?: string;
  orderNumber?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
  unitPriceCOP: number;
  totalCOP: number;
}

export interface TechnicalReport {
  id: string;
  orderId: string;
  date: string;
  technicianName: string;
  technicianDocument: string;
  equipmentType: string;
  brand: string;
  model: string;
  hpPower: number;
  serialNumber: string;
  voltagePhase: 'Trifásico 220V' | 'Trifásico 440V' | 'Monofásico 220V' | 'Monofásico 110V';
  suctionPressurePsi: number;
  dischargePressurePsi: number;
  ampPhaseR: number;
  ampPhaseS: number;
  ampPhaseT: number;
  nominalAmperage: number;
  insulationResistanceMohm: number;
  vibrationMmS: number;
  generalStateBefore: 'CRÍTICO' | 'REGULAR' | 'BUENO';
  generalStateAfter: 'ÓPTIMO' | 'BUENO' | 'OBSERVACIÓN';
  materialsUsed: MaterialItem[];
  diagnosticDetails: string;
  workPerformed: string;
  recommendations: string;
  clientNameSigner: string;
  clientDocumentSigner: string;
  clientRoleSigner: string;
  clientSignatureDataUrl?: string;
  technicianSignatureDataUrl?: string;
  photoEvidenceUrls: string[];
  approvalStatus?: ApprovalStatus;
  adminNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  sentToClientAt?: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string; // e.g., OT-2026-084
  clientName: string;
  clientNit: string;
  clientContact: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  neighborhood: string;
  city: string;
  coordinates: { lat: number; lng: number };
  equipmentType: string;
  brand: string;
  model: string;
  hpPower: number;
  priority: PriorityLevel;
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  reportedIssue: string;
  notes?: string;
  totalCostCOP: number;
  technicalReport?: TechnicalReport;
  invoiceId?: string;
  etaMinutes?: number;
  createdAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCOP: number;
  totalCOP: number;
  isTaxable: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., FE-0924
  orderId?: string;
  orderNumber?: string;
  clientId?: string;
  clientName: string;
  clientNit: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalCOP: number;
  iva19COP: number;
  retencionFuenteCOP: number; // 4% sobre mano de obra o compras
  totalCOP: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  approvalStatus?: ApprovalStatus;
  paidDate?: string;
  paymentReference?: string;
  cashReceiptNo?: string;
  cashReceivedBy?: string;
  dianCufe?: string;
  dianQrUrl?: string;
  dianStatus?: 'VALIDADA_DIAN' | 'BORRADOR_LOCAL' | 'EN_PROCESO_DIAN';
}

export interface Technician {
  id: string;
  fullName: string;
  documentType: 'Cédula de Ciudadanía' | 'Cédula de Extranjería' | 'Pasaporte' | 'PEP' | 'NIT';
  documentNumber: string;
  documentId: string; // Formatted document id (e.g. "CC 1.020.394.882")
  address: string;
  conteLicense: string; // Tarjeta profesional CONTE / COPNIA
  phone: string;
  email: string;
  username: string; // Asignado para ingreso a plataforma
  password?: string; // Contraseña asignada de acceso
  avatarUrl?: string;
  specialty: 'Electrobombas y VFD' | 'Redes RCI & Contra Incendio' | 'Plantas Tratamiento & Osmosis' | 'Hidroneumáticos & Válvulas' | 'General Hidráulico';
  status: 'DISPONIBLE' | 'EN_RUTA' | 'EN_SERVICIO' | 'DESCANSO';
  currentLocationName: string;
  coordinates: { lat: number; lng: number };
  baseSalaryCOP: number;
  overtimeBonusCOP: number;
  completedOrdersCount: number;
  ratingScore: number;
  certifications: string[];
}

export interface InstalledEquipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  hp: number;
  serial: string;
  locationInBuilding: string; // e.g. "Cuarto de Bombas Sótano 2"
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  operatingHours: number;
  riskScore: number; // 0-100
  riskLevel: 'NORMAL' | 'MODERADO' | 'CRÍTICO';
}

export interface ClientAccount {
  id: string;
  companyName: string; // Nombre / Razón Social o Copropiedad
  documentType: 'NIT' | 'Cédula de Ciudadanía' | 'Cédula de Extranjería' | 'Pasaporte';
  documentNumber: string; // Número de identificación
  nit: string; // Identificación principal
  adminName: string; // Nombre de contacto / administrador
  clientRole: string; // Rol del cliente (e.g. "Administrador de Copropiedad", "Propietario", "Gerente de Operaciones")
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  city: string;
  username: string; // Asignado para ingreso a plataforma
  password?: string; // Contraseña asignada de acceso
  avatarUrl?: string; // Foto o logo del cliente
  contractType: 'PREVENTIVO_GOLD_MENSUAL' | 'PREVENTIVO_SILVER_BIMENSUAL' | 'POR_EVENTO';
  monthlyFeeCOP: number;
  sanitaryCertificateValidUntil: string;
  equipments: InstalledEquipment[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'MANUAL_BOMBAS' | 'VARIADORES_VFD' | 'REDES_RCI' | 'NORMATIVA_DECRETO1575' | 'TABLEROS_ELECTRICOS' | 'VALVULAS_REGULADORAS';
  brandOrStandard: string;
  description: string;
  fileSize: string;
  minRoleRequired: UserRole;
  pagesCount: number;
  downloadUrl: string;
  updatedAt: string;
}

export interface HydraulicPredictionResult {
  riskLevel: 'CRÍTICO' | 'MODERADO' | 'NORMAL';
  riskPercentage: number;
  estimatedMTBFDays: number;
  cavitationRisk: 'ALTO' | 'MEDIO' | 'BAJO';
  thermalOverloadRisk: 'CRÍTICO' | 'MODERADO' | 'BAJO';
  imminentFailureProbability: string;
  probableRootCauses: string[];
  actionProtocol: string[];
  recommendedParts: string[];
  executiveSummary: string;
  source?: string;
}

export interface CashTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  orderNumber: string;
  clientName: string;
  amountCOP: number;
  receivedByTechnician: string;
  concept: string;
  status: 'PENDIENTE_ARQUEO' | 'ARQUEADO_EN_CAJA' | 'DEPOSITADO_BANCO';
  verifiedByAdmin?: string;
}

export type ThemeColorId =
  | 'dark-sky'
  | 'dark-emerald'
  | 'dark-indigo'
  | 'dark-amber'
  | 'dark-rose'
  | 'dark-oled'
  | 'light-clean'
  | 'light-warm';

export interface ThemeOption {
  id: ThemeColorId;
  name: string;
  category: 'Oscuro' | 'Claro';
  isDark: boolean;
  accentColor: string;
  dotBg: string;
  badge: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark-sky',
    name: 'Azul Hidráulico (Original)',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'sky',
    dotBg: 'bg-sky-500',
    badge: '🌊 Clásico',
    description: 'Tono azul marino de ingeniería con acentos cian.',
  },
  {
    id: 'dark-emerald',
    name: 'Esmeralda Ecológica',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'emerald',
    dotBg: 'bg-emerald-500',
    badge: '🍃 Tratamiento',
    description: 'Verde esmeralda enfocado en aguas potables y residuales.',
  },
  {
    id: 'dark-indigo',
    name: 'Índigo Corporativo',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'indigo',
    dotBg: 'bg-indigo-500',
    badge: '⚡ Alta Gama',
    description: 'Púrpura e índigo nocturno de alta distinción industrial.',
  },
  {
    id: 'dark-amber',
    name: 'Ámbar Eléctrico',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'amber',
    dotBg: 'bg-amber-500',
    badge: '🔶 Potencia',
    description: 'Tonos ámbar y oro de alta visibilidad técnica.',
  },
  {
    id: 'dark-rose',
    name: 'Rubí RCI Incendios',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'rose',
    dotBg: 'bg-rose-500',
    badge: '🚨 Protección RCI',
    description: 'Rojo carmesí de emergencia y redes contra incendios.',
  },
  {
    id: 'dark-oled',
    name: 'OLED Titanio Puro',
    category: 'Oscuro',
    isDark: true,
    accentColor: 'cyan',
    dotBg: 'bg-zinc-900 border border-zinc-600',
    badge: '🖤 Contraste Alto',
    description: 'Negro absoluto ultra nítido de bajo consumo visual.',
  },
  {
    id: 'light-clean',
    name: 'Blanco Ejecutivo',
    category: 'Claro',
    isDark: false,
    accentColor: 'sky',
    dotBg: 'bg-sky-600 ring-2 ring-slate-300',
    badge: '☀️ Día Cristalino',
    description: 'Lienzo blanco puro de alta claridad para oficinas y luz solar.',
  },
  {
    id: 'light-warm',
    name: 'Arena Cálida Suave',
    category: 'Claro',
    isDark: false,
    accentColor: 'amber',
    dotBg: 'bg-amber-600 ring-2 ring-amber-200',
    badge: '🌅 Confort Visual',
    description: 'Tono piedra cálido mate que reduce la fatiga ocular.',
  },
];
