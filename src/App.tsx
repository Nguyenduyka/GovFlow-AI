/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserRole, User, Document, DocumentStatus, Task, TaskStatus, Alert, CitizenFeedback, SocioEconomicIndicator, GeoProject, SystemLog } from "./types";
import { mockUsers, mockDocuments, sampleTasks, mockAlerts, mockCitizenFeedbacks, mockIndicators, mockGeoProjects, mockSystemLogs } from "./mockData";
import { RoleBasedSidebar } from "./components/RoleBasedSidebar";
import { GlassCard, GradientButton, AIStatusBadge } from "./components/CommonUI";
import { CustomMap } from "./components/CustomMap";
import { WorkflowBuilder } from "./components/WorkflowBuilder";
import { AIChatPanel, renderCustomMarkdown } from "./components/AIChatPanel";
import { AIDocumentDraft } from "./components/AIDocumentDraft";
import { AIBriefing } from "./components/AIBriefing";

import {
  Bell,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  Send,
  Sliders,
  Calendar,
  Sparkles,
  HelpCircle,
  Loader2,
  Trash2,
  Check,
  Award,
  LogOut,
  FolderOpen,
  UserPlus,
  TrendingUp,
  FileSignature,
  FileCheck2,
  Database,
  Cpu,
  Mail,
  UserX,
  FileCode2,
  Lock
} from "lucide-react";

export default function App() {
  // 1. Core State Managers
  const [currentUser, setCurrentUser] = React.useState<User>(mockUsers[3]); // Default: Chánh Văn phòng Nguyễn Thu Hà
  const [currentRole, setCurrentRole] = React.useState<UserRole>(UserRole.CHANHVANPHONG);
  const [currentScreen, setCurrentScreen] = React.useState<string>("dashboard");

  // Repositories synchronizing with local storage for high interactive fidelity
  const [documents, setDocuments] = React.useState<Document[]>(() => {
    const saved = localStorage.getItem("govflow_documents");
    return saved ? JSON.parse(saved) : mockDocuments;
  });

  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const saved = localStorage.getItem("govflow_tasks");
    return saved ? JSON.parse(saved) : sampleTasks;
  });

  const [alerts, setAlerts] = React.useState<Alert[]>(() => {
    const saved = localStorage.getItem("govflow_alerts");
    return saved ? JSON.parse(saved) : mockAlerts;
  });

  const [feedbacks, setFeedbacks] = React.useState<CitizenFeedback[]>(() => {
    const saved = localStorage.getItem("govflow_feedbacks");
    return saved ? JSON.parse(saved) : mockCitizenFeedbacks;
  });

  const [indicators, setIndicators] = React.useState<SocioEconomicIndicator[]>(() => {
    const saved = localStorage.getItem("govflow_indicators");
    return saved ? JSON.parse(saved) : mockIndicators;
  });

  const [systemLogs, setSystemLogs] = React.useState<SystemLog[]>(mockSystemLogs);

  // Modal / Selection overlays
  const [selectedDocDetails, setSelectedDocDetails] = React.useState<Document | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Socioeconomic updating form states
  const [indFormId, setIndFormId] = React.useState("");
  const [indFormValue, setIndFormValue] = React.useState("");
  const [indFormPercent, setIndFormPercent] = React.useState("");

  // Persists states
  React.useEffect(() => {
    localStorage.setItem("govflow_documents", JSON.stringify(documents));
  }, [documents]);

  React.useEffect(() => {
    localStorage.setItem("govflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  React.useEffect(() => {
    localStorage.setItem("govflow_alerts", JSON.stringify(alerts));
  }, [alerts]);

  React.useEffect(() => {
    localStorage.setItem("govflow_feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  React.useEffect(() => {
    localStorage.setItem("govflow_indicators", JSON.stringify(indicators));
  }, [indicators]);

  // Sync user object with the role choice (for testing role-based workflows easily)
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const mappedUser = mockUsers.find((u) => u.role === role);
    if (mappedUser) {
      setCurrentUser(mappedUser);
    }
    // Refresh log audit
    const newLog: SystemLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: mappedUser?.name || "Cán bộ",
      action: `Đăng nhập hệ thống dưới thẩm quyền ${mappedUser?.title}`,
      module: "Hệ thống bảo mật",
      ip: "10.0.12.185",
      status: "Thành công",
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  const handleLogout = () => {
    // Return to a guest login panel state
    alert("Đã đăng xuất khỏi phiên làm việc an toàn của Trợ lý số UBND xã.");
  };

  // Add tasks injected directly from simulated components (Meetings / Maps)
  const handleAddTasksFromMeeting = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    // Inject alert to Chánh văn phòng
    const newAlert: Alert = {
      id: `A-${Date.now()}`,
      type: "info",
      title: "CÔNG VIỆC TỪ GIAO BAN AI",
      message: `Đã phân rã tự động thành công ${newTasks.length} việc mới gán chuyên viên.`,
      targetRole: UserRole.CHANHVANPHONG,
      createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleAddTaskFromMap = (taskName: string, location: string) => {
    const newTask: Task = {
      id: `MAP-${Date.now()}`,
      taskName: taskName,
      description: `Nhiệm vụ kiểm sát điểm sạt lở hoặc phản ánh khẩn cấp từ định vị bản đồ số tại địa bàn: ${location}`,
      assigneeId: "U009",
      assigneeName: "Nguyễn Văn Đức",
      creatorName: currentUser.name,
      cooperators: ["Công an xã"],
      startDate: new Date().toISOString().split("T")[0],
      deadline: "2026-05-28",
      status: TaskStatus.DANG_XU_LY,
      priority: "Khẩn",
      completionPercent: 0,
      comments: [],
      logs: [],
      attachments: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    alert(`Đã khởi tạo khẩn việc làm trên thực địa địa hình: ${taskName}. Điều chuyển cho Chuyên viên Địa chính Đức thụ lý thụ động.`);
  };

  // --------------------------------------------------
  // INTERACTIVE ACTION HANDLERS (Simulated server-led operations)
  // --------------------------------------------------
  const [scanningDocId, setScanningDocId] = React.useState<string | null>(null);
  const [ocrLog, setOcrLog] = React.useState<string[]>([]);

  // Trigger simulated Incoming PDF scanning & OCR extraction
  const handleScanAndOCR = (docId: string) => {
    setScanningDocId(docId);
    setOcrLog(["🔄 Khởi động hệ thống Scan chuyên dụng Một cửa...", "📂 Đang bóc tách ảnh định dạng PDF thành tuyến tính..."]);

    setTimeout(() => {
      setOcrLog((prev) => [...prev, "🤖 Kích hoạt công cụ OCR phân tích ngôn ngữ hành chính tiếng Việt...", "🧠 Trích xuất thực thể số văn bản, phát hiện Trích yếu cốt lõi..."]);
    }, 800);

    setTimeout(async () => {
      // Call local analyze-document route
      try {
        const targetDoc = documents.find((d) => d.id === docId);
        const response = await fetch("/api/gemini/analyze-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: targetDoc?.title,
            docType: targetDoc?.category,
          }),
        });
        const data = await response.json();

        setDocuments((prev) =>
          prev.map((d) => {
            if (d.id === docId) {
              return {
                ...d,
                status: DocumentStatus.DA_PHAN_TICH,
                aiAnalysis: data,
              };
            }
            return d;
          })
        );
        setScanningDocId(null);
        setOcrLog([]);
        alert("Trợ lý AI đã bóc tách OCR hoàn thiện nội dung và phân lớp đề xuất tham mưu chỉ đạo thành công!");
      } catch (err) {
        console.error(err);
        setScanningDocId(null);
      }
    }, 2200);
  };

  // Submit directive / routing by Boss or Chief of Staff
  const handleRouteDocument = (docId: string, assigneeName: string, dept: string, comment: string, deadline: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const matchedUser = mockUsers.find(u => u.name.includes(assigneeName)) || mockUsers[8];
          const newRoute = {
            fromUser: currentUser.name,
            fromTitle: currentUser.title,
            toUser: matchedUser.name,
            toTitle: matchedUser.title,
            actionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
            comment: comment || "Chuyển đơn vị khẩn trương thực hiện, nộp báo cáo kết quả đúng kỳ hạn.",
            status: "Đã chuyển xử lý",
          };
          return {
            ...d,
            status: DocumentStatus.DANG_XULY,
            routes: [...(d.routes || []), newRoute],
          };
        }
        return d;
      })
    );

    // Automatically spawn task associated with this document!
    const targetDoc = documents.find((d) => d.id === docId);
    const assignedUser = mockUsers.find(u => u.name.includes(assigneeName)) || mockUsers[8];
    const spawnedTask: Task = {
      id: `TS-${Date.now()}`,
      documentId: docId,
      taskName: `Xử lý công văn: ${targetDoc?.title.substring(0, 50)}...`,
      description: `Thực hiện tinh thần ý kiến chỉ đạo: ${comment}. Căn cứ pháp lý: ${targetDoc?.aiAnalysis?.legalBasis || "Quy chế làm việc UBND"}`,
      assigneeId: assignedUser.id,
      assigneeName: assignedUser.name,
      creatorName: currentUser.name,
      cooperators: targetDoc?.aiAnalysis?.cooperators || ["Phòng ban phối hợp"],
      startDate: new Date().toISOString().split("T")[0],
      deadline: deadline || targetDoc?.aiAnalysis?.deadline || "2026-06-10",
      status: TaskStatus.MOI,
      priority: targetDoc?.priority === "Hỏa tốc" || targetDoc?.priority === "Thượng khẩn" ? "Khẩn" : "Thường",
      completionPercent: 0,
      comments: [],
      logs: [],
      attachments: [],
    };

    setTasks((prev) => [spawnedTask, ...prev]);
    setSelectedDocDetails(null);
    alert(`Đã hoàn tất ý kiến chỉ đạo, ban hành nhiệm vụ gán cho ${assigneeName} xử lý chính, hạn nộp ngày ${deadline || "quy định"}.`);
  };

  // Sign Digital Verification Desk
  const handleSignatureAction = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return { ...d, isSigned: true, status: DocumentStatus.CHO_PHAT_HANH };
        }
        return d;
      })
    );
    alert("Áp dụng Chứng thư ký số công cộng ban ngành HĐND - UBND xã Hoàng Diệu thành công! Tài liệu đã sẵn sàng luân chuyển phát hành đi.");
  };

  // Release Document to Outbox
  const handleReleaseDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return { ...d, status: DocumentStatus.DA_PHAT_HANH };
        }
        return d;
      })
    );
    alert("Đã gán số hiệu công văn chính thức, đóng dấu giáp lai đỏ và truyền tệp phát hành điện tử liên thông về hệ thống Huyện Thường Tín!");
  };

  // --------------------------------------------------
  // ACTIVE SUB VIEW ROUTER SELECTOR PANEL
  // --------------------------------------------------
  const renderMainContent = () => {
    switch (currentScreen) {
      case "dashboard":
        return renderRoleBasedDashboard();
      case "indicators":
        return renderIndicatorsScreen();
      case "digital-twin":
        return <CustomMap onAddTaskFromMap={handleAddTaskFromMap} />;
      case "documents":
        return renderDocumentsScreen();
      case "citizen-feedback":
        return renderCitizenFeedbackScreen();
      case "kanban":
        return renderKanbanScreen();
      case "signature":
        return renderDigitalSignatureDesk();
      case "ai-assistant":
        return <AIChatPanel />;
      case "ai-draft":
        return <AIDocumentDraft onDraftSigned={(t) => {
          // Add a newly signed draft to documents repository
          const newDoc: Document = {
            id: `D-NEW-${Date.now()}`,
            docNumber: "..../QD-UBND",
            title: `[DỰ THẢO] ${t}`,
            senderAgency: "UBND Xã Hoàng Diệu",
            receivedDate: new Date().toISOString().split("T")[0],
            docDate: new Date().toISOString().split("T")[0],
            priority: "Thường",
            status: DocumentStatus.CHO_PHAT_HANH,
            category: "Quyết định",
            files: [{ id: "FR1", name: "Duthao-Ai-Generated.pdf", size: "750 KB", type: "PDF", uploadedAt: "Vừa xong" }],
            routes: [],
            isSigned: true,
          };
          setDocuments(prev => [newDoc, ...prev]);
        }} />;
      case "ai-meeting":
        return <AIBriefing onAddTasksFromMeeting={handleAddTasksFromMeeting} />;
      case "ai-reports":
        return renderAIReportsCenter();
      case "workflow-builder":
        return <WorkflowBuilder />;
      case "performance":
        return renderPerformanceEvaluation();
      case "alerts-deadlines":
        return renderAlertsScreen();
      case "ai-config":
        return renderAIConfigScreen();
      case "user-admin":
        return renderUserAdminPanel();
      case "system-logs":
        return renderSystemLogsTable();
      default:
        return renderMockComponentPlaceholder(currentScreen);
    }
  };

  // 1. DYNAMIC ROLE-BASED DASHBOARD CORE SELECTOR (As requested in 4)
  const renderRoleBasedDashboard = () => {
    switch (currentRole) {
      case UserRole.CHUTICH:
        return renderPresidentDashboard();
      case UserRole.PHOCHUTICH:
        return renderVicePresidentDashboard();
      case UserRole.CHANHVANPHONG:
        return renderChiefOfStaffDashboard();
      case UserRole.TRUONGPHONG:
        return renderDepartmentHeadDashboard();
      case UserRole.GIAMDOC:
        return renderAgencyDirectorDashboard();
      case UserRole.VANTHUDEN:
        return renderIncomingClerkDashboard();
      case UserRole.VANTHUDI:
        return renderOutgoingClerkDashboard();
      case UserRole.CHUYENVIEN:
        return renderSpecialistDashboard();
      default:
        return renderGeneralOverviewDashboard();
    }
  };

  // 1.1 President Dashboard (Chủ tịch - 4.1)
  const renderPresidentDashboard = () => {
    const overdueTasks = tasks.filter((t) => t.status === TaskStatus.QUA_HAN);
    const urgentDocs = documents.filter((d) => d.priority === "Hỏa tốc" || d.priority === "Thượng khẩn");
    
    return (
      <div className="space-y-6">
        {/* Banner Alert AI block */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">AI Cảnh Báo Khẩn</span>
              <span className="text-[10px] text-red-100 font-mono">2026-05-22</span>
            </div>
            <h3 className="font-display font-bold text-base">Rủi ro sạt lở mốc đê Thôn Tây & Chậm giải ngân Đầu tư công</h3>
            <p className="text-xs text-red-500/10 text-slate-100 leading-snug mt-1 max-w-2xl">
              Hệ thống AI giám sát báo động phát hiện tiến độ giải ngân xây dựng Nhà văn hoá giảm sâu 14% do ách tắc bồi thường đền lúa. Có 3 vụ việc trễ hạn giải trình địa chính.
            </p>
          </div>
          <GradientButton size="sm" variant="outline" className="bg-white text-rose-700 hover:bg-slate-50 border-white shrink-0 font-bold" onClick={() => setCurrentScreen("digital-twin")}>
            Xem chi tiết bản đồ số
          </GradientButton>
        </div>

        {/* Matrix dashboard stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("documents")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng văn bản đến</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">{documents.length}</p>
            <span className="text-[9px] text-purple-600 font-medium">Chờ phân phối: {documents.filter(d => d.status === DocumentStatus.MOI_TIEP_NHAN).length}</span>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-rose-500" hoverable onClick={() => setCurrentScreen("alerts-deadlines")}>
            <span className="text-[10px] text-rose-600 font-bold uppercase">Văn bản khẩn mật</span>
            <p className="text-2xl font-bold font-display text-rose-600 mt-1">{urgentDocs.length}</p>
            <span className="text-[9px] text-slate-400 font-medium">Yêu cầu bút phê xử lý ngắt</span>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-amber-500" hoverable onClick={() => setCurrentScreen("kanban")}>
            <span className="text-[10px] text-amber-600 font-bold uppercase">Công việc tồn đọng</span>
            <p className="text-2xl font-bold font-display text-amber-600 mt-1">{overdueTasks.length}</p>
            <span className="text-[9px] text-slate-400 font-medium">Trễ hạn chuyên viên phạt</span>
          </GlassCard>
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("citizen-feedback")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Kiến nghị tranh chấp phức tạp</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">{feedbacks.filter(f => f.feedbackType === "Khiếu nại").length}</p>
            <span className="text-[9px] text-indigo-600 font-medium">Đang thụ lý giải tỏa</span>
          </GlassCard>
        </div>

        {/* Work monitoring layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overdue table tracking */}
          <GlassCard className="lg:col-span-8 p-5 flex flex-col">
            <h4 className="font-display font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <AlertTriangle className="text-amber-500 animate-bounce" size={16} /> Theo dõi tiến độ - Đôn đốc Trễ Hạn
            </h4>
            <div className="overflow-x-auto flex-1 custom-scroll">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100">
                    <th className="p-2.5">Nhiệm vụ việc</th>
                    <th className="p-2.5">Người xử lý</th>
                    <th className="p-2.5">Thời hạn</th>
                    <th className="p-2.5">Trễ</th>
                    <th className="p-2.5">Lý do giải trình</th>
                    <th className="p-2.5 text-right">Tướng tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-medium text-slate-700">
                  {tasks.filter(t => t.status === TaskStatus.QUA_HAN || t.deadline.includes("21")).slice(0, 4).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 truncate max-w-[170px]" title={task.taskName}>{task.taskName}</td>
                      <td className="p-2.5 text-slate-500">{task.assigneeName}</td>
                      <td className="p-2.5 text-slate-500 font-mono">{task.deadline}</td>
                      <td className="p-2.5"><span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold text-[10px]">Trễ hạn</span></td>
                      <td className="p-2.5 italic text-[11px] text-slate-400 truncate max-w-[170px]" title={task.explanation || "Chưa gửi giải trình"}>
                        {task.explanation || "Chưa cập nhật lý do lên hệ thống"}
                      </td>
                      <td className="p-2.5 text-right">
                        <GradientButton size="sm" variant="outline" className="py-1 text-[10px]" onClick={() => {
                          alert(`Đã gửi mật lệnh hối báo trực tiếp đôn đốc của Chủ tịch Phùng Gia Lâm tới điện thoại di động của đồng chí [${task.assigneeName}]!`);
                        }}>
                          Nhắc việc
                        </GradientButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Quick AI Advisor Chat link */}
          <GlassCard className="lg:col-span-4 p-5 flex flex-col justify-between glass-card-purple">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={16} className="text-purple-600 animate-pulse" />
                <h4 className="font-display font-bold text-slate-800 text-sm">Tra cứu chỉ đạo AI</h4>
              </div>
              <p className="text-xs text-slate-500 leading-normal mb-4">
                Chủ tịch có thể hỏi đáp tức thời về ngân sách thu, mật độ đập lũ, hiệu suất phòng Địa chính hoặc soạn thảo văn bản chỉ đạo nhanh.
              </p>
              <div className="p-3 bg-white border border-purple-100 rounded-xl mb-4 text-xs italic text-slate-600">
                "Tổng thu ngân sách xã đạt bao nhiêu phần trăm rồi? Có dự báo khó khăn gì cuối năm không?"
              </div>
            </div>
            <GradientButton size="md" variant="purple" onClick={() => setCurrentScreen("ai-assistant")} className="w-full">
              Hỏi Trợ lý điều hành AI
            </GradientButton>
          </GlassCard>
        </div>
      </div>
    );
  };

  // 1.2 Vice-President Dashboard (Phó Chủ tịch - 4.2)
  const renderVicePresidentDashboard = () => {
    const chargeDocs = documents.filter((d) => d.category === "Kế hoạch" || d.category === "Tờ trình");
    return (
      <div className="space-y-6">
        <div className="p-5 glass-panel rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base">Cơ chế làm việc của Phó Chủ tịch UBND xã</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Đồng chí phụ trách lĩnh vực <strong>Kinh tế - Đô thị - Địa chính</strong>. Vui lòng rà soát soát xét các quyết định đai cát vi phạm đê bồi sông Hồng, ký duyệt tờ khai chi ngân quỹ sửa chữa.
            </p>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 font-bold px-3 py-1.5 rounded-xl">
            Lĩnh vực phụ trách: Kinh tế - Quy hoạch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("documents")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Dự thảo tờ trình chờ duyệt</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">3 tờ trình</p>
            <span className="text-[9px] text-slate-400 font-medium">Bên Tài chính tham mưu bổ sung đê sông</span>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-indigo-500" hoverable onClick={() => setCurrentScreen("signature")}>
            <span className="text-[10px] text-indigo-600 font-bold uppercase">Hồ sơ chờ ký số ban hành</span>
            <p className="text-2xl font-bold font-display text-indigo-600 mt-1">
              {documents.filter((d) => d.status === DocumentStatus.CHO_KY_SO).length} văn bản
            </p>
            <span className="text-[9px] text-slate-400 font-medium">Cung cấp bởi văn phòng và chuyên viên</span>
          </GlassCard>
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("citizen-feedback")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Phản ánh thực địa của cử tri</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">
              {feedbacks.filter(f => f.status === "Đang phân loại").length} phản ánh chưa lọc
            </p>
            <span className="text-[9px] text-purple-600 font-medium">Nguy cơ vi phạm trật tự xây dựng</span>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List of charge documents waiting review */}
          <GlassCard className="p-5">
            <h4 className="font-display font-bold text-slate-800 text-sm mb-3 border-b border-indigo-50 pb-2">📂 Hồ sơ đề xuất chuyên ngành trình ký</h4>
            <div className="space-y-3">
              {chargeDocs.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:border-indigo-300 transition-all hover:bg-white">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-xs font-bold text-slate-800 truncate mb-1" title={doc.title}>{doc.title}</p>
                    <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                      <span>Gửi bởi: {doc.senderAgency}</span>
                      <span>Hạn: {doc.aiAnalysis?.deadline || "Vô thời hạn"}</span>
                    </div>
                  </div>
                  <GradientButton size="sm" variant="blue" onClick={() => {
                    setSelectedDocDetails(doc);
                    setCurrentScreen("documents");
                  }} className="text-[10px] py-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Kiểm tra nội dung
                  </GradientButton>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Asked AI for fields help */}
          <GlassCard className="p-5 glass-card-teal flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                <Cpu size={16} className="text-teal-600" /> Cố vấn AI Tư pháp & Pháp luật Đất đai
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Phó Chủ tịch có thể hỏi nhanh về điều khoản Luật đất đai mới nhất, trình tự cưỡng chế san gạt lấn chiếm bãi bồi, hoặc thủ tục đính chính mốc giới quy hoạch.
              </p>
              <div className="p-3 rounded-lg bg-teal-500/5 text-[11px] leading-relaxed italic text-teal-800 border border-teal-200">
                "Hãy cho biết căn cứ pháp lý trong Luật Đất đai 2024 để ra quyết định cưỡng chế công trình lấn chiếm lòng lợp bãi đê sông Hồng?"
              </div>
            </div>
            <GradientButton size="md" variant="teal" onClick={() => setCurrentScreen("ai-assistant")} className="mt-4">
              Hỏi Trợ lý Chuyên gia AI
            </GradientButton>
          </GlassCard>
        </div>
      </div>
    );
  };

  // 1.3 Chief of Staff Dashboard (Chánh Văn phòng - 4.3 CORE REQUEST WITH 3 COLUMNS)
  const renderChiefOfStaffDashboard = () => {
    // Column 1: Sổ văn bản đến (new documents to route)
    const pendingDocs = documents.filter((d) => d.status === DocumentStatus.MOI_TIEP_NHAN || d.status === DocumentStatus.DA_PHAN_TICH || d.status === DocumentStatus.CHO_LANH_DAO_DUYET);
    const [activeCol1Doc, setActiveCol1Doc] = React.useState<Document | null>(pendingDocs[0] || documents[0]);

    // Fields for distribution route
    const [assignedStaff, setAssignedStaff] = React.useState("Nguyễn Văn Đức (Địa chính)");
    const [routingComment, setRoutingComment] = React.useState("");
    const [routingDeadline, setRoutingDeadline] = React.useState("");

    // Sync input values when selected Col1 doc changes
    React.useEffect(() => {
      if (activeCol1Doc && activeCol1Doc.aiAnalysis) {
        setAssignedStaff(`${activeCol1Doc.aiAnalysis.assignee} (${activeCol1Doc.aiAnalysis.department.split("-")[0].trim().replace("Bộ phận ", "")})`);
        setRoutingComment(`Giao bộ phận chủ trì rà soát thực hư và lấy ý kiến đồng trị liên ngành tham mưu báo cáo Huyện trước kỳ hạn.`);
        setRoutingDeadline(activeCol1Doc.aiAnalysis.deadline);
      } else {
        setAssignedStaff("Nguyễn Văn Đức (Địa chính)");
        setRoutingComment("");
        setRoutingDeadline("");
      }
    }, [activeCol1Doc]);

    return (
      <div className="space-y-4">
        {/* Helper guide title */}
        <div className="flex justify-between items-center bg-white border border-slate-200/80 p-3 rounded-xl">
          <div>
            <h3 className="text-xs font-bold text-slate-800 font-display">Bàn phân phối Công văn, Tham mưu bút chỉ đạo</h3>
            <p className="text-[10px] text-slate-400">Ứng dụng AI phân rã tóm tắt, rà sát lỗi văn bản thô chuẩn xác.</p>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50/80 px-2 py-1 rounded-full border border-purple-100">
            🤖 Khẩu độ AI Tham mưu: Tự động
          </span>
        </div>

        {/* THREE COLUMNS CORE INTERACTIVE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[72vh] overflow-hidden">
          
          {/* COLUMN 1: DANH SÁCH VĂN BẢN (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Sổ Văn bản cần xử lý ({pendingDocs.length})</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scroll">
              {pendingDocs.map((doc) => {
                const isSelected = activeCol1Doc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveCol1Doc(doc)}
                    className={`p-3 text-left transition-colors cursor-pointer text-xs ${
                      isSelected ? "bg-purple-50 hover:bg-purple-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-bold">
                        {doc.docNumber || "Chưa cấp số"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide ${
                        doc.priority === "Thường" ? "bg-slate-50 text-slate-500" : "bg-red-50 text-red-600 animate-pulse"
                      }`}>
                        {doc.priority}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">
                      {doc.title}
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                      <span>Gửi: {doc.senderAgency.substring(0, 20)}...</span>
                      <span className="font-semibold text-purple-600">
                        {doc.aiAnalysis ? "✓ Đã dịch AI" : "Chờ phân tích"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: NỘI DUNG VĂN BẢN PREVIEW & OCR TEXT (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Xem văn bản gốc / Tri thức Số hoá</span>
            </div>

            {activeCol1Doc ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-600 custom-scroll leading-relaxed">
                <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 text-[11px] space-y-1.5">
                  <p><strong>Cơ quan gửi:</strong> {activeCol1Doc.senderAgency}</p>
                  <p><strong>Ngày ban hành:</strong> {activeCol1Doc.docDate}</p>
                  <p><strong>Mức độ khẩn:</strong> {activeCol1Doc.priority}</p>
                  <p><strong>Văn bản chứa:</strong> {activeCol1Doc.category}</p>
                </div>

                <div className="border border-dashed border-purple-200 p-4 rounded-xl relative bg-purple-50/5">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-purple-100 text-purple-700 text-[8px] font-bold px-2 py-0.5 rounded">
                    <Cpu size={10} /> OCR Tiếng Việt
                  </div>
                  <h4 className="font-bold font-display text-slate-800 mb-2 mt-2">Nội dung Scan PDF gốc:</h4>
                  
                  {activeCol1Doc.aiAnalysis ? (
                    <p className="font-mono text-[10px] text-slate-500 whitespace-pre-line leading-normal">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM{"\n"}
                      Độc lập - Tự do - Hạnh phúc{"\n"}
                      -------{"\n\n"}
                      Trích yếu: {activeCol1Doc.title}{"\n\n"}
                      Căn cứ chức năng thẩm quyền địa phương, UBND huyện yêu cầu xã chủ trì khảo sát đo vẽ hành lang, áp dụng khung hình phạt dứt điểm bến cát bãi ven đê sông sạt lở. Trả rà soát trước 15/06/2026.
                    </p>
                  ) : (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                      <p className="text-slate-400 font-medium mb-3 text-[10px]">Tài liệu thô vừa cập nhật chưa bóc tách cấu quản lớp.</p>
                      
                      <GradientButton
                        size="sm"
                        variant="purple"
                        onClick={() => handleScanAndOCR(activeCol1Doc.id)}
                        disabled={scanningDocId === activeCol1Doc.id}
                        icon={scanningDocId === activeCol1Doc.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      >
                        {scanningDocId === activeCol1Doc.id ? "AI Đang xử lý bóc dữ liệu..." : "Phân tích OCR & Tách Nội dung AI"}
                      </GradientButton>
                    </div>
                  )}
                </div>

                {activeCol1Doc.files && activeCol1Doc.files.length > 0 && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-purple-600" />
                      <span className="truncate max-w-[150px] font-medium">{activeCol1Doc.files[0].name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">({activeCol1Doc.files[0].size})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                Chọn văn bản bên trái để kiểm tra tri thức hành chính.
              </div>
            )}
          </div>

          {/* COLUMN 3: AI THAM MƯU (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Sparkles size={13} className="text-purple-600 animate-pulse" /> Trợ lý AI Tham mưu chỉ đạo
              </span>
            </div>

            {activeCol1Doc && activeCol1Doc.aiAnalysis ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium text-slate-700 custom-scroll pb-16 relative">
                
                {/* AI Summary and specialty classification */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Yêu cầu tóm lược:</span>
                    <p className="text-slate-600 leading-normal bg-purple-50/20 p-2.5 rounded-xl border border-purple-100/50">
                      {activeCol1Doc.aiAnalysis.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Bộ xử lý đề xuất:</span>
                      <strong className="text-slate-800">{activeCol1Doc.aiAnalysis.department.replace("Bộ phận ", "")}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Bút chuyên đề:</span>
                      <strong className="text-slate-800">{activeCol1Doc.aiAnalysis.assignee}</strong>
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Rủi ro trễ việc (Phân tích AI):</span>
                    <p className="text-red-700 text-[10px] leading-snug">{activeCol1Doc.aiAnalysis.riskAssessment}</p>
                  </div>
                </div>

                {/* Directive allocation form */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-purple-700 flex items-center gap-1">
                    ✏ Ban hành Phiếu trình ý kiến đi
                  </h4>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Người tiếp quản việc</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1.5 focus:bg-white outline-none focus:border-purple-500"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Deadline</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none focus:bg-white focus:border-purple-500"
                        value={routingDeadline}
                        onChange={(e) => setRoutingDeadline(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Bút đề lục lãnh đạo</label>
                      <span className="text-[10px] font-bold text-indigo-600 block mt-1">Trình ký trực tuyến</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Ý kiến chỉ đạo Chánh văn phòng (Bút phê)</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 h-16 outline-none focus:bg-white focus:border-purple-500 leading-normal custom-scroll resize-none"
                      value={routingComment}
                      onChange={(e) => setRoutingComment(e.target.value)}
                      placeholder="Ý kiến văn phòng chỉ đạo, gán gác chuyên gia..."
                    />
                  </div>

                  <GradientButton
                    size="sm"
                    variant="purple"
                    className="w-full mt-2"
                    icon={<Send size={12} />}
                    onClick={() => {
                      handleRouteDocument(
                        activeCol1Doc.id,
                        assignedStaff.split("(")[0].trim(),
                        activeCol1Doc.aiAnalysis?.department || "Bộ phận Địa chính",
                        routingComment,
                        routingDeadline
                      );
                    }}
                  >
                    Kích hoạt Quy trình & Chuyển Chuyên viên
                  </GradientButton>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-4 leading-normal text-center">
                Vui lòng kích hoạt nút <strong>"Phân tích OCR"</strong> ở cột giữa trước để AI tổng thuật lập mẫu đề xuất tham mưu thụ lý tự động.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 1.4 Department Head Dashboard (Trưởng phòng Địa chính - 4.4)
  const renderDepartmentHeadDashboard = () => {
    const deptTasks = tasks.filter((t) => t.assigneeId === "U009" || t.assigneeId === "U005");
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng việc của bộ phận</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">{deptTasks.length} việc</p>
            <span className="text-[9px] text-slate-400">Địa chính đô thị đê đập</span>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-rose-500">
            <span className="text-[10px] text-rose-500 font-bold uppercase">Nhiệm vụ trễ hạn</span>
            <p className="text-2xl font-bold font-display text-rose-600 mt-1">
              {deptTasks.filter(t => t.status === TaskStatus.QUA_HAN).length} việc
            </p>
            <span className="text-[9px] text-slate-400">Yêu cầu đôn đốc giải trình</span>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-amber-500">
            <span className="text-[10px] text-amber-500 font-bold uppercase">Công việc đang xử lý</span>
            <p className="text-2xl font-bold font-display text-amber-600 mt-1">
              {deptTasks.filter(t => t.status === TaskStatus.DANG_XU_LY).length} việc
            </p>
            <span className="text-[9px] text-slate-400">Tiến độ cập nhật hằng ngày</span>
          </GlassCard>
          <GlassCard className="p-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mộc đỏ số đã duyệt gửi đi</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">
              {documents.filter(d => d.isSigned && d.status === DocumentStatus.DA_PHAT_HANH).length} hồ sơ
            </p>
            <span className="text-[9px] text-emerald-600 font-medium">Hoàn thành phát hành huyện</span>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-8 p-5">
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-3">📋 Bảng phân công Chuyên viên Tổ Địa chính</h4>
            <div className="space-y-3">
              {deptTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all hover:bg-white text-xs">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-bold text-slate-800 truncate mb-1">{task.taskName}</p>
                    <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                      <span>Phụ trách: {task.assigneeName}</span>
                      <span>Hạn: {task.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      task.status === TaskStatus.QUA_HAN ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      {task.status === TaskStatus.QUA_HAN ? "Trễ hạn" : "Đang thực hiện"}
                    </span>
                    <GradientButton size="sm" variant="outline" className="py-1 text-[10px]" onClick={() => {
                      alert(`Đã kích hoạt cuộc gọi kết nôi nội bộ nhanh thông báo thúc việc tới điện thoại của cán bộ [${task.assigneeName}]!`);
                    }}>
                      Hối báo
                    </GradientButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Leaderboard/Efficiency of personnel */}
          <GlassCard className="lg:col-span-4 p-5 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-semibold text-slate-800 text-sm mb-3">📊 Hiệu suất địa chuyên viên</h4>
              <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Nguyễn Văn Đức (Địa chính)</span>
                    <span className="font-bold">82%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Bùi Thanh Hải (Tư pháp)</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Phạm Thị Thúy (Tài chính)</span>
                    <span className="font-bold">60%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
            <GradientButton size="sm" variant="purple" onClick={() => setCurrentScreen("performance")} className="mt-4">
              Xem báo cáo hiệu suất chi tiết
            </GradientButton>
          </GlassCard>
        </div>
      </div>
    );
  };

  // 1.5 Agency Director Dashboard (Giám đốc Trung tâm - 4.5)
  const renderAgencyDirectorDashboard = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-200">
          <div>
            <span className="px-2 py-0.5 text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded">Chuyên mục: Học tập Cộng đồng</span>
            <h3 className="font-display font-bold text-slate-800 text-sm mt-1.5">Nhiệm vụ Trung tâm Giao kết nối UBND xã</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Tham gia phối hợp Sở Công Thương tổ chức quảng diễn xúc tiến OCOP Hoà Lạc, hỗ trợ nông dân mở bưu ảnh quảng bá gian hàng.
            </p>
          </div>
          <GradientButton size="sm" variant="teal" onClick={() => setCurrentScreen("ai-draft")}>
            Tạo dự thảo báo cáo đơn vị
          </GradientButton>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-4">
            <h4 className="font-semibold text-slate-800 text-xs mb-3 border-b pb-1.5">📋 Nhiệm vụ đơn vị được giao phân công</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 leading-snug">Thiết kế sơ đồ gian hàng bưởi hữu cơ xã Hoàng Diệu</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Trực giao: HĐND xã</span>
                  <span>Hạn: 15/06/2026</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h4 className="font-semibold text-slate-800 text-xs mb-3 border-b pb-1.5">🗂 Dự thảo báo cáo trình HĐND chuẩn bị gửi đi</h4>
            <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
              <FileCheck2 size={24} className="text-slate-300 mb-1.5" />
              <span>Chưa có dự thảo báo cáo chờ gửi chuyển tiếp.</span>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  };

  // 1.6 Clerk Dashboard Incoming (Văn thư đến - 4.6)
  const renderIncomingClerkDashboard = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
            <Database size={16} className="text-purple-600 animate-pulse" />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Tiếp nhận số hóa, đồng bộ văn bản Một Cửa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scanned/Drag drop mock panel */}
            <div className="border-2 border-dashed border-purple-200 bg-purple-50/5 rounded-2xl p-6 text-center flex flex-col items-center justify-center h-48 relative cursor-pointer" onClick={() => {
              alert("Khai mở thành công trình chọn tệp nguồn máy scan văn thư cơ sở. Đã giả lập đồng bộ thành công văn bản scan PDF lên bến đợi Chánh Văn phòng!");
            }}>
              <Sparkles size={28} className="text-purple-600 animate-bounce mb-2" />
              <h4 className="font-bold text-slate-700 text-xs mb-1">MÁY QUÉT BAN NGÀNH LÊN TOÀN DIỆN</h4>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                Bấm vào đây để chọn tệp, drag & drop tài liệu gửi từ huyện. Cổng OCR tự động dịch nghĩa tóm tắt.
              </p>
            </div>

            {/* Sync logs status */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhật ký Tiếp nhận Hôm Nay:</h4>
              <div className="space-y-2 text-[11px] font-medium text-slate-600 max-h-40 overflow-y-auto custom-scroll pr-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span>Trình công văn rà soát sạt mốc ranh sông Đậu</span>
                  <strong className="text-emerald-600 font-bold">&#10004; Đồng bộ AI</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span>Đơn khiếu nại ngõ đi hộ ông Vy Văn Hồng</span>
                  <strong className="text-emerald-600 font-bold">&#10004; Đồng bộ AI</strong>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  // 1.7 Clerk Dashboard Outgoing (Văn thư đi - 4.7)
  const renderOutgoingClerkDashboard = () => {
    const papersToRelease = documents.filter((d) => d.status === DocumentStatus.CHO_PHAT_HANH);
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Quầy Phát hành, Quản kiểm Ký số Công quyền</h3>
            <span className="text-[10px] text-slate-400 font-mono">Quản danh: Sổ công văn lưu trữ đi</span>
          </div>

          <div className="space-y-3">
            {papersToRelease.length > 0 ? (
              papersToRelease.map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-bold text-slate-700 truncate mb-1">{p.title}</p>
                    <span className="text-[10px] text-[10px] font-mono text-purple-600">Mẫu: {p.category} - Đã gán mộc ký số Trưởng ban</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <GradientButton size="sm" variant="purple" onClick={() => handleReleaseDocument(p.id)}>
                      Đóng Số & Phát Hành Đi
                    </GradientButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center justify-center">
                <FileCheck2 size={24} className="text-slate-300 mb-2" />
                <span>Không có văn bản nào đang chờ đôn đóng dấu ban hành đi đợt này.</span>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  };

  // 1.8 Specialist Dashboard (Chuyên viên - 4.8)
  const renderSpecialistDashboard = () => {
    const specTasks = tasks.filter((t) => t.assigneeId === currentUser.id);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("kanban")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Công việc mới giao</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">
              {specTasks.filter(t => t.status === TaskStatus.MOI || t.status === TaskStatus.CHUA_PHAN_CONG).length} việc
            </p>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-amber-500" hoverable onClick={() => setCurrentScreen("kanban")}>
            <span className="text-[10px] text-amber-500 font-bold uppercase">Đang tiến hành xử lý</span>
            <p className="text-2xl font-bold font-display text-amber-600 mt-1">
              {specTasks.filter(t => t.status === TaskStatus.DANG_XU_LY).length} việc
            </p>
          </GlassCard>
          <GlassCard className="p-4 border-l-4 border-rose-500" hoverable onClick={() => setCurrentScreen("alerts-deadlines")}>
            <span className="text-[10px] text-rose-500 font-bold uppercase">Công việc quá trễ hạn</span>
            <p className="text-2xl font-bold font-display text-rose-600 mt-1">
              {specTasks.filter(t => t.status === TaskStatus.QUA_HAN).length} việc
            </p>
          </GlassCard>
          <GlassCard className="p-4" hoverable onClick={() => setCurrentScreen("ai-draft")}>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Dự thảo văn bản tạo AI</span>
            <p className="text-2xl font-bold font-display text-slate-800 mt-1">Sẵn sàng</p>
          </GlassCard>
        </div>

        {/* List of active tasks of specialist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-8 p-5">
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-3">📋 Hộp tài liệu công danh việc làm gán tôi</h4>
            <div className="space-y-3">
              {specTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl relative hover:border-purple-300 transition-all hover:bg-white text-xs">
                  <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                    <p className="font-bold text-slate-700 leading-snug">{task.taskName}</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      task.status === TaskStatus.QUA_HAN ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      {task.status === TaskStatus.QUA_HAN ? "Quá hạn" : "Đang làm"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mb-2 line-clamp-2 leading-relaxed">{task.description}</p>
                  
                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 font-mono text-slate-400">
                    <span>Thời hạn: {task.deadline}</span>
                    <div className="flex gap-1">
                      <GradientButton size="sm" variant="outline" className="py-0.5 text-[9px]" onClick={() => {
                        let excuse = prompt("Nhập lý do khách quan giải trình việc chậm trễ tiến hành rà soát:");
                        if (excuse) {
                          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, explanation: excuse } : t));
                          alert("Đã chuyển giải trình nộp Chủ tịch đính duyệt trực tuyến.");
                        }
                      }}>
                        Giải trình trễ hạn
                      </GradientButton>
                      <GradientButton size="sm" variant="purple" className="py-0.5 text-[9px]" onClick={() => setCurrentScreen("ai-draft")}>
                        Tạo Dự Thảo Xử Lý
                      </GradientButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Advisor for specialist */}
          <GlassCard className="lg:col-span-4 p-5 flex flex-col justify-between glass-card-purple">
            <div>
              <h4 className="font-display font-bold text-slate-800 text-xs mb-2">💡 Gợi ý xử lý thông minh AI</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                Hệ thống AI đề nghị chuyên viên tham chiếu trực tiếp <strong>Khoản 3 Điều 208 Luật lấn đất đai 2024</strong> khi soạn dự thảo cưỡng chế giải toả bến lấn bờ sông để bảo vệ địa giới vững chãi.
              </p>
            </div>
            <GradientButton size="sm" variant="purple" onClick={() => setCurrentScreen("ai-assistant")} className="w-full">
              Hỏi cố vấn luật AI
            </GradientButton>
          </GlassCard>
        </div>
      </div>
    );
  };

  const renderGeneralOverviewDashboard = () => (
    <div className="p-5 text-center text-slate-400">Vui lòng chọn một vai trò cụ thể để khởi tạo Bàn điều hành chuyên nghiệp tương thích.</div>
  );

  // --------------------------------------------------
  // 2. INDICATORS SCREEN (Chỉ tiêu Kinh tế - Xã hội)
  // --------------------------------------------------
  const renderIndicatorsScreen = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border-blue-200">
          <h3 className="font-display font-bold text-slate-800 text-sm">Chỉ tiêu Phát triển Kinh tế - Xã hội xã Hoàng Diệu</h3>
          <p className="text-xs text-slate-500 leading-normal">
            Theo dõi, cập nhật tiến trình thu hồi ngân quỹ phí phi nông nghiệp, tiến độ thi công hạ tầng giao thông và tiến trình số hóa Một Cửa cải cách thành chính.
          </p>
        </GlassCard>

        {/* Table of active indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {indicators.map((ind) => (
              <GlassCard key={ind.id} className="p-5 text-xs text-slate-700">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{ind.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Đơn vị đo: {ind.unit} - Mục tiêu năm: {ind.targetValue}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    ind.status === "Đạt tiến độ" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}>
                    {ind.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Tiến trình hoàn thiện hiện tại ({ind.currentValue})</span>
                      <span>{ind.percentCompleted}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${ind.percentCompleted}%` }} />
                    </div>
                  </div>
                  
                  {/* Inline micro SVG chart history */}
                  <div className="w-24 h-10 shrink-0">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d={`M 10,${30 - ind.history[0].value / 4 || 15} L 30,${30 - ind.history[1].value / 4 || 15} L 50,${30 - ind.history[2].value / 4 || 15} L 70,${30 - ind.history[3].value / 4 || 15} L 90,${30 - ind.history[4].value / 4 || 15}`}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Form to update indicators */}
          <div className="lg:col-span-4">
            <GlassCard className="p-4">
              <h4 className="font-semibold text-slate-800 text-xs mb-3 border-b pb-1.5 uppercase">Cập nhật số liệu điều chỉnh</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const targetId = indFormId || (indicators[0]?.id || "");
                const targetVal = indFormValue.trim();
                const targetPct = parseInt(indFormPercent) || 0;
                
                if (!targetVal) {
                  alert("Vui lòng nhập giá trị đo mới.");
                  return;
                }

                setIndicators(prev => prev.map(ind => {
                  if (ind.id === targetId) {
                    const updatedHistory = [...ind.history];
                    if (updatedHistory.length >= 5) {
                      updatedHistory.shift();
                    }
                    updatedHistory.push({ period: "BC-Mớ", value: Math.min(30, targetPct / 3) });

                    return {
                      ...ind,
                      currentValue: targetVal,
                      percentCompleted: targetPct,
                      history: updatedHistory,
                      status: targetPct >= 85 ? "Đạt tiến độ" : "Cần đôn đốc"
                    };
                  }
                  return ind;
                }));

                const indicatorName = indicators.find(i => i.id === targetId)?.name || "Chỉ tiêu";
                const newLog: SystemLog = {
                  id: `LOG-IND-${Date.now()}`,
                  timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
                  user: currentUser.name,
                  action: `Cập nhật chỉ tiêu [${indicatorName}] thành ${targetVal} (${targetPct}%)`,
                  module: "Quản lý kinh tế",
                  ip: "10.0.12.185",
                  status: "Thành công",
                };
                setSystemLogs(prev => [newLog, ...prev]);

                alert(`Đã cập nhật thành công số liệu chỉ tiêu [${indicatorName}] sang ${targetVal}!`);
                setIndFormValue("");
                setIndFormPercent("");
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Chọn chỉ tiêu</label>
                  <select
                    value={indFormId || (indicators[0]?.id || "")}
                    onChange={(e) => setIndFormId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:bg-white focus:border-purple-500 outline-none text-slate-700"
                  >
                    {indicators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Giá trị mới đo</label>
                  <input
                    type="text"
                    required
                    value={indFormValue}
                    onChange={(e) => setIndFormValue(e.target.value)}
                    placeholder="Ví dụ: 8.1 tỷ VNĐ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tỷ lệ % quy đổi hoàn thành</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={indFormPercent}
                    onChange={(e) => setIndFormPercent(e.target.value)}
                    placeholder="72"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>
                <GradientButton size="sm" variant="purple" className="w-full" type="submit">Ghi vào Chỉ số</GradientButton>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 3. DOCUMENTS SCREEN (Sổ công văn hành chính)
  // --------------------------------------------------
  const renderDocumentsScreen = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex justify-between items-center border-b pb-3 mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm">Sổ đăng cơ, quản lý văn bản Một Cửa</h3>
              <p className="text-xs text-slate-400">Xem vết luân chuyển, ý kiến phê duyệt của Thường trực Hội đồng</p>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm trích yếu văn bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 w-64 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-3">
            {documents
              .filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocDetails(selectedDocDetails?.id === doc.id ? null : doc)}
                  className={`p-4 bg-white border rounded-2xl cursor-pointer hover:shadow-md transition-all ${
                    selectedDocDetails?.id === doc.id ? "border-purple-400 shadow-sm" : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                        {doc.docNumber || "SỐ HIỆU MỚI"}
                      </span>
                      <span className="text-slate-400 font-medium">Trích yếu:</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.priority === "Thường" ? "bg-slate-50 text-slate-500" : "bg-red-50 text-red-600 animate-pulse"
                      }`}>
                        {doc.priority}
                      </span>
                      <span className="text-[11px] text-slate-400">{doc.category}</span>
                    </div>
                  </div>

                  <h4 className="font-display font-bold text-slate-800 text-sm mb-2.5 leading-snug">
                    {doc.title}
                  </h4>

                  <div className="flex justify-between text-[11px] text-slate-400 pb-1 font-medium">
                    <span>Đơn vị gửi: {doc.senderAgency}</span>
                    <span>Hạn: {doc.aiAnalysis?.deadline || "Vô thời hạn"}</span>
                  </div>

                  {/* Nested detailed dossier with visual steps timeline */}
                  {selectedDocDetails?.id === doc.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 font-medium text-xs text-slate-700 space-y-4 bg-slate-50/50 p-4 rounded-xl">
                      
                      {/* File item */}
                      {doc.files && doc.files.length > 0 && (
                        <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-purple-600" />
                            <span>{doc.files[0].name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">({doc.files[0].size})</span>
                        </div>
                      )}

                      {/* Routes History timeline */}
                      <div className="space-y-3 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                        <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-purple-600">Nhật ký thụ kiểm luân chuyển:</h5>
                        {doc.routes && doc.routes.length > 0 ? (
                          doc.routes.map((route, rIdx) => (
                            <div key={rIdx} className="relative text-xs leading-relaxed">
                              <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white" />
                              <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                                <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                                  <span>Từ: <strong className="text-slate-600">{route.fromUser}</strong> ({route.fromTitle})</span>
                                  <span>{route.actionDate}</span>
                                </div>
                                <p className="text-slate-600 text-xs font-semibold">Ý kiến: {route.comment}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic text-[11px]">Chưa luân chuyển qua ban ngành khác.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  // --------------------------------------------------
  // 4. CITIZEN FEEDBACK (Tiếp công dân / Khiếu nại)
  // --------------------------------------------------
  const renderCitizenFeedbackScreen = () => {
    const [citizenInput, setCitizenInput] = React.useState("");
    const [scannedFeedback, setScannedFeedback] = React.useState<any>(null);
    const [processingFeedback, setProcessingFeedback] = React.useState(false);

    // Call OCR mock on submitted paper file scan
    const handleOcrFeedback = (e: React.FormEvent) => {
      e.preventDefault();
      if (!citizenInput.trim() || processingFeedback) return;

      setProcessingFeedback(true);
      setTimeout(() => {
        const parsedFeed: CitizenFeedback = {
          id: `F-OCR-${Date.now()}`,
          citizenName: "Bùi Văn Nam",
          phone: "0399.112.221",
          address: "Thôn Bắc, xã Hoàng Diệu",
          receivedDate: new Date().toISOString().split("T")[0],
          feedbackType: "Kiến nghị",
          title: "Khắc phục bãi rác tự phát bốc mùi gần trường mầm non Hoàng Diệu",
          content: citizenInput,
          status: "Đang phân loại"
        };
        setFeedbacks([parsedFeed, ...feedbacks]);
        setScannedFeedback(parsedFeed);
        setCitizenInput("");
        setProcessingFeedback(false);
        alert("Địa chính số hóa thành công đơn thư viết tay của công dân Bùi Văn Nam về bãi rác tự phát!");
      }, 1500);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] overflow-hidden">
          
          {/* LEFT: CITIZEN PAPER REGISTRATION FORM */}
          <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar max-h-[85vh]">
            <GlassCard className="p-4 flex flex-col gap-3">
              <h3 className="font-display font-semibold text-slate-800 text-xs border-b pb-1.5 uppercase flex items-center gap-1">
                <Sparkles size={14} className="text-purple-600" /> Tiếp nhận số hóa đơn viết tay của dân
              </h3>
              
              <form onSubmit={handleOcrFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tải tệp Scan đơn viết tay hoặc nhập nội dung biên chép</label>
                  <textarea
                    required
                    rows={4}
                    value={citizenInput}
                    onChange={(e) => setCitizenInput(e.target.value)}
                    placeholder="Ví dụ: Đơn kiến nghị của Bùi Văn Nam trú Thôn Bắc phản ánh bãi rác thải tự phát gây ô nhiễm nặng nề..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-purple-500 custom-scroll resize-none leading-normal h-28"
                  />
                </div>
                <GradientButton
                  size="sm"
                  variant="purple"
                  type="submit"
                  disabled={processingFeedback}
                  className="w-full"
                  icon={processingFeedback ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                >
                  {processingFeedback ? "Đang quét OCR..." : "OCR & Đăng ký bảo đơn tự động"}
                </GradientButton>
              </form>
            </GlassCard>

            {scannedFeedback && (
              <GlassCard className="p-4 border-l-4 border-purple-500 bg-purple-50/10">
                <h4 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                  <CheckCircle size={13} className="text-emerald-500" /> Báo cáo thực tế số hóa:
                </h4>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p><strong>Người dân:</strong> {scannedFeedback.citizenName}</p>
                  <p><strong>Điện thoại:</strong> {scannedFeedback.phone}</p>
                  <p><strong>Địa chỉ:</strong> {scannedFeedback.address}</p>
                  <p><strong>Trích loại đơn:</strong> {scannedFeedback.feedbackType}</p>
                </div>
              </GlassCard>
            )}
          </div>

          {/* RIGHT: REGISTERED DIRECTORY FEEDBACKS */}
          <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-1.5 custom-scroll h-full max-h-[85vh]">
            <GlassCard className="p-5">
              <h3 className="font-display font-semibold text-slate-800 text-sm mb-3">Sổ theo dõi thụ lý Đơn thư & Phản ánh (Zalo + Tiếp dân)</h3>
              <div className="space-y-3">
                {feedbacks.map((fed) => (
                  <div key={fed.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative hover:border-purple-300 transition-colors text-xs text-slate-700">
                    <div className="flex justify-between items-start gap-4 mb-1.5 flex-wrap">
                      <div>
                        <span className="font-bold text-slate-800 text-sm leading-snug">{fed.title}</span>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>Nộp bởi: <strong>{fed.citizenName}</strong></span>
                          <span>Đóng ngày: {fed.receivedDate}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        fed.status === "Đã giải quyết" ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {fed.status}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-normal mb-3">{fed.content}</p>

                    {fed.resolution && (
                      <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-[10px] italic text-emerald-700">
                        🛋 Kết luận: {fed.resolution}
                      </div>
                    )}

                    {fed.status === "Đang phân loại" && (
                      <div className="pt-2.5 border-t border-slate-200/80 flex justify-between items-center text-[10px] text-slate-400">
                        <span>Gán việc chuyên viên</span>
                        <GradientButton size="sm" variant="outline" className="py-0.5" onClick={() => {
                          setFeedbacks(prev => prev.map(f => f.id === fed.id ? { ...f, status: "Đã giao xử lý", assigneeName: "Bùi Thanh Hải (Tư pháp)" } : f));
                          alert("Đã gán tài liệu cho chuyên viên Bùi Thanh Hải thụ lý giải quyết!");
                        }}>
                          Chuyển Tư pháp hòa giải
                        </GradientButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 5. KANBAN WORKBOARD SCREEN (Quản lý công việc Kanban)
  // --------------------------------------------------
  const renderKanbanScreen = () => {
    // Group tasks by statuses
    const listTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

    const moveTaskStatus = (id: string, nextStatus: TaskStatus) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              status: nextStatus,
              completionPercent: nextStatus === TaskStatus.HOAN_THANH ? 100 : t.completionPercent,
              logs: [
                ...(t.logs || []),
                {
                  id: `L-${Date.now()}`,
                  action: `Di chuyển trạng thái sang [${nextStatus}]`,
                  updatedBy: currentUser.name,
                  timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            };
          }
          return t;
        })
      );
    };

    const statusColumns = [
      { id: TaskStatus.CHUA_PHAN_CONG, title: "Chưa phân công", color: "border-slate-300 bg-slate-50/50" },
      { id: TaskStatus.DANG_XU_LY, title: "Đang tiến hành", color: "border-purple-300 bg-purple-50/10" },
      { id: TaskStatus.SAP_DEN_HAN, title: "Sắp đến hạn", color: "border-amber-300 bg-amber-50/10" },
      { id: TaskStatus.QUA_HAN, title: "Quá trễ hạn", color: "border-rose-400 bg-rose-50/10 animate-pulse" },
      { id: TaskStatus.HOAN_THANH, title: "Đã hoàn thành", color: "border-emerald-300 bg-emerald-50/10" },
    ];

    return (
      <div className="space-y-4">
        {/* Kanban Board Layout columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 h-[78vh] align-stretch select-none no-scrollbar">
          {statusColumns.map((col) => {
            const list = listTasksByStatus(col.id);
            return (
              <div
                key={col.id}
                className={`p-3 rounded-2xl border flex flex-col h-full min-w-[220px] ${col.color}`}
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{col.title} ({list.length})</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                  {list.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-white border border-slate-200 hover:border-purple-300 rounded-xl shadow-xs hover:shadow transition-all text-xs"
                    >
                      <h5 className="font-bold text-slate-800 mb-1 leading-snug">{task.taskName}</h5>
                      <p className="text-[10px] text-slate-500 line-clamp-3 mb-2 leading-relaxed">{task.description}</p>
                      
                      <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100 font-mono text-slate-400">
                        <span className="font-bold text-slate-700">{task.assigneeName.split(" ").slice(-1)[0]}</span>
                        <span>Hạn: {task.deadline.substring(5)}</span>
                      </div>

                      {/* Manual mock column routing switcher */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                        <span>Chuyển mác:</span>
                        <div className="flex gap-1">
                          {col.id !== TaskStatus.DANG_XU_LY && (
                            <button onClick={() => moveTaskStatus(task.id, TaskStatus.DANG_XU_LY)} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold">Làm</button>
                          )}
                          {col.id !== TaskStatus.HOAN_THANH && (
                            <button onClick={() => moveTaskStatus(task.id, TaskStatus.HOAN_THANH)} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold">Xong</button>
                          )}
                          {col.id !== TaskStatus.CHUA_PHAN_CONG && col.id !== TaskStatus.HOAN_THANH && (
                            <button onClick={() => moveTaskStatus(task.id, TaskStatus.CHUA_PHAN_CONG)} className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 hover:bg-slate-100 font-bold">Hủy</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {list.length === 0 && (
                    <div className="text-center py-12 text-[10px] text-slate-400 font-medium">Bàn trống.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 6. DIGITAL SIGNATURE DESK (Ký số lãnh đạo)
  // --------------------------------------------------
  const renderDigitalSignatureDesk = () => {
    const toSignDocs = documents.filter((d) => d.status === DocumentStatus.CHO_KY_SO || (d.category === "Tờ trình" && !d.isSigned));
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 border-b pb-2 mb-4">
            <FileSignature className="text-purple-600 animate-pulse" size={18} />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Chữ Ký Số CA - Thẩm Quyền Lãnh Đạo</h3>
          </div>

          <div className="space-y-3">
            {toSignDocs.map((doc) => (
              <div key={doc.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl flex justify-between items-center hover:border-purple-200 transition-all text-xs">
                <div className="min-w-0 flex-1 mr-4">
                  <h4 className="font-bold text-slate-800 tracking-tight mb-1">{doc.title}</h4>
                  <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                    <span>Mẫu: {doc.category}</span>
                    <span>Tác vụ: Trình ký từ {doc.senderAgency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <GradientButton size="sm" variant="warning" onClick={() => handleSignatureAction(doc.id)} icon={<FileSignature size={12} />}>
                    Phê duyệt ký số công cộng
                  </GradientButton>
                </div>
              </div>
            ))}

            {toSignDocs.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không còn văn bản khẩn hay tờ trình chờ phác chữ ký số đợt này.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  };

  // --------------------------------------------------
  // 7. AI REPORTS CENTER (Soạn báo cáo AI)
  // --------------------------------------------------
  const [reportResult, setReportResult] = React.useState("");
  const [reportTitle, setReportTitle] = React.useState("Báo cáo tuần 4 tháng 5 năm 2026 về tình hình xử lý đê bồi và cải cách One-Door địa phương");
  const [reportLoading, setReportLoading] = React.useState(false);

  const renderAIReportsCenter = () => {
    const handleGenerateReport = async () => {
      setReportLoading(true);
      try {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Soạn tóm tắt báo cáo hành chính UBND xã Hoàng Diệu theo tiêu đề: "${reportTitle}". Hãy phân định rệt 3 chương mục: 1. Việc đã hoàn thành nổi bật tại bộ một cửa; 2. Những tồn đọng trễ hạn nguy hại bến bãi đai đập ven sông; 3. Ý kiến đề xuất bồi bổ lên Ủy ban huyện.`
          }),
        });
        const data = await response.json();
        setReportResult(data.text || "");
      } catch (err: any) {
        console.error(err);
        setReportResult(`Lỗi tạo báo cáo: ${err.message}`);
      } finally {
        setReportLoading(false);
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] overflow-hidden">
        
        {/* LEFT CONFIG */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar max-h-[85vh]">
          <GlassCard className="p-4 flex flex-col gap-3">
            <h3 className="font-display font-semibold text-slate-800 text-xs border-b pb-1.5 flex items-center gap-1">
              <Sparkles className="text-purple-600 animate-pulse" size={14} /> Trợ lý soạn thảo báo cáo nhanh
            </h3>
            <div className="space-y-3.5 text-xs text-slate-600 font-medium">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Tiêu đề báo cáo</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 outline-none focus:bg-white focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Chu kỳ báo cáo</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:bg-white focus:border-purple-500">
                    <option value="tuân">Báo cáo tuần</option>
                    <option value="thang">Báo cáo tháng</option>
                    <option value="quý">Báo cáo quý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Nơi nộp</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:bg-white focus:border-purple-500">
                    <option value="HĐND">UBND Huyện</option>
                    <option value="DangUy">Ban Thường vụ Đảng ủy</option>
                  </select>
                </div>
              </div>

              <GradientButton
                size="sm"
                variant="purple"
                disabled={reportLoading}
                onClick={handleGenerateReport}
                className="w-full"
                icon={reportLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              >
                {reportLoading ? "Hệ thống AI đang chiết dữ liệu..." : "Bắt đầu Kết xuất Báo cáo AI"}
              </GradientButton>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT PREVIEW SCRIPT */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden h-full">
          {reportResult ? (
            <div className="flex-1 bg-white border rounded-2xl p-6 overflow-y-auto shadow-inner relative custom-scroll leading-relaxed text-slate-800">
              <div className="text-right text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Báo cáo điều hành chuẩn hóa AI</div>
              <div className="space-y-1.5 prose max-w-none text-xs">
                {renderCustomMarkdown(reportResult)}
              </div>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <FileCheck2 size={36} className="text-slate-300 mb-1.5" />
              <h4 className="font-display font-medium text-slate-600 text-sm">Chưa có kết quả báo cáo</h4>
              <p className="text-[11px] max-w-xs leading-normal">
                Bấm vào nút kết xuất phía bên trái để AI định hình rà quét mọi chỉ tiêu kinh tế, văn bản sạt bồi trong tuần nộp lên UBND huyện.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 8. PERFORMANCE EVALUATION SCREEN (Đánh giá hiệu suất chuyên viên)
  // --------------------------------------------------
  const renderPerformanceEvaluation = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5 bg-purple-500/[0.04] border-purple-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Đánh giá Hiệu suất Cán bộ & Bộ phận Một Cửa</h3>
            <p className="text-xs text-slate-500">
              AI phân tích điểm nghẽn hành chính dựa trên tỷ lệ trễ hạn hồ sơ địa chính, tốc độ trả kết quả hòa giải tranh chấp ngõ xóm.
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-pulse">
            Chất lượng phục vụ: Tốt (92/100)
          </span>
        </GlassCard>

        {/* Visual responsive SVG graph performance comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-5">
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-4 border-b pb-2">📊 Biểu đồ Hiệu suất giải quyết công việc theo Chuyên viên (Phát hành)</h4>
            
            {/* Visual vector SVG chart representation without recharts */}
            <div className="h-64 flex items-end gap-6 px-4 pt-10 text-center relative font-medium text-slate-600">
              {/* grid dividers */}
              <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-300 w-full" />
                <div className="border-b border-dashed border-slate-300 w-full" />
                <div className="border-b border-dashed border-slate-300 w-full" />
              </div>

              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-8 md:w-12 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: "82%" }} />
                <span className="text-[10px] font-bold text-slate-800 mt-2">N.V.Đức</span>
                <span className="text-[9px] text-slate-400">ĐC: 82%</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-8 md:w-12 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-500" style={{ height: "95%" }} />
                <span className="text-[10px] font-bold text-slate-800 mt-2">B.T.Hải</span>
                <span className="text-[9px] text-slate-400">TP: 95%</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-8 md:w-12 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500" style={{ height: "60%" }} />
                <span className="text-[10px] font-bold text-slate-800 mt-2">P.T.Thúy</span>
                <span className="text-[9px] text-slate-400">TC: 60%</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-8 md:w-12 bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-lg transition-all duration-500" style={{ height: "70%" }} />
                <span className="text-[10px] font-bold text-slate-800 mt-2">N.T.Hà</span>
                <span className="text-[9px] text-slate-400">VP: 70%</span>
              </div>
            </div>
          </GlassCard>

          {/* AI Advisor for performance bottlenecks */}
          <GlassCard className="p-5 glass-card-purple flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles size={16} className="text-purple-600" />
                <h4 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider">AI Chỉ Nghẽn Hành Chính</h4>
              </div>
              <p className="text-xs text-slate-600 leading-normal mb-3">
                Bộ phận <strong>Tài chính - Tài sản</strong> đang tồn đọng 2 tờ trình xin ngân kỉ đắp mương do thiếu rà soát đo thực tế hiện trạng.
              </p>
              <p className="text-[11px] text-slate-500 italic block">
                Khuyến nghị: Chuyển giao Đội trật tự công cùng đi thực tế sớm để kích khoản đền bù.
              </p>
            </div>
            <GradientButton size="sm" variant="purple" onClick={() => setCurrentScreen("ai-assistant")} className="w-full">
              Xem báo cáo điều phối AI
            </GradientButton>
          </GlassCard>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 9. ALERTS & DEADLINES SCREEN (Cảnh báo và nhắc hạn)
  // --------------------------------------------------
  const renderAlertsScreen = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-4 bg-red-100/30 border-red-200">
          <div className="flex items-center gap-2 mb-1 text-red-700">
            <AlertTriangle className="animate-bounce" size={16} />
            <h3 className="font-display font-bold text-slate-800 text-sm">Hệ thống Cảnh báo Đôn Đốc Trễ Hạn dán mác</h3>
          </div>
          <p className="text-xs text-slate-500">Theo dõi vết công việc quá 3 ngày chưa trình giải trình hành chính xã Hoàng Diệu.</p>
        </GlassCard>

        <div className="space-y-3">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs text-slate-700 hover:shadow-xs transition-shadow ${
                al.type === "danger" 
                  ? "bg-red-50/50 border-red-200" 
                  : al.type === "warning"
                    ? "bg-amber-50/50 border-amber-200"
                    : "bg-blue-50/50 border-blue-200"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <AlertTriangle className={al.type === "danger" ? "text-red-500" : "text-amber-500"} size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{al.title}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{al.createdAt}</span>
                </div>
                <p className="text-slate-600 text-xs mb-2 leading-relaxed">{al.message}</p>
                <div className="flex gap-1">
                  <GradientButton size="sm" variant="outline" className="py-0.5 text-[9px]" onClick={() => {
                    alert("Đã gửi tin nhắn đôn khẩn lên điện thoại cán bộ!");
                  }}>
                    Tin nhắn Zalo hối thúc
                  </GradientButton>
                  <GradientButton size="sm" variant="outline" className="py-0.5 text-[9px] border-amber-300 text-amber-700" onClick={() => {
                    alert("Hồ sơ cảnh cáo đã được đẩy leo thang lên bàn điều hành Chủ tịch!");
                  }}>
                    Leo thang cảnh báo
                  </GradientButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // 10. AI CONFIG SCREEN (Cấu hình mẫu prompt AI)
  // --------------------------------------------------
  const renderAIConfigScreen = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-1.5 border-b pb-2 mb-4">
            <Sliders size={18} className="text-purple-600" />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Cấu hình Prompts & Mẫu Trí Tuệ Nhân Tạo</h3>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            alert("Mẫu prompt chỉ đạo điều hành hành lý đã được đồng bộ chuẩn mẫu và lưu mộc an toàn!");
          }} className="space-y-4 text-xs font-medium text-slate-600">
            <div>
              <label className="block text-slate-500 mb-1">Mô hình AI chủ trì</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-slate-700 font-semibold focus:bg-white focus:border-purple-500">
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Hiệu năng cao, phản hồi nhanh - Chuẩn)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Phân lý lý luận phức tạp, tốn thời gian hơn)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Prompt chỉ đạo Bút phê khuôn định (System Instructions)</label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 outline-none leading-normal focus:bg-white focus:border-purple-500 custom-scroll resize-none"
                defaultValue="Bạn là GovFlow AI, trợ lý số tối ưu hóa của Chủ tịch và Chánh Văn phòng UBND xã Hoàng Diệu, Thường Tín, Hà Nội. Hãy viết các bút phê ngắn gọn tầm 3 ý cụ thể, chỉ ra người dắt vai đôn đất, ban hành thời hạn nghiêm chỉnh."
              />
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3.5 border rounded-xl border-slate-100">
              <div>
                <strong className="text-slate-700 block">Tự động phân lớp Hồ sơ:</strong>
                <span className="text-[10px] text-slate-400">Cho phép AI tự động kích hoạt khảo sát tọa độ số, đề xuất luôn chuyên phụ trách lúc một cửa scan nhận tệp.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
            </div>

            <GradientButton size="sm" variant="purple" type="submit" className="w-full">
              Lưu Cấu Hình Mộc AI
            </GradientButton>
          </form>
        </GlassCard>
      </div>
    );
  };

  // --------------------------------------------------
  // 11. USER ADMIN PANEL (Quản trị Người dùng & Phân Quyền)
  // --------------------------------------------------
  const renderUserAdminPanel = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex justify-between items-center border-b pb-2 mb-4 flex-wrap gap-2">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Danh Mục Nhân Sự & Phân Quyền Vai Trò</h3>
            <GradientButton size="sm" variant="purple" onClick={() => alert("Giao diện nhập thêm vai trò đang được cài đặt trong cụm lưu trữ của Huyện.")} icon={<UserPlus size={14} />}>
              Thêm cán bộ mới
            </GradientButton>
          </div>

          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Chức danh / Thẩm quyền</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">Hòm thư</th>
                  <th className="p-3 text-right">Tình trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.title}</td>
                    <td className="p-3 text-slate-500 font-mono">{u.phone}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Đang hoạt động
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    );
  };

  // --------------------------------------------------
  // 12. AUDIT LOGS (Nhật ký Hệ thống)
  // --------------------------------------------------
  const renderSystemLogsTable = () => {
    return (
      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Nhật ký Truy vết Điều hành & An ninh</h3>
            <span className="text-[10px] text-slate-400 font-mono">Bảo mật chuẩn ISO 27001</span>
          </div>

          <div className="overflow-x-auto flex-1 custom-scroll">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Người tác lập</th>
                  <th className="p-3">Hành động tác vụ</th>
                  <th className="p-3">Chuyên mục</th>
                  <th className="p-3 text-right">Mạng IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-mono text-slate-500">
                {systemLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400 text-[11px] font-sans">{log.timestamp}</td>
                    <td className="p-3 text-slate-800 font-sans font-semibold">{log.user}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.action}</td>
                    <td className="p-3 text-slate-500 font-sans">{log.module}</td>
                    <td className="p-3 text-right text-[11px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    );
  };

  const renderMockComponentPlaceholder = (name: string) => (
    <div className="p-8 text-center text-slate-400">
      Đang tải dữ liệu của chuyên trang: [<strong>{name}</strong>]. Vui lòng chọn bàn làm việc hoặc các trợ lý AI thông minh ở thanh điều khiển trái.
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* SIDEBAR NAVIGATION UNIT */}
      <RoleBasedSidebar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentScreen={currentScreen}
        onScreenChange={(s) => {
          setCurrentScreen(s);
          setSelectedDocDetails(null);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* RIGHT WORKSPACE CONSOLE */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header bar with clock, profile and notifications panel button */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Phân hệ:</span>
            <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              {currentUser.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock UTC */}
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 md:flex hidden">
              <Clock size={12} className="text-slate-400" />
              <span>Hệ thống mạng: 127.0.0.1</span>
            </div>

            {/* Notification alert bell dropdown activator */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors relative cursor-pointer"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </button>

              {/* Notification Popup Dropdown overlay block */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2.5">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="font-bold text-slate-800 text-xs uppercase">Bàn nhắc hạn AI ({alerts.length})</span>
                    <button onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))} className="text-[10px] text-purple-600 font-bold hover:underline">
                      Đọc tất cả
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 custom-scroll">
                    {alerts.map((al) => (
                      <div key={al.id} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-[11px] leading-snug border border-slate-105">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <strong className={al.type === "danger" ? "text-red-600" : "text-amber-600"}>{al.title}</strong>
                          <span className="text-[8px] text-slate-400 font-mono">{al.createdAt.split(" ")[1]}</span>
                        </div>
                        <p className="text-slate-600 font-medium">{al.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MASTER SCREEN ROUTER CONTAINER FRAME */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scroll relative">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
