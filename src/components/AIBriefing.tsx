/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Task } from "../types";
import { GradientButton } from "./CommonUI";
import { Mic, MicOff, Sparkles, ClipboardCopy, Loader2, PlayCircle, PlusCircle, CheckCircle, ListPlus } from "lucide-react";

interface AIBriefingProps {
  onAddTasksFromMeeting?: (tasks: Task[]) => void;
}

export const AIBriefing = ({ onAddTasksFromMeeting }: AIBriefingProps) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState(
    "Chủ tịch Phùng Gia Lâm kết luận: Trong tuần này, bộ phận Địa chính xã do đồng chí Thực phụ trách phải khẩn trương hoàn thành việc kiểm đếm thực địa khu dốc đê bồi sông Hồng bị sụt sạt tại thôn Đậu. Giao chuyên viên Nguyễn Văn Đức phối hợp chặt chẽ Công an xã đo vẽ và mời các chủ bến cát lên lập biên bản hành chính, hoàn tất dự thảo quyết định xử phạt trình tôi trước ngày 30/05/2026. Ngoài ra, đồng chí Thúy bên Tài chính lập tờ trình xin huyện bổ sung ngân sách kè đá nứt chân mồi đê thôn Tây để trình HĐND xã thông qua, hoàn thành trước ngày 05/06/2026."
  );
  
  const [loading, setLoading] = React.useState(false);
  const [meetingSummary, setMeetingSummary] = React.useState("");
  const [extractedTasks, setExtractedTasks] = React.useState<any[]>([]);
  const [tasksDispersed, setTasksDispersed] = React.useState(false);

  // Simulated recording speech intervals
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    
    setIsRecording(true);
    setTranscript("Chủ trì Chủ tịch Phùng Gia Lâm phát biểu: ");
    
    let step = 0;
    const intervalsText = [
      "Bộ phận Địa chính cần phối hợp Tư pháp nhanh chóng hòa giải khiếu nại tranh chấp ngõ đi thôn Nam của hộ gia đình ông Vy Văn Hồng. ",
      "Đồng chí Bùi Thanh Hải chủ trì khảo sát đo đạc hiện trạng xong trước 28/05/2026. ",
      "Văn phòng gửi giấy mời họp giao ban chuyên đề nông thôn mới nâng cao xã Hoàng Diệu vào chiều thứ Ba tới cho toàn bộ Trưởng thôn."
    ];

    const timer = setInterval(() => {
      if (step < intervalsText.length) {
        setTranscript(prev => prev + intervalsText[step]);
        step++;
      } else {
        clearInterval(timer);
        setIsRecording(false);
      }
    }, 1500);
  };

  // Run backend Gemini analysis to extract tasks
  const handleAnalyzeMeeting = async () => {
    if (!transcript.trim() || loading) return;

    setLoading(true);
    setTasksDispersed(false);
    try {
      const response = await fetch("/api/gemini/summarize-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: transcript })
      });
      const data = await response.json();
      setMeetingSummary(data.summary || "");
      setExtractedTasks(data.tasks || []);
    } catch (err: any) {
      console.error(err);
      setMeetingSummary("Có lỗi xảy ra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add these simulated tasks to the main global system state
  const handleDisperseTasks = () => {
    if (extractedTasks.length === 0 || !onAddTasksFromMeeting) return;

    const formattedTasks: Task[] = extractedTasks.map((t, idx) => ({
      id: `MEET-${Date.now()}-${idx}`,
      taskName: t.taskName,
      description: `Nhiệm vụ phát sinh trực tiếp từ kết luận chỉ đạo cuộc họp giao ban cấp xã Hoàng Diệu. Phối hợp: ${t.cooperators || "Các ban ngành xã"}.`,
      assigneeId: t.assignee.includes("Đức") ? "U009" : (t.assignee.includes("Thúy") ? "U012" : "U011"),
      assigneeName: t.assignee || "Bộ phận chuyên môn",
      creatorName: "Chủ tịch Phùng Gia Lâm",
      cooperators: [t.cooperators || "Đoàn xã"],
      startDate: new Date().toISOString().split("T")[0],
      deadline: t.deadline || "2026-06-01",
      status: "DANG_XU_LY" as any,
      priority: t.priority === "Khẩn" ? "Khẩn" : "Thường",
      completionPercent: 0,
      comments: [],
      logs: [{ id: `L-${Date.now()}`, action: "Giao việc từ cuộc họp", updatedBy: "Chủ tịch", timestamp: "2026-05-22" }],
      attachments: []
    }));

    onAddTasksFromMeeting(formattedTasks);
    setTasksDispersed(true);
    alert(`Đã phân phối tự động thành công ${formattedTasks.length} nhiệm vụ việc làm vào bảng điều hành Kanban của cán bộ xã!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* LEFT: SPEECH TO TEXT INTERFACE */}
      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-purple-600 animate-pulse" />
              <h3 className="font-display font-semibold text-slate-800 text-sm">Ghi âm Giao ban thông minh</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                }`}
              >
                {isRecording ? <MicOff size={12} /> : <Mic size={12} />}
                {isRecording ? "Đang thu âm..." : "Ghi âm trực tiếp"}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase">Bản ghi thu âm trực tiếp / Văn bản thô</p>
          <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-700 leading-relaxed custom-scroll">
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500 font-bold mb-2 animate-pulse text-[10px]">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                NHẬN DIỆN CHO Ý KIẾN CHỈ ĐẠO TRỰC TIẾP...
              </div>
            )}
            <textarea
              className="w-full bg-transparent h-full resize-none border-none focus:outline-none scrollbar-none text-slate-800 leading-normal"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Nội dung lời thoại ghi âm hoặc kết luận giao ban thô bấm nút Ghi âm hoặc tự gõ..."
            />
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex-shrink-0">
            <GradientButton
              size="md"
              variant="purple"
              disabled={loading || !transcript.trim() || isRecording}
              onClick={handleAnalyzeMeeting}
              className="w-full"
              icon={loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            >
              Phân tích tóm tắt & trích xuất việc làm bằng AI
            </GradientButton>
          </div>
        </div>
      </div>

      {/* RIGHT: AI SYNTHESIS & JOBS CARDS */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1.5 custom-scroll h-full max-h-[85vh]">
        {meetingSummary ? (
          <div className="space-y-4">
            {/* Tóm tắt */}
            <div className="glass-panel p-5 rounded-2xl border-purple-200 bg-purple-50/15">
              <h4 className="font-display font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                <CheckCircle size={15} className="text-purple-600" /> Tóm tắt kết luận Giao ban của Lãnh đạo
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {meetingSummary}
              </p>
            </div>

            {/* extracted tasks list */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-1">
                <h4 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ListPlus size={15} className="text-indigo-600" /> Nhiệm vụ AI đề xuất tự động phân rã
                </h4>
                
                {extractedTasks.length > 0 && !tasksDispersed && (
                  <GradientButton
                    size="sm"
                    variant="teal"
                    onClick={handleDisperseTasks}
                    icon={<PlusCircle size={12} />}
                  >
                    Tự động phân việc
                  </GradientButton>
                )}

                {tasksDispersed && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    ✓ Đã chuyển tiếp Kanban
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {extractedTasks.map((t, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-start gap-3 flex-wrap mb-1.5">
                      <h5 className="text-xs font-bold text-slate-800 leading-snug flex-1">
                        {t.taskName}
                      </h5>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        t.priority === "Khẩn" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 text-slate-500 border-t border-slate-100">
                      <div>
                        Chủ trì: <strong className="text-slate-700">{t.assignee}</strong>
                      </div>
                      <div className="text-right">
                        Hạn hoàn thành: <strong className="text-slate-700">{t.deadline}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full">
            <ClipboardCopy size={36} className="text-slate-300 mb-2 animate-bounce" />
            <h4 className="font-display font-medium text-slate-600 text-sm mb-1">
              Tính năng AI Trận Biên bản Họp Giao Ban
            </h4>
            <p className="text-xs max-w-sm">
              Sau khi thu âm kết luận trực tiếp của Chủ tịch nông thôn, chọn <strong>"Phân tích tóm tắt"</strong> bên trái để AI tự động bóc lọc việc làm, thiết lập tên người gánh vác, tính toán thời hạn phù hợp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
