import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import Header from "../components/Header";
import Footer from '../components/Footer'

export default function ContactCallPage() {
  const [loading, setLoading] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [callLogs, setCallLogs] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const defaultAgentId = "01K2YEM51TC56JWFK65MHD3Q0Y";
  const defaultAgentName = "Health Insurance Agent";

  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    agent_id: defaultAgentId,
  });

  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dots = [];
    let animationFrame;

    const initDots = () => {
      dots = [];
      for (let i = 0; i < 60; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
        dot.x += dot.dx;
        dot.y += dot.dy;
        if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [isMobile]);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("https://3.95.238.222/api/bots/list", {
          headers: { accept: "application/json" },
        });
        
        if (!res.ok) throw new Error("Failed to fetch agents");

        const data = await res.json();
        
        // filter only active agents
        const activeAgents = (data || []).filter((agent) => agent.is_active === true);

        setAgents(activeAgents);
        if (activeAgents.length > 0) {
          setForm((prev) => ({
            ...prev,
            agent_id: activeAgents[0].id, // set first active agent as default
          }));
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone_number) {
      toast.error("Phone number is required");
      return;
    }

    setLoading(true);
    setCallStatus("Connecting...");

    try {
      const initiateUrl = `https://rivoz.in/initiat-call?first_name=${encodeURIComponent(
        form.first_name
      )}&last_name=${encodeURIComponent(
        form.last_name
      )}&phone_number=${encodeURIComponent(
        form.phone_number
      )}&agent_id=${encodeURIComponent(form.agent_id)}`;

      const initRes = await fetch(initiateUrl, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      console.log(initRes);

      if (!initRes.ok) throw new Error("Initiate call failed");

      const initData = await initRes.json();
      const log_id = initData.log_id;
      let callLog = null;
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        const logRes = await fetch(
          `https://rivoz.in/api/call-logs/get/${log_id}`,
          { headers: { "Content-Type": "application/json" } }
        );

        if (logRes.ok) {
          const resData = await logRes.json();
          console.log(resData);
          if (resData.status && resData.log) {
            callLog = resData.log;

            // Sentiment integration
            const sentiment = resData.sentiment || "Not available";
            callLog.sentiment = sentiment;

            // Status handling
            if (callLog.status === "Ring") {
              setCallStatus("📞 Ringing...");
            }

            if (callLog.status === "Connected") {
              setCallStatus("✅ Call is connected...");
              if (callLog.end_time) {
                setCallLogs(callLog);
                setShowDialog(true);
                setCallStatus("");
                setLoading(false);
                break;
              }
            }

            if (callLog.status === "Failed") {
              setCallStatus(
                "❌ Call not connected (user declined or no answer)."
              );
              setLoading(false);
              break;
            }
          }
        }
        attempts++;
        await new Promise((r) => setTimeout(r, 3000));
      }

      if (!callLog || (!callLog.end_time && callLog.status !== "Failed")) {
        toast.warn("Call not completed yet, please check later.");
        setCallStatus("");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setCallStatus("");
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  // --- Sentiment Summary Formatter ---
  const formatSentiment = (sentiment) => {
    if (!sentiment) return "Summary not available";

    // Cut before Speaker A starts
    const beforeSpeakerA = sentiment.split("Speaker A")[0];

    // Tone
    const toneMatch = beforeSpeakerA.match(
      /Tone:\s*(.*?)(?=Sentiment|Overall|$)/i
    );
    const tone = toneMatch ? toneMatch[1].trim() : "Neutral";

    // Sentiment
    const sentiMatch = beforeSpeakerA.match(/Sentiment:\s*(.*?)(?=Overall|$)/i);
    const senti = sentiMatch ? sentiMatch[1].trim() : "Neutral";

    // Overall
    const overallMatch = beforeSpeakerA.match(
      /Overall Sentiment[:\s*]*\**"?([^"\n]*)/i
    );
    const overall = overallMatch ? overallMatch[1].trim() : "Neutral";

    // Final single summary string
    return `User was ${tone.toLowerCase()}, showing a ${senti.toLowerCase()} attitude. Overall sentiment is **${overall}**.`;
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {!isMobile && (
        <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        ></canvas>
      )}

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between 
        bg-white/2 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10 gap-10 z-10"
      >
        {/* Left: Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full"
        >
          {/* <div className="mb-6 rounded-full border border-white/20 pb-4 text-center w-full"> */}
        
        {/* </div> */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-center md:text-left text-white">
            Demo{" "}
            <span className="text-4xl md:text-5xl font-extrabold mb-3 text-center md:text-left text-[#D0FF71]">
              Call
            </span>
          </h2>
          <p className="text-gray-300 mb-6 text-center md:text-left">
            Connect instantly with our{" "}
            <span className="text-[#D0FF71] font-semibold">
              {defaultAgentName}
            </span>
            .
          </p>

          {callStatus && (
            <p className="text-green-400 font-semibold mb-4">{callStatus}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                required
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                disabled={loading}
                className="w-1/2 px-4 py-3 rounded-lg bg-black/40 border border-white/30 placeholder-gray-500 text-white focus:ring-2 focus:ring-white outline-none"
              />
              <input
                required
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                disabled={loading}
                className="w-1/2 px-4 py-3 rounded-lg bg-black/40 border border-white/30 placeholder-gray-500 text-white focus:ring-2 focus:ring-white outline-none"
              />
            </div>

            <input
              required
              type="tel"
              name="phone_number"
              placeholder="Mobile Number"
              value={form.phone_number}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/30 placeholder-gray-500 text-white focus:ring-2 focus:ring-white outline-none"
            />

            <select
              name="agent_id"
              value={form.agent_id}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/30 text-white focus:ring-2 focus:ring-white outline-none bg-black"
            >
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-black text-white">
                    {agent.bot_name}
                  </option>
                ))
              ) : (
                <option disabled>Loading agents...</option>
              )}
            </select>


            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-2 font-medium text-base
              bg-[#D0FF71] text-black rounded-full shadow-lg hover:scale-105 transform transition 
              duration-300 active:scale-95 flex items-center justify-center gap-2
              ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading
                ? callStatus || "Connecting..."
                : "Submit & Connect Call"}
            </button>
          </form>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          <div className="p-4 rounded-2xl bg-black/40 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-500">
            <img
              src="https://alphacorp.ai/wp-content/uploads/2025/08/Untitled-design-1.gif"
              alt="Call Support"
              className="w-80 h-auto rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      {showDialog && callLogs && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-white max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">📞 Call Summary</h2>

            <ul className="space-y-2 text-gray-200">
              <li>
                <strong>Name:</strong> {callLogs.first_name}{" "}
                {callLogs.last_name}
              </li>
              <li>
                <strong>Phone:</strong> {callLogs.phone_number}
              </li>
              <li>
                <strong>Status:</strong> {callLogs.status || ""}
              </li>
              <li>
                <strong>Call Date:</strong>{" "}
                {callLogs.call_date || new Date().toLocaleDateString()}
              </li>
              <li>
                <strong>Start Time:</strong> {callLogs.start_time || "N/A"}
              </li>
              <li>
                <strong>End Time:</strong> {callLogs.end_time || "N/A"}
              </li>
              <li>
                <strong className="text-orange-500">Sentiment Summary:</strong>
                <p className="text-gray-300 mt-1 whitespace-pre-line">
                  {formatSentiment(callLogs.sentiment)}
                </p>
              </li>
            </ul>

            {/* Recording */}
            {callLogs.call_recording ? (
              <div className="mt-4">
                <strong>Recording:</strong>
                <audio controls className="mt-2 w-full">
                  <source src={callLogs.call_recording} type="audio/wav" />
                </audio>
              </div>
            ) : (
              <p className="text-gray-400 mt-2">No recording available</p>
            )}

            {/* Transcript download */}
            {callLogs?.conversation && callLogs.conversation.length > 0 ? (
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(14);
                  doc.text("📄 Call Transcript", 10, 15);

                  let y = 30;

                  callLogs.conversation.forEach((msg, index) => {

                    const prefix = msg.role === "assistant" ? "AI:" : "User:";

                
                    const lines = doc.splitTextToSize(
                      `${prefix} ${msg.content}`,
                      180
                    );

          
                    lines.forEach((line) => {
                      doc.text(line, 10, y);
                      y += 8; // line spacing
                      if (y > 280) {
                        doc.addPage();
                        y = 20;
                      }
                    });
                  });
                  doc.save(
                    `Call_Transcript_${callLogs.first_name || "Unknown"}_${
                      callLogs.last_name || ""
                    }.pdf`
                  );
                }}
                className="mt-3 px-4 py-2 bg-[#D0FF71] text-black rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                Download Transcript PDF
              </button>
            ) : (
              <p className="text-gray-400 mt-2">No transcript available</p>
            )}

            <button
              onClick={() => setShowDialog(false)}
              className="mt-6 w-full py-3 bg-[#D0FF71] text-black rounded-lg font-semibold"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  </>
  );
}
<Footer/>
