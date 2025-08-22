import React, { useEffect, useState } from "react";
import { FaTimes, FaPlay, FaDownload, FaInfoCircle } from "react-icons/fa";

export default function CallHistoryModal({ onClose }) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);

  // Fetch real call history on modal open
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/calls/history/", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch calls");
        setCalls(data);
      } catch (err) {
        console.error(err);
        setCalls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 px-4 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-5xl w-full p-6 text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition text-2xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-6 text-glow animate-glow">Call History</h2>

        {loading ? (
          <p className="text-center text-gray-300 animate-pulse">Loading call history...</p>
        ) : calls.length === 0 ? (
          <p className="text-center text-gray-300">No call history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-b border-white/10 hover:bg-white/10 transition">
                    <td className="py-3 px-4">{call.name}</td>
                    <td className="py-3 px-4">{call.phone}</td>
                    <td className="py-3 px-4">{call.status}</td>
                    <td className="py-3 px-4 flex gap-3 items-center">
                      {call.recording_url && (
                        <>
                          <a 
                            href={call.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                            title="Play Recording"
                          >
                            <FaPlay />
                          </a>
                          <a 
                            href={call.recording_url}
                            download
                            className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                            title="Download Recording"
                          >
                            <FaDownload />
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedCall(call)}
                        className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
                        title="View Details"
                      >
                        <FaInfoCircle />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Call Details Popup */}
        {selectedCall && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-6 text-white relative animate-fadeInUp">
              <button
                onClick={() => setSelectedCall(null)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition text-2xl"
              >
                <FaTimes />
              </button>
              <h3 className="text-2xl font-bold mb-4 text-glow">Call Details</h3>
              <ul className="space-y-2">
                <li><strong>Name:</strong> {selectedCall.name}</li>
                <li><strong>Phone:</strong> {selectedCall.phone}</li>
                <li><strong>Status:</strong> {selectedCall.status}</li>
                <li><strong>Start Time:</strong> {selectedCall.start_time || "N/A"}</li>
                <li><strong>End Time:</strong> {selectedCall.end_time || "N/A"}</li>
              </ul>
              {selectedCall.recording_url && (
                <div className="mt-4 flex gap-3">
                  <a 
                    href={selectedCall.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                  >
                    <FaPlay /> Play
                  </a>
                  <a 
                    href={selectedCall.recording_url}
                    download
                    className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
