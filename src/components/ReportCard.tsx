import { type Report } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight, Calendar, AlertTriangle, Ban } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReportCardProps {
    report: Report;
    onClick: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
    return (
        <Card
            className="h-full border-l-4 border-l-primary shadow-sm active:scale-[0.98] transition-transform"
            onClick={onClick}
        >
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 truncate text-base">{report.student_name}</h4>
                        <Badge variant="outline" className={cn(
                            "text-[10px] h-5 px-1.5 whitespace-nowrap",
                            report.study_status === 'Học đi' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                        )}>
                            {report.study_status || 'Học đi'}
                        </Badge>
                    </div>

                    <div className="text-xs text-gray-500 mb-2 truncate flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1 h-4 bg-gray-100 text-gray-600">{report.campus || 'HN'}</Badge>
                        <span className="font-medium text-gray-700">{report.student_code}</span>
                        <span className="text-gray-300">|</span>
                        <span>{report.class_name}</span>
                    </div>

                    <div className="text-[11px] font-medium text-indigo-600 mb-2 truncate">
                        {report.subject}
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {report.banned && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] flex items-center gap-1">
                                <Ban className="w-3 h-3" /> Cấm thi
                            </Badge>
                        )}
                        {report.warn_20 && !report.banned && (
                            <Badge className="h-5 px-1.5 text-[10px] bg-red-500 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> 20%
                            </Badge>
                        )}
                        {report.assessment_date && (
                            <span className="flex items-center text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-100">
                                <Calendar className="w-3 h-3 mr-1" /> {report.assessment_date}
                            </span>
                        )}
                    </div>
                </div>

                <div className="ml-3 text-gray-300">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </CardContent>
        </Card>
    );
}
