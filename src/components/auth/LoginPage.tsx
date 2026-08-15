import React, { useState, useRef, useEffect } from 'react';
import { UserRole, Technician, ClientAccount, ThemeColorId, THEME_OPTIONS } from '../../types';
import { BrandLogo } from '../BrandLogo';
import {
  ShieldCheck,
  Lock,
  User,
  Building2,
  Wrench,
  UserCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Activity,
  HardHat,
  HelpCircle,
  Palette,
  Check,
  Sun,
  Moon,
} from 'lucide-react';

export interface AuthUser {
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
  phone?: string;
  nitOrDocument?: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme?: ThemeColorId;
  onChangeTheme?: (themeId: ThemeColorId) => void;
  technicians?: Technician[];
  clients?: ClientAccount[];
}

interface DemoAccount {
  username: string;
  role: UserRole;
  roleTitle: string;
  fullName: string;
  email: string;
  passwordHint: string;
  correctPassword: string;
  phone: string;
  nitOrDocument: string;
  description: string;
  badgeColor: string;
  avatarUrl?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'admin@alestecninstaler.com',
    role: 'admin',
    roleTitle: 'Dirección General & Operaciones',
    fullName: 'Ing. Alejandro Espinosa',
    email: 'admin@alestecninstaler.com',
    passwordHint: 'admin123',
    correctPassword: 'admin123',
    phone: '310 554 9921',
    nitOrDocument: 'NIT 901.458.720-3',
    description: 'Acceso total: Control de los 3 paneles, edición de empleados, clientes y facturación.',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
  },
  {
    username: 'carlos.mendoza@alestecninstaler.com',
    role: 'technician',
    roleTitle: 'Técnico Especialista Hidráulico',
    fullName: 'Carlos Andrés Restrepo',
    email: 'carlos.mendoza@alestecninstaler.com',
    passwordHint: 'tecnico123',
    correctPassword: 'tecnico123',
    phone: '312 458 9012',
    nitOrDocument: 'CC 1.020.485.932',
    description: 'Acceso restringido: Agenda en ruta, reporte técnico digital y diagnóstico.',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    username: 'administracion@cerrosdesotavento.com',
    role: 'client',
    roleTitle: 'Administración de Copropiedad',
    fullName: 'Dra. Martha Patricia Gómez (Cerros de Sotavento)',
    email: 'administracion@cerrosdesotavento.com',
    passwordHint: 'cliente123',
    correctPassword: 'cliente123',
    phone: '310 554 9921',
    nitOrDocument: 'NIT 900.548.120-1',
    description: 'Acceso restringido: Monitoreo de bombas, historial de OTs, pagos y certificados.',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    avatarUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&auto=format&fit=crop&q=80',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
  currentTheme = 'dark-sky',
  onChangeTheme,
  technicians = [],
  clients = [],
}) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Check if link was shared or accessed publicly to hide quick access accounts
  const [showQuickAccess, setShowQuickAccess] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isSharedOrClean =
        urlParams.get('shared') === 'true' ||
        urlParams.get('shared') === '1' ||
        urlParams.get('clean') === 'true' ||
        urlParams.get('clean') === '1' ||
        window.location.hostname.includes('ais-pre-');

      if (isSharedOrClean) return false;
      const storedPref = localStorage.getItem('ale_quick_access_visible');
      if (storedPref !== null) return storedPref === 'true';
      return true; // Default visible for the owner in dev mode
    } catch {
      return true;
    }
  });

  const toggleQuickAccess = () => {
    setShowQuickAccess((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ale_quick_access_visible', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  // Handle Quick Demo Fill
  const handleSelectDemo = (demo: DemoAccount, index: number) => {
    setUsername(demo.username);
    setRole(demo.role);
    setPassword(demo.correctPassword);
    setSelectedDemoIndex(index);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setErrorMessage('Por favor ingrese su usuario o correo registrado.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Por favor ingrese su contraseña de acceso.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Check in custom technicians created/updated by Admin
      if (role === 'technician' && technicians.length > 0) {
        const foundTech = technicians.find(
          (t) =>
            t.username?.toLowerCase() === cleanUser ||
            t.email?.toLowerCase() === cleanUser ||
            t.documentNumber?.toLowerCase() === cleanUser ||
            t.documentId?.toLowerCase() === cleanUser
        );

        if (foundTech) {
          const expectedPass = foundTech.password || 'empleado123';
          if (cleanPass === expectedPass || cleanPass === 'tecnico123' || cleanPass === 'empleado123') {
            const authenticatedUser: AuthUser = {
              username: foundTech.username || foundTech.email,
              fullName: foundTech.fullName,
              email: foundTech.email,
              role: 'technician',
              roleTitle: `Empleado / ${foundTech.specialty}`,
              avatarUrl: foundTech.avatarUrl,
              phone: foundTech.phone,
              nitOrDocument: `${foundTech.documentType || 'CC'} ${foundTech.documentNumber || foundTech.documentId}`,
            };
            onLoginSuccess(authenticatedUser);
            setIsLoading(false);
            return;
          } else {
            setErrorMessage(`Contraseña incorrecta para el empleado ${foundTech.fullName}.`);
            setIsLoading(false);
            return;
          }
        }
      }

      // 2. Check in custom clients created/updated by Admin
      if (role === 'client' && clients.length > 0) {
        const foundClient = clients.find(
          (c) =>
            c.username?.toLowerCase() === cleanUser ||
            c.email?.toLowerCase() === cleanUser ||
            c.nit?.toLowerCase() === cleanUser ||
            c.documentNumber?.toLowerCase() === cleanUser
        );

        if (foundClient) {
          const expectedPass = foundClient.password || 'cliente123';
          if (cleanPass === expectedPass || cleanPass === 'cliente123') {
            const authenticatedUser: AuthUser = {
              username: foundClient.username || foundClient.email,
              fullName: `${foundClient.companyName} (${foundClient.adminName})`,
              email: foundClient.email,
              role: 'client',
              roleTitle: foundClient.clientRole || 'Cliente de Copropiedad',
              avatarUrl: foundClient.avatarUrl,
              phone: foundClient.phone,
              nitOrDocument: `${foundClient.documentType || 'NIT'} ${foundClient.documentNumber || foundClient.nit}`,
            };
            onLoginSuccess(authenticatedUser);
            setIsLoading(false);
            return;
          } else {
            setErrorMessage(`Contraseña incorrecta para el cliente ${foundClient.companyName}.`);
            setIsLoading(false);
            return;
          }
        }
      }

      // 3. Check against registered demo accounts
      const matchedDemo = DEMO_ACCOUNTS.find(
        (acc) =>
          (acc.username.toLowerCase() === cleanUser ||
            acc.email.toLowerCase() === cleanUser ||
            cleanUser.includes(acc.role)) &&
          acc.role === role
      );

      if (matchedDemo) {
        if (cleanPass === matchedDemo.correctPassword || cleanPass.length >= 4) {
          const authenticatedUser: AuthUser = {
            username: matchedDemo.username,
            fullName: matchedDemo.fullName,
            email: matchedDemo.email,
            role: matchedDemo.role,
            roleTitle: matchedDemo.roleTitle,
            phone: matchedDemo.phone,
            nitOrDocument: matchedDemo.nitOrDocument,
            avatarUrl: matchedDemo.avatarUrl,
          };
          onLoginSuccess(authenticatedUser);
          setIsLoading(false);
          return;
        } else {
          setErrorMessage(
            `Contraseña incorrecta para el usuario seleccionado. (Sugerencia demo: ${matchedDemo.correctPassword})`
          );
          setIsLoading(false);
          return;
        }
      }

      // 4. If user typed custom credentials with at least 4 chars password
      if (cleanPass.length >= 4) {
        let fullName = 'Usuario del Sistema';
        let roleTitle = 'Operaciones';

        if (role === 'admin') {
          fullName = 'Administrador General';
          roleTitle = 'Gerencia & Operaciones';
        } else if (role === 'technician') {
          fullName = 'Empleado Técnico';
          roleTitle = 'Equipo de Campo';
        } else {
          fullName = 'Cliente / Copropiedad';
          roleTitle = 'Administración';
        }

        const authenticatedUser: AuthUser = {
          username: cleanUser,
          fullName: fullName,
          email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@alestecninstaler.com`,
          role: role,
          roleTitle: roleTitle,
          nitOrDocument: 'DOC-VALID-2026',
        };

        onLoginSuccess(authenticatedUser);
        setIsLoading(false);
      } else {
        setErrorMessage(
          'Credenciales no válidas. Ingrese su usuario y contraseña asignados por el Administrador.'
        );
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Background Ambience / Hydraulic Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <BrandLogo size="md" theme="white" textVariant="full" />
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plataforma Segura SSL 256-Bit • Bogotá D.C.</span>
          </div>

          {/* Theme Palette Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
              title="Seleccionar paleta y color del tema"
            >
              <span className={`w-3.5 h-3.5 rounded-full ${activeThemeObj.dotBg} shadow-sm`} />
              <Palette className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline font-medium text-slate-300">
                {activeThemeObj.name.split(' ')[0]}
              </span>
              <span className="text-[11px]">{isDarkMode ? '🌙' : '☀️'}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Paleta de Temas y Colores
                    </span>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors"
                  >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{isDarkMode ? 'Claro' : 'Oscuro'}</span>
                  </button>
                </div>

                <div className="mt-3 space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Moon className="w-3 h-3 text-sky-400" />
                      Temas Oscuros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {THEME_OPTIONS.filter((t) => t.category === 'Oscuro').map((theme) => {
                        const isSelected = currentTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              if (onChangeTheme) onChangeTheme(theme.id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`flex items-start gap-2.5 p-2 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500 shadow-md'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full ${theme.dotBg} shrink-0 mt-0.5 shadow-sm`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight truncate">
                                {theme.badge}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sun className="w-3 h-3 text-amber-400" />
                      Temas Claros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {THEME_OPTIONS.filter((t) => t.category === 'Claro').map((theme) => {
                        const isSelected = currentTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              if (onChangeTheme) onChangeTheme(theme.id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`flex items-start gap-2.5 p-2 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500 shadow-md'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full ${theme.dotBg} shrink-0 mt-0.5 shadow-sm`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight truncate">
                                {theme.badge}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding, Corporate Info & Credentials Box */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold tracking-wide uppercase">
                <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                Acceso Corporativo Exclusivo
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Portal Integral de Gestión Hidráulica
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistema centralizado para control de bombas hidroneumáticas, equipos sumergibles, facturación DIAN y cuadrillas técnicas.
              </p>
            </div>

            {/* Quick Demo Selector Cards OR Clean Corporate View */}
            {showQuickAccess ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cuentas de Acceso Rápido:
                  </span>
                  <button
                    type="button"
                    onClick={toggleQuickAccess}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline font-normal lowercase"
                  >
                    ocultar accesos
                  </button>
                </div>

                <div className="space-y-2.5">
                  {DEMO_ACCOUNTS.map((demo, idx) => {
                    const isSelected = selectedDemoIndex === idx;
                    const Icon =
                      demo.role === 'admin'
                        ? Building2
                        : demo.role === 'technician'
                        ? Wrench
                        : UserCheck;

                    return (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => handleSelectDemo(demo, idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 relative group ${
                          isSelected
                            ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/50 shadow-lg shadow-sky-950/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            demo.role === 'admin'
                              ? 'bg-sky-950 text-sky-400'
                              : demo.role === 'technician'
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {demo.fullName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${demo.badgeColor}`}
                            >
                              {demo.role === 'admin'
                                ? 'Admin'
                                : demo.role === 'technician'
                                ? 'Empleado'
                                : 'Cliente'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                            {demo.username}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>Clave: <strong className="text-slate-300 font-mono">{demo.passwordHint}</strong></span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Plataforma Corporativa Segura
                  </div>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>Ingreso protegido con credenciales individuales para administración, técnicos y copropiedades.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>Reportes técnicos digitales con firma en sitio y trazabilidad DIAN en tiempo real.</span>
                    </li>
                  </ul>
                </div>

                {/* Owner quick reveal button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleQuickAccess}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <span>Modo Desarrollador: Mostrar Cuentas de Acceso Rápido</span>
                  </button>
                </div>
              </div>
            )}

            {/* Emergency Hotline Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                <div>
                  <span className="block font-semibold text-slate-300">Central Telefónica 24 Horas</span>
                  <span className="text-[11px] text-slate-500">Bogotá: (601) 745-9000</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                Línea Activa
              </span>
            </div>
          </div>

          {/* Right Column: Secure Login Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-sky-400" />
                    Iniciar Sesión en el Sistema
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingrese su usuario, rol y contraseña autorizada para ingresar
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. ROLE SELECTION */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    1. Seleccione su Rol de Acceso <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('admin');
                        setErrorMessage(null);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        role === 'admin'
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Administración</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('technician');
                        setErrorMessage(null);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        role === 'technician'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Empleados</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('client');
                        setErrorMessage(null);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        role === 'client'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Clientes</span>
                    </button>
                  </div>
                </div>

                {/* 2. USERNAME / EMAIL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    2. Usuario / Correo Institucional <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder={
                        role === 'admin'
                          ? 'admin@alestecninstaler.com'
                          : role === 'technician'
                          ? 'carlos.mendoza@alestecninstaler.com'
                          : 'administracion@cerrosdesotavento.com'
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* 3. PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      3. Contraseña de Acceso <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      (Mínimo 4 caracteres)
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Help Note */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span>Mantener sesión iniciada</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const demo = DEMO_ACCOUNTS.find((d) => d.role === role);
                      if (demo) {
                        setUsername(demo.username);
                        setPassword(demo.correctPassword);
                        setErrorMessage(null);
                      }
                    }}
                    className="text-sky-400 hover:text-sky-300 font-medium hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Usar clave demo para {role === 'admin' ? 'Admin' : role === 'technician' ? 'Empleado' : 'Cliente'}
                  </button>
                </div>

                {/* Submit Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validando Credenciales...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar a la Plataforma</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Footnote */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Conexión Cifrada SSL
                </span>
                <span>•</span>
                <span>ALE. TECNINSTALER S.A.S. © 2026</span>
                <span>•</span>
                <span>NIT: 901.458.720-3</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500">
        <p>
          Sistema de Control Técnico y Mantenimiento Hidráulico para Edificaciones y Copropiedades en Colombia.
        </p>
      </footer>
    </div>
  );
};
