import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Clock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { type Report } from '../types';
import { toast } from 'sonner';
import { NoteHistoryModal } from './NoteHistoryModal';
import { ReportVersioningModal } from './ReportVersioningModal';

interface ReportDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report;
    onUpdate: (report: Report) => void;
    onSave: (report: Report) => Promise<void>;
}

export function ReportDetailDrawer({ isOpen, onClose, report, onUpdate, onSave }: ReportDetailDrawerProps) {
    const [formData, setFormData] = useState({
        warn_10: report.warn_10,
        warn_15_17: report.warn_15_17,
        warn_20: report.warn_20,
        banned: report.banned,
        status_detail: report.status_detail,
        teacher_note: report.teacher_note,
        study_status: report.study_status || 'Học đi',
        assessment_date: report.assessment_date,
    });
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'detail' | 'teacher' | 'dvsv'>('detail');

    // Modals in drawer
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        type: 'status_detail' | 'teacher_note' | 'dvsv_note' | null;
        title: string;
        currentValue: string;
    }>({ isOpen: false, type: null, title: '', currentValue: '' });

    const [versioningModal, setVersioningModal] = useState<{
        isOpen: boolean;
        report: Report | null;
    }>({ isOpen: false, report: null });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                warn_10: report.warn_10,
                warn_15_17: report.warn_15_17,
                warn_20: report.warn_20,
                banned: report.banned,
                status_detail: report.status_detail,
                teacher_note: report.teacher_note,
                study_status: report.study_status || 'Học đi',
                assessment_date: report.assessment_date,
            });
            setIsDirty(false);
        }
    }, [isOpen, report]);

    const handleCheckbox = (key: keyof typeof formData) => {
        setFormData(prev => {
            const next = { ...prev, [key]: !prev[key as keyof typeof formData] };
            setIsDirty(true);
            return next;
        });
    };

    const handleText = (key: keyof typeof formData, val: string) => {
        setFormData(prev => {
            const next = { ...prev, [key]: val };
            setIsDirty(true);
            return next;
        });
    };

    const handleSave = async () => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            const updatedReport = {
                ...report,
                ...formData,
                updated_at: new Date().toISOString()
            };
            await onSave(updatedReport);
            toast.success("Đã cập nhật!");
            onUpdate(updatedReport);
            setIsDirty(false);
            onClose();
        } catch (e) {
            toast.error("Lỗi khi lưu");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 inset-x-0 md:max-w-3xl md:mx-auto bg-white rounded-t-2xl z-[100] h-[92dvh] flex flex-col shadow-2xl border-x border-t border-gray-100/50"
                    >
                        {/* Drag Handle & Header */}
                        <div className="flex-none p-4 border-b border-gray-100">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-gray-100 text-gray-600 border border-gray-200">{report.campus || 'HN'}</Badge>
                                        <h3 className="text-lg font-bold text-gray-900">{report.student_name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-0.5">{report.class_name} • <span className="text-gray-500 font-normal">{report.student_code}</span></p>
                                    <p className="text-xs text-indigo-600 font-medium">{report.subject}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100 -mt-2 -mr-2 text-gray-400">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                            {/* 1. Status Toggles - Large & Touch friendly */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Điểm danh & Cảnh báo</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${formData.warn_20 ? 'bg-red-500' : 'bg-gray-300'}`} />
                                            <span className="font-medium text-gray-900">Vắng 20%</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-input"
                                            style={{ backgroundColor: formData.warn_20 ? '#ef4444' : '#e5e7eb' }}
                                        >
                                            <input type="checkbox" className="sr-only" checked={formData.warn_20} onChange={() => handleCheckbox('warn_20')} />
                                            <span className={`block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.warn_20 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${formData.banned ? 'bg-red-700' : 'bg-gray-300'}`} />
                                            <span className="font-medium text-gray-900">Cấm thi</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-input"
                                            style={{ backgroundColor: formData.banned ? '#b91c1c' : '#e5e7eb' }}
                                        >
                                            <input type="checkbox" className="sr-only" checked={formData.banned} onChange={() => handleCheckbox('banned')} />
                                            <span className={`block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.banned ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
                                            <span className="text-sm font-medium">Vắng 10%</span>
                                            <input type="checkbox" checked={formData.warn_10} onChange={() => handleCheckbox('warn_10')} className="w-5 h-5 accent-yellow-500" />
                                        </label>
                                        <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
                                            <span className="text-sm font-medium">Vắng 15-17%</span>
                                            <input type="checkbox" checked={formData.warn_15_17} onChange={() => handleCheckbox('warn_15_17')} className="w-5 h-5 accent-orange-500" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Notes Section with Tabs */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Thông tin chi tiết</h4>
                                    {isDirty && <Badge variant="secondary" className="animate-pulse">Chưa lưu</Badge>}
                                </div>

                                <div className="flex p-1 bg-gray-100 rounded-lg">
                                    <button
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'detail' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('detail')}
                                    >
                                        Tình trạng
                                    </button>
                                    <button
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'teacher' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('teacher')}
                                    >
                                        Ghi chú
                                    </button>
                                    <button
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'dvsv' ? 'bg-white shadow text-blue-700' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('dvsv')}
                                    >
                                        DVSV
                                    </button>
                                </div>

                                <div className="min-h-[120px]">
                                    {activeTab === 'detail' && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                            <textarea
                                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all min-h-[120px]"
                                                placeholder="Nhập tình trạng chi tiết..."
                                                value={formData.status_detail}
                                                onChange={(e) => handleText('status_detail', e.target.value)}
                                            />
                                            <Button variant="outline" size="sm" onClick={() => setHistoryModal({ isOpen: true, type: 'status_detail', title: 'Lịch sử tình trạng', currentValue: formData.status_detail })} className="w-full text-xs">
                                                <Clock className="w-3 h-3 mr-2" /> Xem lịch sử thay đổi
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'teacher' && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                            <textarea
                                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all min-h-[120px]"
                                                placeholder="Nhập ghi chú của giảng viên..."
                                                value={formData.teacher_note}
                                                onChange={(e) => handleText('teacher_note', e.target.value)}
                                            />
                                            <Button variant="outline" size="sm" onClick={() => setHistoryModal({ isOpen: true, type: 'teacher_note', title: 'Lịch sử ghi chú', currentValue: formData.teacher_note })} className="w-full text-xs">
                                                <Clock className="w-3 h-3 mr-2" /> Xem lịch sử thay đổi
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'dvsv' && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-900 min-h-[120px]">
                                                {report.dvsv_note ? report.dvsv_note : <span className="text-blue-400 italic">Chưa có phản hồi từ DVSV</span>}
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setHistoryModal({ isOpen: true, type: 'dvsv_note', title: 'Lịch sử phản hồi', currentValue: report.dvsv_note || '' })} className="w-full text-xs text-blue-600 border-blue-200 bg-blue-50">
                                                <Clock className="w-3 h-3 mr-2" /> Xem lịch sử phản hồi
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. Advanced Actions */}
                            <div className="pt-4 border-t border-gray-100">
                                <Button variant="secondary" className="w-full mb-3" onClick={() => setVersioningModal({ isOpen: true, report })}>
                                    Cập nhật Trạng thái & Ngày đánh giá
                                </Button>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex-none p-4 pb-[max(20px,env(safe-area-inset-bottom))] border-t border-gray-100 bg-white">
                            <Button
                                className="w-full h-12 text-lg font-medium shadow-lg shadow-indigo-200"
                                size="lg"
                                onClick={handleSave}
                                disabled={!isDirty || isSaving}
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Render Modals outside of Drawer scope if needed, or inside */}
            {historyModal.type && (
                <NoteHistoryModal
                    isOpen={historyModal.isOpen}
                    onClose={() => setHistoryModal(prev => ({ ...prev, isOpen: false }))}
                    reportId={report.id}
                    studentName={report.student_name}
                    type={historyModal.type!}
                    title={historyModal.title}
                    currentValue={historyModal.currentValue}
                    onSave={() => { }} // History specific save logic handled in modal or parent? In modal it saves to DB directly usually.
                />
            )}
            {versioningModal.isOpen && versioningModal.report && (
                <ReportVersioningModal
                    isOpen={versioningModal.isOpen}
                    onClose={() => setVersioningModal({ isOpen: false, report: null })}
                    report={versioningModal.report}
                    onSuccess={(updatedReport) => {
                        setFormData(prev => ({
                            ...prev,
                            assessment_date: updatedReport.assessment_date,
                            status_detail: updatedReport.status_detail,
                            teacher_note: updatedReport.teacher_note,
                            warn_10: updatedReport.warn_10,
                            warn_15_17: updatedReport.warn_15_17,
                            warn_20: updatedReport.warn_20,
                            banned: updatedReport.banned,
                            study_status: updatedReport.study_status
                        }));
                        onUpdate(updatedReport);
                        toast.success('Đã cập nhật trạng thái mới');
                    }}
                />
            )}
        </AnimatePresence>
    );
}
