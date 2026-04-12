import api from "../../api/axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ContentTable({ type, data, onRefresh }) {

  const handleDelete = async (id) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      toast.success(`${type} deleted!`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  if(!data || data.length === 0) {
    return (
       <div className="py-20 text-center glass rounded-3xl border border-white/5 space-y-2">
          <p className="text-text-primary font-bold">No {type}s found</p>
          <p className="text-xs text-text-muted italic">There is currently no data to display for this category.</p>
       </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2rem] border border-white/10 glass-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">Title / Name</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">Owner</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">Created Date</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item._id} className="group hover:bg-white/[0.03] transition-colors duration-200">
              <td className="px-8 py-5 font-bold text-text-primary max-w-[300px] truncate group-hover:text-indigo-400 transition-colors">
                {item.title || item.name || "Untitled"}
              </td>
              <td className="px-8 py-5 text-text-secondary font-medium">
                {item.postedBy?.name || item.creator?.name || item.admin?.name || "System"}
              </td>
              <td className="px-8 py-5 text-text-muted font-medium">
                {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all transform hover:scale-105"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
