/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GradientButton } from "./CommonUI";
import { PenTool, Check, FileText, Sparkles, Loader2, Download, CheckCircle, FileSignature } from "lucide-react";

interface AIDocumentDraftProps {
  onDraftSigned?: (draftTitle: string) => void;
}

export const AIDocumentDraft = ({ onDraftSigned }: AIDocumentDraftProps) => {
  const [docType, setDocType] = React.useState("Quyết định");
  const [title, setTitle] = React.useState("Thành lập Tổ kiểm tra liên ngành xử lý vi phạm hành chính đất đai ven sông Thôn Tây");
  const [purpose, setPurpose] = React.useState("Thực hiện kiểm đếm và xử lý triệt để bãi cát hoạt động xây đập lấn chiếm bờ sông trái phép");
  const [points, setPoints] = React.useState("- Thành lập Tổ công tác gồm: Phó Chủ tịch Khánh (Tổ trưởng), bộ phận Địa chính (Đức, Thực), Công an xã.\n- Tiến hành thanh kiểm tra đột xuất điểm lấn chiếm từ 25/05.\n- Quyết định lập biên bản, tịch thu xe cơ giới nếu cản trở.\n- Thời hạn hoàn tất báo cáo là 12/06/2026.");
  const [draftResult, setDraftResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  // Signature states
  const [isSigned, setIsSigned] = React.useState(false);

  // Trigger generator Call on Server
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    setIsSigned(false);
    try {
      const response = await fetch("/api/gemini/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          title,
          purpose,
          points,
          requesterName: "Nguyễn Văn Đức",
          requesterTitle: "Công chức Địa chính - Xây dựng"
        })
      });
      const data = await response.json();
      setDraftResult(data.draftContent || "");
    } catch (err: any) {
      console.error(err);
      setDraftResult(`Lỗi tạo dự thảo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignDigital = () => {
    setIsSigned(true);
    if (onDraftSigned) {
      onDraftSigned(title);
    }
    alert("Đã tiến hành áp dụng Chứng thư số công cộng thành công! Văn bản đã được ký đóng dấu đỏ điện tử và chuyển tiếp sang bộ phận Văn thư đi để luân chuyển phát hành.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* LEFT FORM SIDE BAR - 5 COLS */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar max-h-[85vh]">
        <form onSubmit={handleGenerate} className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <PenTool size={16} className="text-purple-600" />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Cấu hình soạn thảo AI</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Loại văn bản</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 focus:bg-white"
            >
              <option value="Quyết định">Quyết định (UBND)</option>
              <option value="Công văn">Công văn hành chính</option>
              <option value="Tờ trình">Tờ trình xin ngân sách</option>
              <option value="Báo cáo">Báo cáo tình hình</option>
              <option value="Kế hoạch">Kế hoạch triển khai</option>
              <option value="Giấy mời">Giấy mời đại biểu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tiêu đề trích yếu</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề trích yếu văn bản..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Căn cứ pháp lý & Mục đích ban hành</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Xóa bỏ đê nứt, xử lý sạt lở đập bồi..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Các ý chính cần làm rõ (Mỗi ý một dòng)</label>
            <textarea
              required
              rows={4}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-500 focus:bg-white h-28 leading-normal custom-scroll resize-none"
            />
          </div>

          <GradientButton
            size="md"
            variant="purple"
            type="submit"
            disabled={loading}
            icon={loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            className="w-full"
          >
            {loading ? "Đang soạn thảo chuẩn hóa..." : "Soạn thảo tài liệu bằng AI"}
          </GradientButton>
        </form>

        {draftResult && !loading && (
          <div className="glass-panel p-4 bg-purple-50/20 border-purple-200">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" /> Bản Thảo Phân Tích Đạt Chuẩn
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Bản thảo văn bản đã được AI đánh giá đúng thể thức cấu trúc <strong>Nghị định 30/2020/NĐ-CP</strong>. Đồng chí Lãnh đạo có thể ký số áp mộc đỏ điện tử.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT A4 DRAFT PAPER SHEET PREVIEW - 7 COLS */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden h-full">
        {draftResult ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl mb-3 flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Chế độ Xem trước trang A4 hành chính
              </span>
              <div className="flex items-center gap-1.5">
                <GradientButton
                  size="sm"
                  variant="outline"
                  icon={<Download size={12} />}
                  onClick={() => alert("Hệ thống kết xuất tải về tệp tin Microsoft Word (.docx) thành công!")}
                >
                  Xuất Word
                </GradientButton>
                
                {!isSigned ? (
                  <GradientButton
                    size="sm"
                    variant="warning"
                    icon={<FileSignature size={12} />}
                    onClick={handleSignDigital}
                  >
                    Ký số ban hành (Mộc Đỏ)
                  </GradientButton>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                    ✓ ĐÃ CHÈN CHỮ KÝ SỐ CA
                  </span>
                )}
              </div>
            </div>

            {/* A4 simulated sheet */}
            <div className="flex-1 bg-white border border-slate-300 shadow-lg rounded-xl overflow-y-auto p-8 relative custom-scroll font-serif text-slate-900 leading-relaxed text-sm selection:bg-yellow-100">
              
              {/* Simulated red stamp on header/footer */}
              {isSigned && (
                <div className="absolute top-[80%] right-[15%] pointer-events-none transform -rotate-12 flex flex-col items-center justify-center border-4 border-double border-red-500 rounded-full w-28 h-28 text-red-500 font-bold bg-white/40 shadow-md">
                  <span className="text-[9px] uppercase tracking-wider">UBND XÃ</span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-center">HOÀNG DIỆU</span>
                  <span className="text-[8px] tracking-wide mt-1">ĐỒNG BỘ SỐ HOÁ</span>
                  <span className="text-[10px] tracking-wider text-red-600 font-bold">&#10004; ĐÃ CHỨNG THỰC</span>
                </div>
              )}

              {/* Text content pre-wrapped with govt formatting */}
              <pre className="whitespace-pre-wrap font-serif text-xs md:text-sm text-slate-800 outline-none leading-relaxed">
                {draftResult}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-slate-100 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <PenTool size={36} className="mb-2 text-slate-300" />
            <h4 className="font-display font-medium text-sm text-slate-500 mb-1">
              Chưa có dữ liệu dự thảo văn bản
            </h4>
            <p className="text-xs max-w-sm">
              Đồng chí vui lòng điền các chi tiết nghiệp vụ cơ bản ở khung bên trái và bấm nút <strong>"Soạn thảo tài liệu bằng AI"</strong> để kích hoạt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
