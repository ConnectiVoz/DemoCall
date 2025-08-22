import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import UserDetails from "../pages/POST/UserDetailsForm";
import AgentsList from "../PostLogin/AgentList"
// import CallSheet from "../PostLogin/CallSHEET";
import CallLogsTable from "./CallLogsTable"

export default function PostLoginPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [callsCompleted, setCallsCompleted] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [showCallLogs, setShowCallLogs] = useState(false);

  const handleCallCompleted = () => setCallsCompleted((c) => c + 1);
  const handleAgentSelect = (agent) => setSelectedAgent(agent);

  const addContact = (newContact) => {
    if (contacts.length >= 10) {
      alert("Maximum 10 contacts allowed!");
      return;
    }
    setContacts((prev) => [...prev, newContact]);
    // Show call history modal automatically when 10 contacts are added
    if (contacts.length + 1 === 10) {
      setShowCallLogs(true);
    }
  };

  const preCreatedCampaign = {
    campaign_id: 84,
    campaign_bot_id: "01K17PH3MZ7DGC2PXWW3SWVY82",
    campaign_name: "efgrtgerfre",
    campaign_status: "created",
    campaign_created_on: "2025-08-18T09:20:00.045050+00:00",
    campaign_scheduled_datetime: "2025-08-18T15:00:00+00:00",
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 bg-gray-50 text-gray-900 dark:bg-[#0b1020] dark:text-white">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Welcome — Complete Your Details & Start Calling
      </h1>

      {/* User details and agent selection */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <AgentsList onSelectAgent={handleAgentSelect} />
        </div>
      </div>

      {/* Call Sheet */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">Call Sheet (Max 10 Entries)</h2>
        {/* <CallSheet
          selectedAgent={selectedAgent}
          preCreatedCampaignId={preCreatedCampaign.campaign_id}
          onCallCompleted={handleCallCompleted}
          addContact={addContact}
          contacts={contacts}
        /> */}
      </div>

      {/* Animated Call History Modal */}
      <AnimatePresence>
        {showCallLogs && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl p-6 relative"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Call History
              </h2>
              <button
                onClick={() => setShowCallLogs(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
              <div className="max-h-[70vh] overflow-y-auto">
                <CallLogsTable />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
