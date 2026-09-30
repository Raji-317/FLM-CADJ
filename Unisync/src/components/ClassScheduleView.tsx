import { getScheduleForDate, getScheduleWithSubstitutions, ClassSession } from "@/utils/scheduleUtils";

interface ClassScheduleViewProps {
  selectedDate: Date;
  userEmail: string;
  substituteLeaves?: any[];
  onRequestAdjustment?: (session: ClassSession) => void;
}

export const ClassScheduleView = ({ 
  selectedDate, 
  userEmail, 
  substituteLeaves = [], 
  onRequestAdjustment 
}: ClassScheduleViewProps) => {

  // ✅ Dynamically get schedule including accepted substitute assignments & covered annotations
  const schedule: ClassSession[] = substituteLeaves.length > 0 
    ? getScheduleWithSubstitutions(userEmail, selectedDate, substituteLeaves)
    : getScheduleForDate(userEmail, selectedDate);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isSunday = selectedDate.getDay() === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>📅</span> Daily Class Schedule
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(selectedDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          {schedule.some(s => s.isSubstitution) && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <span>🔄</span> Substitute Added
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {schedule.length} Class Session(s)
          </span>
        </div>
      </div>

      <div className="p-6">
        {isSunday ? (
          <div className="text-center py-12 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 text-5xl mb-3">🏖️</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Sunday - Weekend</h3>
            <p className="text-xs text-gray-500">No regular university lectures or labs scheduled for Sunday.</p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 text-5xl mb-3">📅</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No Classes Scheduled</h3>
            <p className="text-xs text-gray-500">There are no classes scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {schedule.map((session) => {
              const isSub = session.isSubstitution;
              const isCov = session.isCovered;

              return (
                <div 
                  key={session.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    isSub 
                      ? 'bg-purple-50/60 border-purple-300 ring-1 ring-purple-200 hover:shadow-md' 
                      : isCov
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200 hover:shadow-sm'
                      : 'bg-white border-gray-200/80 hover:shadow-sm hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-gray-900 text-base">{session.subject}</h4>
                        
                        {/* Session Type Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${getTypeColor(session.type)}`}>
                          {session.type}
                        </span>

                        {/* Branch & Section */}
                        {session.branch && (
                          <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                            {session.branch} {session.section ? `(Sec ${session.section})` : ''}
                          </span>
                        )}

                        {/* Substitute Duty Badge */}
                        {isSub && (
                          <span className="text-xs font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <span>🔄</span> Substitute Period
                          </span>
                        )}

                        {/* Covered by Colleague Badge */}
                        {isCov && (
                          <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <span>✓</span> Covered by Colleague
                          </span>
                        )}
                      </div>

                      {/* Detail notes for substitute or covered classes */}
                      {isSub && (
                        <div className="text-xs text-purple-900 bg-purple-100/70 rounded-lg px-2.5 py-1 my-1.5 inline-block border border-purple-200">
                          <span>👤 <strong>Covering for:</strong> {session.substituteFor}</span>
                          {session.substituteReason && (
                            <span className="text-purple-700 ml-2">({session.substituteReason})</span>
                          )}
                        </div>
                      )}

                      {isCov && (
                        <div className="text-xs text-emerald-900 bg-emerald-100/70 rounded-lg px-2.5 py-1 my-1.5 inline-block border border-emerald-200">
                          <span>✓ <strong>Assigned Substitute:</strong> {session.coveredBy} (Accepted & covering this class)</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-blue-500">🕒</span>
                          <span>{session.time} <span className="text-gray-400">({session.duration})</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-red-500">📍</span>
                          <span>{session.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-green-500">👥</span>
                          <span>{session.students} Enrolled Students</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:ml-4 flex-shrink-0">
                      {isSub ? (
                        <span className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-300 rounded-lg flex items-center justify-center gap-1.5">
                          <span>✓</span>
                          <span>Assigned Cover Duty</span>
                        </span>
                      ) : isCov ? (
                        <span className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5">
                          <span>✓</span>
                          <span>Coverage Arranged</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onRequestAdjustment?.(session)}
                          className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>🔄</span>
                          <span>Request Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
