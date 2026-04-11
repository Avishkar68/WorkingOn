import { useState } from "react";
import api from "../../api/axios";
import { Upload, FileJson, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const ChallengesManager = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setPreview(parsed);
      } else if (parsed.challenges) {
        setPreview(parsed.challenges);
      } else {
        setPreview(null);
      }
    } catch {
      setPreview(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setJsonInput(text);
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) setPreview(parsed);
        else if (parsed.challenges) setPreview(parsed.challenges);
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const uploadChallenges = async () => {
    if (!preview) {
      toast.error("Please provide valid JSON challenges");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/challenges/upload", { challenges: preview });
      toast.success(res.data.message || "Challenges uploaded successfully");
      setJsonInput("");
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload challenges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT SECTION */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileJson className="text-indigo-400" size={20} />
              Import Monthly JSON
            </h3>
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white text-xs px-3 py-1.5 rounded-xl border border-white/10 transition flex items-center gap-2">
              <Upload size={14} />
              Upload File
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          
          <textarea
            value={jsonInput}
            onChange={handleJsonChange}
            placeholder='[{"date": "2026-04-11", "title": "...", "questions": [...]}]'
            className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500/50 transition resize-none no-scrollbar"
          />

          <button
            onClick={uploadChallenges}
            disabled={loading || !preview}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : (
              <>
                <CheckCircle2 size={18} />
                Bulk Upload Challenges
              </>
            )}
          </button>
        </div>

        {/* PREVIEW SECTION */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="text-emerald-400" size={20} />
            Data Preview
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {preview ? (
              preview.map((ch, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{ch.date}</span>
                    <span className="text-[10px] text-gray-500">{ch.questions?.length || 0} Questions</span>
                  </div>
                  <h4 className="text-sm font-medium text-white truncate">{ch.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{ch.description}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
                <AlertCircle size={32} />
                <p className="text-sm">Enter valid JSON to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SCHEMA HELPER */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">JSON Format Required</h4>
        <pre className="text-[10px] text-indigo-200/70 font-mono">
{`[
  {
    "date": "2026-04-11",
    "title": "Topic Name",
    "description": "Short description of today's task",
    "questions": [
      {
        "id": 1,
        "type": "multiple-choice",
        "question": "What is...?",
        "options": ["Op1", "Op2", "Op3"],
        "answer": "Op1"
      }
    ]
  }
]`}
        </pre>
      </div>
    </div>
  );
};

export default ChallengesManager;
