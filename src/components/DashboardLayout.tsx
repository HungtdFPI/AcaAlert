import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LogOut,
    Menu,
    User,
    LayoutDashboard,
    FileText,
    Settings,
    ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { ROLE_NAMES, CAMPUS_NAMES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWidget } from './ChatWidget';
import { NotificationBell } from './NotificationBell';

export default function DashboardLayout() {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const NavItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => {
        const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        return (
            <button
                onClick={() => {
                    navigate(path);
                    setMobileMenuOpen(false);
                }}
                className={cn(
                    "flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 mb-1 max-w-[calc(100%-16px)]",
                    isActive
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
            >
                <Icon className={cn("w-5 h-5 transition-all", isSidebarOpen ? "mr-3" : "mr-0 mx-auto")} />
                {isSidebarOpen && <span>{label}</span>}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Header (Logo + Bell Only) */}
            <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="/logo-fpi.png" alt="FPT Polytechnic International" className="h-10 object-contain" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Academic Alert</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                            {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-medium text-slate-700 max-w-[80px] truncate">{profile?.full_name}</span>
                    </div>
                    <NotificationBell />
                </div>
            </div>

            {/* Sidebar Desktop */}
            <motion.div
                className={cn(
                    "hidden md:flex flex-col bg-white border-r h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out shadow-xl shadow-slate-200/50",
                    isSidebarOpen ? "w-72" : "w-16"
                )}
                initial={false}
                animate={{ width: isSidebarOpen ? 288 : 80 }}
            >
                <div className="h-20 flex items-center justify-between px-4 border-b bg-white">
                    {isSidebarOpen ? (
                        <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
                            <div className="flex items-center justify-center w-full px-2">
                                <img src="/logo-fpi.png" alt="FPT Polytechnic International" className="w-full h-auto object-contain max-h-20" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Academic Alert System</span>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <img src="/logo-fpi.png" alt="FPI" className="w-10 h-10 object-contain" />
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex h-8 w-8 text-slate-400 hover:text-slate-700 absolute -right-4 top-6 bg-white border shadow-sm rounded-full z-10"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </Button>
                </div>

                <div className="p-4 border-b bg-slate-50/50">
                    <div className={cn("flex items-center justify-between", !isSidebarOpen && "flex-col gap-4")}>
                        <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm shrink-0">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </div>
                            {isSidebarOpen && (
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm text-slate-900 truncate">{profile?.full_name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                                            {profile && ROLE_NAMES[profile.role]}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500">
                                            {profile && CAMPUS_NAMES[profile.campus]}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <NotificationBell />
                    </div>
                </div>

                <nav className="flex-1 py-6 overflow-y-auto space-y-1">
                    <NavItem icon={LayoutDashboard} label="Tổng quan" path="/" />
                    {profile?.role === 'gv' && (
                        <NavItem icon={FileText} label="Báo cáo của tôi" path="/my-reports" />
                    )}
                    {(profile?.role === 'cnbm' || profile?.role === 'truong_nganh') && (
                        <NavItem icon={FileText} label="Duyệt báo cáo" path="/approve-reports" />
                    )}
                    <NavItem icon={User} label="Hồ sơ cá nhân" path="/profile" />
                    {profile?.role === 'truong_nganh' && (
                        <NavItem icon={Settings} label="Quản trị hệ thống" path="/admin" />
                    )}
                </nav>

                <div className="p-4 border-t bg-slate-50">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors",
                            isSidebarOpen ? "justify-start px-4" : "justify-center px-0"
                        )}
                        onClick={handleSignOut}
                    >
                        <LogOut className={cn("w-5 h-5", isSidebarOpen && "mr-2")} />
                        {isSidebarOpen && "Đăng xuất"}
                    </Button>
                </div>
            </motion.div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-50 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => navigate('/')}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16",
                        location.pathname === '/' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                    )}
                >
                    <LayoutDashboard className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                {profile?.role === 'gv' && (
                    <button
                        onClick={() => navigate('/my-reports')}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16",
                            location.pathname === '/my-reports' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <FileText className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Báo cáo</span>
                    </button>
                )}

                {(profile?.role === 'cnbm' || profile?.role === 'truong_nganh') && (
                    <button
                        onClick={() => navigate('/approve-reports')}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16",
                            location.pathname === '/approve-reports' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <FileText className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Duyệt</span>
                    </button>
                )}

                <button
                    onClick={() => navigate('/profile')}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16",
                        location.pathname === '/profile' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                    )}
                >
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Hồ sơ</span>
                </button>

                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16",
                        mobileMenuOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                    )}
                >
                    <Menu className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>

            {/* Mobile Menu Overlay (Triggered by 'Menu' tab) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl md:hidden flex flex-col h-full pb-20" // pb-20 to account for bottom nav
                        >
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b flex items-center justify-center bg-indigo-600 text-white">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-2xl font-bold mb-2 backdrop-blur-md">
                                            {profile?.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <p className="font-bold text-lg">{profile?.full_name}</p>
                                        <p className="text-xs opacity-80 uppercase tracking-widest">{profile && ROLE_NAMES[profile.role]}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Menu Mở Rộng
                                </div>
                                <nav className="flex-1 py-2 overflow-y-auto px-2 space-y-1">
                                    {profile?.role === 'truong_nganh' && (
                                        <button onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl"><Settings className="w-5 h-5 mr-3 text-slate-400" />Quản trị hệ thống</button>
                                    )}
                                    <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl"><User className="w-5 h-5 mr-3 text-slate-400" />Thông tin tài khoản</button>
                                </nav>
                                <div className="p-4 border-t mt-auto">
                                    <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50" onClick={handleSignOut}>
                                        <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-0">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in zoom-in duration-300">
                    <Outlet />
                </div>
            </main>

            <ChatWidget />
        </div>
    );
}
