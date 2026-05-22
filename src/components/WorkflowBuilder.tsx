/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserRole, WorkflowTemplate, WorkflowStep } from "../types";
import { mockWorkflowTemplates } from "../mockData";
import { GlassCard, GradientButton } from "./CommonUI";
import { GitBranch, Layers, Clock, Plus, Trash2, Check, ArrowRight, Sparkles, Send, PlayCircle } from "lucide-react";

export const WorkflowBuilder = () => {
  const [templates, setTemplates] = React.useState<WorkflowTemplate[]>(mockWorkflowTemplates);
  const [selectedTemplate, setSelectedTemplate] = React.useState<WorkflowTemplate>(templates[0]);
  const [steps, setSteps] = React.useState<WorkflowStep[]>(selectedTemplate.steps);
  const [workflowName, setWorkflowName] = React.useState(selectedTemplate.name);

  // Dry-run simulation state
  const [simulationActive, setSimulationActive] = React.useState(false);
  const [simActiveStepIdx, setSimActiveStepIdx] = React.useState<number | null>(null);
  const [simLog, setSimLog] = React.useState<string[]>([]);

  // Update when selected template changes
  React.useEffect(() => {
    setSteps(selectedTemplate.steps);
    setWorkflowName(selectedTemplate.name);
    setSimulationActive(false);
    setSimActiveStepIdx(null);
    setSimLog([]);
  }, [selectedTemplate]);

  // Add a brand new empty step
  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `S${Date.now()}`,
      name: "Nhiệm vụ mới thiết lập",
      role: UserRole.CHUYENVIEN,
      durationDays: 3,
      isNotificationSent: true
    };
    setSteps([...steps, newStep]);
  };

  // Remove a step
  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter(s => s.id !== id));
  };

  // Update step field value
  const handleUpdateStep = (id: string, field: keyof WorkflowStep, value: any) => {
    setSteps(steps.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  // Save changes back to database template
  const handleSaveChanges = () => {
    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return { ...t, name: workflowName, steps: steps };
      }
      return t;
    });
    setTemplates(updated);
    alert("Đã ghi nhận lưu mẫu quy trình liên thông thành công vào cơ sở dữ liệu!");
  };

  // Run dry run simulation
  const handleRunSimulation = async () => {
    if (simulationActive) {
      setSimulationActive(false);
      setSimActiveStepIdx(null);
      setSimLog([]);
      return;
    }

    setSimulationActive(true);
    setSimLog(["🚀 Khởi động luồng chạy thử văn bản khẩn cấp..."]);
    
    for (let i = 0; i < steps.length; i++) {
      setSimActiveStepIdx(i);
      const step = steps[i];
      
      // Artificial delay simulation
      setSimLog(prev => [
        ...prev, 
        `👉 Bước ${i + 1}: Chuyển cho [${step.role}] thực hiện nhiệm vụ - "${step.name}".`
      ]);
      
      if (step.isNotificationSent) {
        setSimLog(prev => [
          ...prev,
          `🔔 Hệ thống gửi tin nhắn Zalo kèm SMS khẩn cấp đôn đốc tới [${step.role}] (Thời hạn: ${step.durationDays} ngày).`
        ]);
      }

      // Small async halt
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setSimLog(prev => [...prev, "✨ Quy trình liên thông hoàn tất! Tài liệu được số hóa và phát hành đi thành công."]);
    setSimActiveStepIdx(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* 1. SELECTION & CONFIG SIDE PANEL */}
      <div className="xl:col-span-1 space-y-4 overflow-y-auto max-h-[85vh] pr-1 no-scrollbar">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
            <GitBranch size={16} className="text-purple-600" />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Chọn Mẫu Quy trình</h3>
          </div>

          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-medium flex items-center justify-between ${
                  selectedTemplate.id === t.id
                    ? "bg-purple-50 text-purple-700 border-purple-300 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <span className="text-[10px] text-slate-400 font-normal">{t.category}</span>
                </div>
                <ArrowRight size={14} className={selectedTemplate.id === t.id ? "text-purple-600" : "text-slate-300"} />
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Dynamic AI Suggested Conditional Branching Helper block */}
        <GlassCard className="p-4 bg-purple-950/5 border border-purple-200" glow>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-purple-600 animate-pulse" />
            <h4 className="font-display font-bold text-slate-800 text-xs">AI Gợi ý Nhánh rẽ thông minh</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Dựa trên quyết định 2026/QĐ-UBND của Ủy ban nhân dân huyện, đối với các công văn thuộc lĩnh vực <strong>Đất đai ven sông</strong>, hệ thống tự đề xuất chèn thêm nhánh kiểm tra Tư pháp trước khi gửi trình Chủ tịch duyệt ký nhằm giảm thiểu rủi ro khiếu tố.
          </p>
          <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-[10px]">
            <span className="text-slate-600 font-semibold">Tự phân loại khẩn cấp:</span>
            <span className="font-bold text-emerald-600">Đã kích hoạt</span>
          </div>
        </GlassCard>

        {/* dry run logs console */}
        {simulationActive && (
          <GlassCard className="p-4 bg-slate-900 border-slate-800 text-slate-300 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-amber-500 font-bold flex items-center gap-1.5">
                <PlayCircle size={14} className="animate-spin" /> Trình Giả Lập Luồng Chạy
              </span>
              <span className="text-[10px] text-slate-500">Log console</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {simLog.map((log, lIdx) => (
                <div key={lIdx} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      {/* 2. MAIN FLOW DIAGRAM DESIGN WORKSPACE */}
      <div className="xl:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
        <GlassCard className="flex flex-col flex-1 p-5 overflow-hidden">
          
          {/* Header Actions */}
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="font-display font-bold text-slate-800 text-base bg-slate-100 px-3 py-1.5 rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Đang thiết kế cấu hình quy trình liên thông xã Hoàng Diệu</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <GradientButton
                size="sm"
                variant="outline"
                className="text-slate-600 border-slate-200"
                onClick={handleRunSimulation}
              >
                {simulationActive ? "Dừng chạy thử" : "Chạy thử quy trình"}
              </GradientButton>
              <GradientButton size="sm" variant="purple" onClick={handleSaveChanges}>
                Lưu cấu hình quy trình
              </GradientButton>
            </div>
          </div>

          {/* DRAG-AND-DROP CANVAS WORKSPACE VIEW */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 custom-scroll">
            {steps.map((step, idx) => {
              const isSimActive = simActiveStepIdx === idx;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  
                  {/* Visual Node Card */}
                  <div
                    className={`w-full max-w-xl transition-all duration-300 rounded-xl p-4 border flex items-center justify-between ${
                      isSimActive
                        ? "bg-purple-600 text-white border-purple-500 ring-4 ring-purple-100 shadow-lg scale-[1.02]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                        isSimActive ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-[9px] uppercase font-bold tracking-wider ${
                            isSimActive ? "text-purple-200" : "text-slate-400"
                          }`}>
                            Tên bước việc
                          </label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => handleUpdateStep(step.id, "name", e.target.value)}
                            disabled={simulationActive}
                            className={`w-full bg-transparent text-xs font-bold focus:bg-slate-50 focus:px-1.5 focus:py-0.5 rounded outline-none ${
                              isSimActive ? "text-white placeholder-purple-100" : "text-slate-800"
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[9px] uppercase font-bold tracking-wider ${
                            isSimActive ? "text-purple-200" : "text-slate-400"
                          }`}>
                            Bộ phận chịu trách nhiệm
                          </label>
                          <select
                            value={step.role}
                            disabled={simulationActive}
                            onChange={(e: any) => handleUpdateStep(step.id, "role", e.target.value)}
                            className={`w-full bg-transparent text-xs focus:bg-slate-100 rounded focus:px-1 focus:py-0.5 outline-none font-semibold ${
                              isSimActive ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            <option value={UserRole.CHUTICH}>Chủ tịch xã</option>
                            <option value={UserRole.PHOCHUTICH}>Phó Chủ tịch xã</option>
                            <option value={UserRole.CHANHVANPHONG}>Chánh Văn phòng</option>
                            <option value={UserRole.TRUONGPHONG}>Trưởng phòng chuyên môn</option>
                            <option value={UserRole.GIAMDOC}>Giám đốc Trung tâm</option>
                            <option value={UserRole.VANTHUDEN}>Văn thư đến</option>
                            <option value={UserRole.VANTHUDI}>Văn thư đi</option>
                            <option value={UserRole.CHUYENVIEN}>Chuyên viên / Viên chức</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4 border-l pl-3.5 border-slate-100">
                      <div className="text-right">
                        <span className={`block text-[9px] uppercase font-bold tracking-wider ${
                          isSimActive ? "text-purple-200" : "text-slate-400"
                        }`}>
                          Hạn xử lý
                        </span>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <input
                            type="number"
                            min="1"
                            value={step.durationDays}
                            onChange={(e) => handleUpdateStep(step.id, "durationDays", parseInt(e.target.value) || 1)}
                            disabled={simulationActive}
                            className={`w-8 bg-transparent text-xs font-mono font-bold text-right outline-none bg-slate-50/20 focus:bg-white rounded px-0.5 ${
                              isSimActive ? "text-white focus:text-slate-900" : "text-slate-800"
                            }`}
                          />
                          <span className={`text-[10px] ${isSimActive ? "text-purple-200" : "text-slate-500"}`}>ngày</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 ml-2.5">
                        <input
                          type="checkbox"
                          checked={step.isNotificationSent}
                          disabled={simulationActive}
                          onChange={(e) => handleUpdateStep(step.id, "isNotificationSent", e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                          title="Hối báo SMS đôn đốc khi trễ hạn"
                        />
                        <span className={`text-[8px] uppercase font-bold ${isSimActive ? "text-purple-200" : "text-slate-400"}`}>SMS</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStep(step.id)}
                        disabled={simulationActive}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSimActive
                            ? "hover:bg-purple-700/50 text-purple-200 hover:text-white"
                            : "hover:bg-rose-50 text-slate-300 hover:text-rose-600"
                        }`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Flow Arrow signifier representation between nodes */}
                  {idx < steps.length - 1 && (
                    <div className="my-2.5 flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-purple-200 to-purple-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 -mt-1.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Append step button block */}
            <div className="flex justify-center pt-3 pb-8">
              <GradientButton
                size="sm"
                variant="outline"
                onClick={handleAddStep}
                disabled={simulationActive}
                className="border-dashed border-2 hover:border-purple-400 text-purple-600 hover:bg-purple-50"
                icon={<Plus size={14} />}
              >
                Chèn thêm Bước nghiệp vụ mới
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
