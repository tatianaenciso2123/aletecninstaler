import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { UserRole, ThemeColorId, THEME_OPTIONS, AppNotification } from '../types';
import { AuthUser } from './auth/LoginPage';
import {
  Building2,
  Wrench,
  UserCheck,
  Cpu,
  BookOpen,
  Bell,
  Activity,
  ShieldCheck,
  PhoneCall,
  LogOut,
  User,
  Calculator,
  MapPin,
  FileText,
  DollarSign,
  Users,
  Palette,
  Check,
  Sun,
  Moon,
  Sparkles,
  ClipboardCheck,
  Receipt,
  TrendingUp,
  X,
  CheckCheck,
  Share2,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  activeTab: string;
  isDarkMode: boolean;
  currentTheme?: ThemeColorId;
  currentUser?: AuthUser | null;
  notifications?: AppNotification[];
  pendingValidationCount?: number;
  onRoleChange: (role: UserRole) => void;
  onTabChange: (tab: string) => void;
  onToggleDarkMode: () => void;
  onChangeTheme?: (themeId: ThemeColorId) => void;
  onTriggerEmergency: () => void;
  onLogout: () => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onSelectNotification?: (notif: AppNotification) => void;
  onOpenShareCleanModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  activeTab,
  isDarkMode,
  currentTheme = 'dark-sky',
  currentUser,
  notifications = [],
  pendingValidationCount = 0,
  onRoleChange,
  onTabChange,
  onToggleDarkMode,
  onChangeTheme,
  onTriggerEmergency,
  onLogout,
  onMarkNotificationAsRead,
  onSelectNotification,
  onOpenShareCleanModal,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Corporate Status Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">Servidor Hidráulico Operativo</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            Certificación ISO 9001 & Decreto 1575
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300">Línea Nacional 24/7:</span>
            <a href="tel:+573004478151" className="text-sky-400 font-bold hover:underline">
              300 447 8151
            </a>
          </div>

          <button
            onClick={onTriggerEmergency}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-transform active:scale-95 shadow-sm shadow-rose-900/50"
          >
            <PhoneCall className="w-3 h-3 animate-bounce" />
            Reportar Urgencia 24/7
          </button>
        </div>
      </div>

      {/* Main Header & User Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <BrandLogo
            size="md"
            theme="white"
            textVariant="full"
            className="cursor-pointer"
          />

          {/* Mobile User / Role Badge */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-[11px] bg-sky-900/60 text-sky-300 px-2 py-0.5 rounded-md border border-sky-700/50 font-semibold uppercase">
              {currentRole === 'admin'
                ? 'Admin'
                : currentRole === 'technician'
                ? 'Empleado'
                : 'Cliente'}
            </span>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/60"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: User Profile Card & Notification Bell & Multi-Color Theme Selector & Logout */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Authenticated User Pill */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-[11px]">
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <div className="font-bold text-white leading-tight truncate max-w-[140px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {currentUser.email || currentUser.username}
                </div>
              </div>
            </div>
          )}

          {/* Real-time Notifications Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white transition-all active:scale-95"
              title="Notificaciones de reportes y facturación"
              id="navbar-notification-bell-btn"
            >
              <Bell className="w-4 h-4 text-sky-400" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-md shadow-rose-900/50">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Modal */}
            {isNotifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Centro de Notificaciones
                    </span>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {unreadNotifications.length} nuevas
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No hay notificaciones en este momento.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (onMarkNotificationAsRead) onMarkNotificationAsRead(notif.id);
                          if (onSelectNotification) onSelectNotification(notif);
                          if (notif.actionUrl) onTabChange(notif.actionUrl);
                          setIsNotifMenuOpen(false);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          notif.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-sky-500/50 text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-white text-xs">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    Sincronización en vivo
                  </span>
                  <button
                    onClick={() => setIsNotifMenuOpen(false)}
                    className="text-slate-300 hover:text-white font-medium hover:underline"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Color Theme Selector Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm hover:border-slate-700 active:scale-95"
              title="Seleccionar paleta y color del tema"
              id="theme-palette-dropdown-btn"
            >
              <span className={`w-3.5 h-3.5 rounded-full ${activeThemeObj.dotBg} shadow-sm`} />
              <Palette className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline font-medium text-slate-300">
                Tema: <strong className="text-white">{activeThemeObj.name.split(' ')[0]}</strong>
              </span>
              <span className="text-[11px]">{isDarkMode ? '🌙' : '☀️'}</span>
            </button>

            {/* Dropdown Menu with Multiple Color Themes */}
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
                    title="Alternar entre modo claro y oscuro"
                  >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                  </button>
                </div>

                <div className="mt-3 space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {/* Category: Oscuros */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Moon className="w-3 h-3 text-sky-400" />
                      Temas Oscuros de Alta Precisión
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
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500 shadow-md shadow-sky-950/50'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${theme.dotBg} shrink-0 mt-0.5 shadow-sm`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                                {theme.badge}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: Claros */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sun className="w-3 h-3 text-amber-400" />
                      Temas Claros Diurnos
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
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500 shadow-md shadow-sky-950/50'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${theme.dotBg} shrink-0 mt-0.5 shadow-sm`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                                {theme.badge}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    Persistencia automática
                  </span>
                  <button
                    onClick={() => setIsThemeMenuOpen(false)}
                    className="text-slate-300 hover:text-white font-medium hover:underline"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Share & Reset History / Clean Mode button */}
          {currentRole === 'admin' && onOpenShareCleanModal && (
            <button
              onClick={onOpenShareCleanModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Compartir enlace limpio sin cuentas demo y gestionar historial en 0"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Compartir Link Limpio</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-700/60 text-xs font-bold transition-all"
            title="Cerrar sesión y volver a la página de ingreso"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Module Tabs Navigation */}
      <div className="bg-slate-900/90 border-t border-slate-800/70 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1 sm:space-x-2 py-2">
            {/* ================= ADMIN TABS ================= */}
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  Dashboard General
                </button>

                <button
                  onClick={() => onTabChange('audit_control')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 relative ${
                    activeTab === 'audit_control'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
                  Auditoría & Control de OTs
                  {pendingValidationCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                      {pendingValidationCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onTabChange('invoicing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'invoicing'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  Facturación Diaria & Pagos
                </button>

                <button
                  onClick={() => onTabChange('finance')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'finance'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Finanzas & Flujo de Caja
                </button>

                <button
                  onClick={() => onTabChange('talent_clients')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'talent_clients'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Talento & Clientes
                </button>

                <button
                  onClick={() => onTabChange('dispatch_map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dispatch_map'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Despacho & GPS
                </button>

                <button
                  onClick={() => onTabChange('predictive_ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'predictive_ai'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Predictivo IA
                </button>
              </>
            )}

            {/* ================= TECHNICIAN TABS ================= */}
            {currentRole === 'technician' && (
              <>
                <button
                  onClick={() => onTabChange('tech_agenda')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'tech_agenda'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Mis Servicios Asignados
                </button>

                <button
                  onClick={() => onTabChange('tech_report')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'tech_report'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Informe Técnico Digital
                </button>

                <button
                  onClick={() => onTabChange('tech_cash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'tech_cash'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Recaudo en Efectivo
                </button>

                <button
                  onClick={() => onTabChange('hydraulic_calc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'hydraulic_calc'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                  Cálculos Hidráulicos de Campo
                </button>
              </>
            )}

            {/* ================= CLIENT PORTAL TABS ================= */}
            {currentRole === 'client' && (
              <>
                <button
                  onClick={() => onTabChange('client_portal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'client_portal'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Estado de Mis Equipos & Órdenes
                </button>

                <button
                  onClick={() => onTabChange('client_billing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'client_billing'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Facturación DIAN & Pagos PSE
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
