import api from "../../api/axios";
import toast from "react-hot-toast";

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
    return <p className="text-gray-400 p-4 text-center">No {type}s found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 glass">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-white/5 border-b border-white/10 text-xs uppercase font-semibold text-gray-400">
          <tr>
            <th className="px-6 py-4">Title / Name</th>
            <th className="px-6 py-4">Owner</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-white/5 transition">
              <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                {item.title || item.name || "Untitled"}
              </td>
              <td className="px-6 py-4">
                {item.postedBy?.name || item.creator?.name || item.admin?.name || "System"}
              </td>
              <td className="px-6 py-4">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
                >
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
