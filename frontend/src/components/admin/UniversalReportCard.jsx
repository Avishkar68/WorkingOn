import api from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const UniversalReportCard = ({ report, onRefresh }) => {
  const resolveQueue = async () => {
    try {
      await api.post(`/admin/reports/${report._id}/resolve`);
      toast.success("Report marked as resolved.");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error("Failed to resolve report");
    }
  };

  const deleteUnderlyingEntity = async () => {
    try {
      // Using dynamic endpoints based on the report's entity model
      const endpointMap = {
        'Post': `/admin/post/${report.entityId}`,
        'Pulse': `/admin/pulse/${report.entityId}`,
        'Opportunity': `/admin/opportunity/${report.entityId}`,
        'Project': `/admin/project/${report.entityId}`,
        'Event': `/admin/event/${report.entityId}`,
      };

      const path = endpointMap[report.entityModel];
      
      if (!path) {
        return toast.error(`Deletion not supported for this entity type (${report.entityModel})`);
      }

      await api.delete(path);
      toast.success(`${report.entityModel} actively deleted. Resolving report...`);
      await resolveQueue();
    } catch (err) {
      toast.error(`Failed to delete ${report.entityModel}`);
    }
  };

  const getEntityUrl = () => {
    switch (report.entityModel) {
      case 'Post': return `/posts/${report.entityId}`;
      case 'Opportunity': return `/opportunities/${report.entityId}`;
      case 'Project': return `/projects/${report.entityId}`;
      case 'Event': return `/events/${report.entityId}`;
      case 'Pulse': return `/campus-pulse`;
      default: return '#';
    }
  };

  return (
    <div className="glass p-5 rounded-2xl border border-red-500/30 flex flex-col md:flex-row gap-6 relative">
      {/* Meta Info */}
      <div className="flex-1 space-y-4">
        {/* Reporter */}
        <div className="flex items-center gap-3">
          <img
            src={report.reporter?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"}
            className="w-8 h-8 rounded-full border border-white/10"
            alt="Reporter"
          />
          <div>
            <p className="text-xs text-slate-400 capitalize">Reported by</p>
            <p className="font-bold text-white text-sm">
              {report.reporter?.name || "Unknown"}
            </p>
          </div>

          {report.reportedUser && (
            <>
               <span className="text-slate-500 mx-2">→</span>
               <div>
                  <p className="text-xs text-slate-400 capitalize">Target User</p>
                  <p className="font-bold text-white text-sm">
                     {report.reportedUser?.name}
                  </p>
               </div>
            </>
          )}

          <div className="ml-auto bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
            {report.entityModel}
          </div>
        </div>

        {/* Reason */}
        <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10 inline-block">
          <p className="text-xs font-bold text-red-400">Reason: {report.reason}</p>
        </div>

        {/* Snapshot Evidence */}
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Content Snapshot</p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-slate-300 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
            {report.snapshot}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="md:w-32 shrink-0 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
        <Link
          to={getEntityUrl()}
          target="_blank"
          className="w-full px-3 py-2 bg-indigo-500/20 text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] border border-indigo-500/30 text-center flex justify-center items-center"
        >
          ↗ View Post
        </Link>
        
        <button
          onClick={resolveQueue}
          className="w-full px-3 py-2 bg-green-500/20 text-green-400 font-bold text-xs rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] border border-green-500/30"
        >
          ✓ Resolve
        </button>

        <button
          onClick={deleteUnderlyingEntity}
          className="w-full px-3 py-2 bg-red-500/20 text-red-500 font-bold text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] border border-red-500/30"
        >
          🗑 Delete Post
        </button>
      </div>
    </div>
  );
};

export default UniversalReportCard;
