/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Send, Bot, User, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import { GradientButton } from "./CommonUI";

// Simple custom Markdown-like parser for gorgeous, clean UI rendering without package hazards
export function renderCustomMarkdown(text: string) {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    // 1. Headers
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="font-display font-bold text-slate-800 text-sm mt-3 mb-1.5 first:mt-0">
          {line.replace("### ", "")}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={idx} className="font-display font-bold text-slate-800 text-base mt-4 mb-2">
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h2 key={idx} className="font-display font-extrabold text-slate-900 text-lg mt-5 mb-3">
          {line.replace("# ", "")}
        </h2>
      );
    }

    // 2. Unordered lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const sanitized = line.substring(2);
      // Highlight bold text inside bullet points
      return (
        <li key={idx} className="text-xs text-slate-600 ml-4 list-disc pl-1 mb-1 leading-relaxed">
          {renderInlineBold(sanitized)}
        </li>
      );
    }

    // 3. Ordered lists
    const orderedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (orderedMatch) {
      return (
        <li key={idx} className="text-xs text-slate-600 ml-4 list-decimal pl-1 mb-1 leading-relaxed">
          {renderInlineBold(orderedMatch[2])}
        </li>
      );
    }

    // 4. Default paragraphs
    return (
      <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2 last:mb-0">
        {renderInlineBold(line)}
      </p>
    );
  });
}

function renderInlineBold(text: string) {
  const parts = text.split("**");
  if (parts.length <= 1) return text;
  return parts.map((part, i) => {
    return i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part;
  });
}

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}

export const AIChatPanel = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "M0",
      sender: "bot",
      content: "Chào đồng chí Lãnh đạo! Tôi là Trợ lý số điều hành UBND xã (GovFlow AI).\n\nĐồng chí cần tôi báo cáo nhanh về tình hình kinh tế - xã hội tháng này, rà soát văn bản quá hạn, hay soạn ý kiến chỉ đạo lãnh đạo?",
      timestamp: "09:30"
    }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const sampleQuestions = [
    "Tổng thu ngân sách xã đạt mấy % rồi?",
    "Có công việc nào đang quá hạn cần đôn đốc?",
    "Gợi ý bút phê giải trình đê bồi sông Hồng",
  ];

  const handleSend = async (textToSend?: string) => {
    const finalPrompt = textToSend || input;
    if (!finalPrompt.trim() || loading) return;

    // Append User Message
    const userMsg: Message = {
      id: `U-${Date.now()}`,
      sender: "user",
      content: finalPrompt,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt })
      });
      const data = await response.json();
      
      const botMsg: Message = {
        id: `B-${Date.now()}`,
        sender: "bot",
        content: data.text || "Xin lỗi đồng chí, hệ thống phản hồi lỗi bất ngờ.",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: `B-${Date.now()}`,
        sender: "bot",
        content: `❌ Máy chủ gặp lỗi kỹ thuật (${err.message}). Vui lòng tải lại trang hoặc thử lại sau.`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] rounded-2xl border border-slate-200/80 bg-white shadow-md overflow-hidden relative">
      
      {/* Upper header */}
      <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles size={18} className="text-purple-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-tight leading-none text-white">TRỢ LÝ SỐ ĐIỀU HÀNH CHỦ TỊCH</h3>
            <span className="text-[10px] text-purple-200 block mt-1 leading-none font-medium">Báo cáo trực tiếp, tham mưu và soạn bút phê</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border border-white/10">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> AI Sẵn sàng
        </div>
      </div>

      {/* Message logs container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scroll">
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div key={m.id} className={`flex items-start gap-3 max-w-[85%] ${isBot ? "" : "ml-auto flex-row-reverse"}`}>
              {/* Profile icon identifier */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs flex-shrink-0 ${
                isBot ? "bg-purple-100 text-purple-700" : "bg-indigo-600 text-white"
              }`}>
                {isBot ? <Bot size={15} /> : <User size={15} />}
              </div>

              {/* Message Bubble content */}
              <div className={`rounded-2xl p-4 shadow-sm border ${
                isBot 
                  ? "bg-white text-slate-800 border-slate-200/70"
                  : "bg-indigo-600 text-white border-indigo-700"
              }`}>
                <div className="space-y-1.5">
                  {isBot ? renderCustomMarkdown(m.content) : <p className="text-xs leading-relaxed">{m.content}</p>}
                </div>
                <div className={`text-[9px] mt-2 flex items-center justify-end ${isBot ? "text-slate-400" : "text-indigo-200"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing loader bubble queue */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs flex-shrink-0">
              <Bot size={15} />
            </div>
            <div className="bg-white text-slate-700 rounded-2xl p-4 border border-slate-200/70 shadow-sm flex items-center gap-2 text-xs font-medium">
              <Loader2 size={14} className="animate-spin text-purple-600" />
              <span>GovFlow AI đang soát xét văn bản & dự báo dữ liệu...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts footer bar */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <HelpCircle size={12} /> Gợi ý hỏi nhanh:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSend(q)}
            className="text-[10px] text-purple-600 border border-purple-200 hover:bg-purple-50 px-2.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Form input block */}
      <div className="p-4 bg-white border-t border-slate-150 flex-shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập câu hỏi chỉ đạo, hỏi chỉ tiêu ngân sách, rà soát công việc..."
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white transition-all disabled:opacity-60"
        />
        <GradientButton
          size="md"
          variant="purple"
          disabled={loading || !input.trim()}
          onClick={() => handleSend()}
          className="rounded-xl px-4 py-3 shrink-0"
          icon={<Send size={14} />}
        >
          Gửi đi
        </GradientButton>
      </div>
    </div>
  );
};
