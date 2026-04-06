// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { jwtDecode } from "jwt-decode";

// import WelcomeModal from "../components/dialogueboxes/WelcomeModal";

// export default function Home() {
//   const [communities, setCommunities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showWelcome, setShowWelcome] = useState(false);

//   const navigate = useNavigate();

//   // ✅ GET USER ID
//   const token = localStorage.getItem("token");
//   let userId = null;

//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       userId = decoded.id || decoded._id;
//     } catch {}
//   }

//   const fetchCommunities = async () => {
//     try {
//       const res = await api.get("/communities");
//       setCommunities(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const handleJoin = async (e, id) => {
//     e.stopPropagation();
//     try {
//       await api.post(`/communities/${id}/join`);
//       fetchCommunities();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCommunities();

//     const isFirstVisit = localStorage.getItem("firstVisit");
//     if (!isFirstVisit) {
//       setShowWelcome(true);
//       localStorage.setItem("firstVisit", "true");
//     }
//   }, []);

//   if (loading) {
//     return <p className="text-gray-400 text-center mt-10">Loading...</p>;
//   }

//   return (
//     <div className="space-y-6">
//       {showWelcome && <WelcomeModal close={() => setShowWelcome(false)} />}

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-white">Explore Communities</h1>

//         <button
//           onClick={() => navigate("/create-community")}
//           className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white"
//         >
//           + Create
//         </button>
//       </div>

//       {/* COMMUNITIES */}
//       <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
//         {communities.map((c) => {
//           const isJoined = c.members?.includes(userId);

//           return (
//             <div key={c._id} className="break-inside-avoid">
//               <div
//                 onClick={() => navigate(`/community/${c._id}`)}
//                 className="group relative glass rounded-2xl p-5 cursor-pointer
//           hover:shadow-[0_0_25px_rgba(99,102,241,0.35)]
//           transition duration-300 overflow-hidden"
//               >
//                 <div className="transition duration-300 group-hover:opacity-0">
//                   <h2 className="text-lg font-semibold text-white">{c.name}</h2>

//                   <p className="text-sm text-gray-400 mt-1">{c.description}</p>

//                   <p className="text-xs text-indigo-400 mt-3">
//                     {c.members?.length || 0} members
//                   </p>
//                 </div>

//                 <div
//                   className="
//             absolute inset-0 flex items-center justify-center
//             bg-black/40 backdrop-blur-sm
//             opacity-0 group-hover:opacity-100
//             transition duration-300
//           "
//                 >
//                   <button
//                     onClick={(e) => handleJoin(e, c._id)}
//                     className={`px-5 py-2 rounded-lg text-white text-sm font-medium
//                 ${
//                   isJoined
//                     ? "bg-green-500"
//                     : "bg-indigo-500 hover:bg-indigo-600"
//                 }
//               `}
//                   >
//                     {isJoined ? "Joined" : "Join"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

import WelcomeModal from "../components/dialogueboxes/WelcomeModal";

export default function Home() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;
    } catch {}
  }

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities");
      setCommunities(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleJoin = async (e, id) => {
    e.stopPropagation();
    try {
      await api.post(`/communities/${id}/join`);
      fetchCommunities();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommunities();

    const isFirstVisit = localStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      setShowWelcome(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {showWelcome && <WelcomeModal close={() => setShowWelcome(false)} />}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Explore Communities
        </h1>

        <button
          onClick={() => navigate("/create-community")}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white"
        >
          + Create
        </button>
      </div>

      {/* 🔥 REAL BENTO GRID */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

  {communities.map((c, i) => {

    const isJoined = c.members?.includes(userId);

    // optional highlight logic
    const isFeatured = i % 6 === 0;

    return (
      <div
        key={c._id}
        onClick={() => navigate(`/community/${c._id}`)}
        className={`
          group relative rounded-2xl overflow-hidden cursor-pointer
          bg-white/5 backdrop-blur-lg border border-white/10
          hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]
          transition duration-300
          ${isFeatured ? "md:col-span-2" : ""}
        `}
      >

        {/* CONTENT */}
        <div className="p-4 transition duration-300 group-hover:opacity-0">

          <h2 className="text-white font-semibold text-lg">
            {c.name}
          </h2>

          <p className="text-sm text-gray-400 mt-2 line-clamp-3">
            {c.description}
          </p>

          <p className="text-xs text-indigo-400 mt-3">
            {c.members?.length || 0} members
          </p>

        </div>

        {/* HOVER */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition">

          <button
            onClick={(e) => handleJoin(e, c._id)}
            className={`px-5 py-2 rounded-lg text-white font-medium ${
              isJoined
                ? "bg-green-500"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isJoined ? "Joined" : "Join"}
          </button>

        </div>

      </div>
    );
  })}

</div>
    </div>
  );
}