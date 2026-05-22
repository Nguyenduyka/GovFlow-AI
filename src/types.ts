/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CHUTICH = "CHUTICH",             // Chủ tịch UBND xã
  PHOCHUTICH = "PHOCHUTICH",       // Phó Chủ tịch UBND xã
  CHANHVANPHONG = "CHANHVANPHONG", // Chánh Văn phòng
  TRUONGPHONG = "TRUONGPHONG",     // Trưởng phòng / Trưởng bộ phận
  GIAMDOC = "GIAMDOC",             // Giám đốc đơn vị/Trung tâm
  VANTHUDEN = "VANTHUDEN",         // Văn thư đến
  VANTHUDI = "VANTHUDI",           // Văn thư đi
  CHUYENVIEN = "CHUYENVIEN",       // Chuyên viên / Viên chức
  ADMIN = "ADMIN"                  // Quản trị hệ thống
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  phone: string;
  email: string;
  avatarColor: string;
}

export enum DocumentStatus {
  MOI_TIEP_NHAN = "MOI_TIEP_NHAN",
  CHO_PHAN_TICH = "CHO_PHAN_TICH",
  DA_PHAN_TICH = "DA_PHAN_TICH",
  CHO_LANH_DAO_DUYET = "CHO_LANH_DAO_DUYET",
  DANG_XULY = "DANG_XULY",
  DA_HOAN_THANH = "DA_HOAN_THANH",
  CHO_KY_SO = "CHO_KY_SO",
  CHO_PHAT_HANH = "CHO_PHAT_HANH",
  DA_PHAT_HANH = "DA_PHAT_HANH",
  TRA_LAI = "TRA_LAI"
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface DocumentRoute {
  fromUser: string;
  fromTitle: string;
  toUser: string;
  toTitle: string;
  actionDate: string;
  comment: string;
  status: string;
}

export interface DocumentAIAnalysis {
  summary: string;
  department: string;
  assignee: string;
  cooperators: string[];
  priority: string;
  deadline: string;
  riskAssessment: string;
  legalBasis: string;
  recommendedAction: string;
  confidence: number;
}

export interface Document {
  id: string;
  docNumber: string;
  incomingNumber?: string;
  title: string;
  senderAgency: string;
  receivedDate: string;
  docDate: string;
  priority: "Thường" | "Khẩn" | "Thượng khẩn" | "Hỏa tốc";
  status: DocumentStatus;
  category: string; // "Nghị quyết", "Quyết định", "Công văn", "Tờ trình", "Báo cáo", "Kế hoạch", "Thông báo", "Giấy mời", "Biên bản"
  files: DocumentFile[];
  routes: DocumentRoute[];
  aiAnalysis?: DocumentAIAnalysis;
  isSigned?: boolean;
}

export enum TaskStatus {
  MOI = "MOI",
  CHUA_PHAN_CONG = "CHUA_PHAN_CONG",
  DANG_XU_LY = "DANG_XU_LY",
  SAP_DEN_HAN = "SAP_DEN_HAN",
  QUA_HAN = "QUA_HAN",
  HOAN_THANH = "HOAN_THANH"
}

export interface TaskLog {
  id: string;
  action: string;
  updatedBy: string;
  timestamp: string;
  notes?: string;
}

export interface TaskComment {
  id: string;
  author: string;
  authorTitle: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  documentId?: string;
  taskName: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  creatorName: string;
  cooperators: string[];
  startDate: string;
  deadline: string;
  status: TaskStatus;
  priority: "Thường" | "Khẩn" | "Hỏa tốc";
  completionPercent: number;
  comments: TaskComment[];
  logs: TaskLog[];
  solutionDraft?: string;
  attachments: string[];
  explanation?: string; // Giải trình trễ hạn
}

export interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  targetRole: UserRole;
  createdAt: string;
  isRead: boolean;
  relatedDocId?: string;
  relatedTaskId?: string;
}

export interface CitizenFeedback {
  id: string;
  citizenName: string;
  phone: string;
  address: string;
  receivedDate: string;
  feedbackType: "Khiếu nại" | "Tố cáo" | "Kiến nghị" | "Phản ánh";
  title: string;
  content: string;
  scannedImageUrl?: string;
  status: "Đang phân loại" | "Đã giao xử lý" | "Đã giải quyết" | "Đã lưu hồ sơ";
  assigneeName?: string;
  resolution?: string;
}

export interface SocioEconomicIndicator {
  id: string;
  name: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  percentCompleted: number;
  status: "Đạt tiến độ" | "Cần đôn đốc" | "Nguy cơ chậm chỉ tiêu";
  history: { period: string; value: number }[];
}

export interface GeoProject {
  id: string;
  name: string;
  type: "Công trình" | "Dự án" | "Thiên tai" | "Phản ánh";
  latitude: number;
  longitude: number;
  status: "Đang thi công" | "Chuẩn bị đầu tư" | "Cảnh báo khẩn" | "Đang giải quyết" | "Đã xử lý";
  description: string;
  relatedTask?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  role: UserRole;
  durationDays: number;
  isNotificationSent: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  steps: WorkflowStep[];
}

export interface SystemSetting {
  geminiModel: string;
  systemInstruction: string;
  autoProcessWithAi: boolean;
  ocrLanguage: "vi" | "en";
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  status: "Thành công" | "Lỗi";
}
