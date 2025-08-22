import React, { useEffect, useState } from "react";
import { FaSyncAlt, FaUser } from "react-icons/fa";

export default function AgentsList({ onSelectAgent }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rivoz.in/api/bots");
      const data = await res.json();
      setAgents(data || []);
      
      // Auto-select first agent if available
      if (data && data.length > 0) {
        onSelectAgent(data[0]);
      }
    } catch (err) {
      console.error("Error fetching agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center text-lg font-semibold text-white">
          <FaUser className="mr-2 text-blue-400" /> Bot List
        </h3>
        <button 
          onClick={fetchAgents} 
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading bots...</p>
      ) : agents.length === 0 ? (
        <p className="text-gray-400 text-center">No bots found.</p>
      ) : (
        <ul className="space-y-3">
          {agents.map((agent, idx) => (
            <li 
              key={idx}
              onClick={() => onSelectAgent(agent)}
              className="p-3 bg-white/10 rounded-xl text-white cursor-pointer hover:bg-blue-600 transition"
            >
              {agent.bot_name || `Bot ${idx+1}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
