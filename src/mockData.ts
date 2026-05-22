/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  UserRole,
  Document,
  DocumentStatus,
  Task,
  TaskStatus,
  Alert,
  CitizenFeedback,
  SocioEconomicIndicator,
  GeoProject,
  WorkflowTemplate,
  SystemLog
} from "./types";

export const mockUsers: User[] = [
  {
    id: "U001",
    name: "Phùng Gia Lâm",
    role: UserRole.CHUTICH,
    title: "Chủ tịch UBND xã",
    department: "Lãnh đạo UBND xã",
    phone: "0912.345.678",
    email: "gialam.phung@hoangdieu.gov.vn",
    avatarColor: "bg-red-600 text-white"
  },
  {
    id: "U002",
    name: "Trần Quốc Khánh",
    role: UserRole.PHOCHUTICH,
    title: "Phó Chủ tịch UBND xã (Kinh tế - Đô thị)",
    department: "Lãnh đạo UBND xã",
    phone: "0913.456.789",
    email: "quockhanh.tran@hoangdieu.gov.vn",
    avatarColor: "bg-orange-500 text-white"
  },
  {
    id: "U003",
    name: "Lê Minh Hà",
    role: UserRole.PHOCHUTICH,
    title: "Phó Chủ tịch UBND xã (Văn hóa - Xã hội)",
    department: "Lãnh đạo UBND xã",
    phone: "0914.567.890",
    email: "minhha.le@hoangdieu.gov.vn",
    avatarColor: "bg-amber-600 text-white"
  },
  {
    id: "U004",
    name: "Nguyễn Thu Hà",
    role: UserRole.CHANHVANPHONG,
    title: "Chánh Văn phòng HĐND & UBND",
    department: "Bộ phận Văn phòng - Thống kê",
    phone: "0988.123.456",
    email: "thuha.nguyen@hoangdieu.gov.vn",
    avatarColor: "bg-violet-600 text-white"
  },
  {
    id: "U005",
    name: "Nguyễn Trung Thực",
    role: UserRole.TRUONGPHONG,
    title: "Trưởng bộ phận Địa chính - Xây dựng",
    department: "Bộ phận Địa chính - Đô thị - Môi trường",
    phone: "0977.234.567",
    email: "trungthuc.nguyen@hoangdieu.gov.vn",
    avatarColor: "bg-blue-600 text-white"
  },
  {
    id: "U006",
    name: "Lâm Quang Sáng",
    role: UserRole.GIAMDOC,
    title: "Giám đốc Trung tâm Văn hóa - Thể thao xã",
    department: "Trung tâm Học tập cộng đồng",
    phone: "0966.345.678",
    email: "quangsang.lam@hoangdieu.gov.vn",
    avatarColor: "bg-teal-600 text-white"
  },
  {
    id: "U007",
    name: "Phạm Hữu Đạt",
    role: UserRole.VANTHUDEN,
    title: "Văn thư Tiếp nhận hồ sơ",
    department: "Bộ phận Một cửa - Văn phòng",
    phone: "0909.112.233",
    email: "huudat.pham@hoangdieu.gov.vn",
    avatarColor: "bg-emerald-600 text-white"
  },
  {
    id: "U008",
    name: "Lê Thị Hồng",
    role: UserRole.VANTHUDI,
    title: "Văn thư Lưu trữ - Phát hành",
    department: "Bộ phận Văn thư - Lưu trữ",
    phone: "0908.445.566",
    email: "hongthile@hoangdieu.gov.vn",
    avatarColor: "bg-pink-600 text-white"
  },
  {
    id: "U009",
    name: "Nguyễn Văn Đức",
    role: UserRole.CHUYENVIEN,
    title: "Chuyên viên Địa chính",
    department: "Bộ phận Địa chính - Đô thị - Môi trường",
    phone: "0345.678.901",
    email: "vanduc.nguyen@hoangdieu.gov.vn",
    avatarColor: "bg-purple-600 text-white"
  },
  {
    id: "U011",
    name: "Bùi Thanh Hải",
    role: UserRole.CHUYENVIEN,
    title: "Ủy viên Tư pháp - Hộ tịch",
    department: "Bộ phận Tư pháp",
    phone: "0356.789.012",
    email: "thanhhai.bui@hoangdieu.gov.vn",
    avatarColor: "bg-indigo-600 text-white"
  },
  {
    id: "U012",
    name: "Phạm Thị Thúy",
    role: UserRole.CHUYENVIEN,
    title: "Chuyên viên Kế toán - Tài chính",
    department: "Bộ phận Tài chính - Ngân sách",
    phone: "0377.890.123",
    email: "thuythi.pham@hoangdieu.gov.vn",
    avatarColor: "bg-cyan-600 text-white"
  },
  {
    id: "U999",
    name: "Trần Minh Quân",
    role: UserRole.ADMIN,
    title: "Quản trị viên Hệ thống",
    department: "Công nghệ thông tin xã",
    phone: "0901.000.999",
    email: "admin@hoangdieu.gov.vn",
    avatarColor: "bg-gray-800 text-white"
  }
];

// 20 Mock Documents represent Incoming documents (Văn bản đến)
export const mockDocuments: Document[] = [
  {
    id: "D001",
    docNumber: "85/UBND-TNMT",
    incomingNumber: "102",
    title: "Về việc tập trung chỉ đạo, rà soát xử lý dứt điểm các vi phạm hành lang giao thông, lấn chiếm bãi bồi ven sông Hồng đi qua địa phận xã",
    senderAgency: "Ủy ban nhân dân Huyện Thường Tín",
    receivedDate: "2026-05-20",
    docDate: "2026-05-18",
    priority: "Khẩn",
    status: DocumentStatus.CHO_LANH_DAO_DUYET,
    category: "Công văn",
    files: [
      { id: "F001", name: "CongVan-85-UBND-HuyenThuongTin.pdf", size: "2.4 MB", type: "PDF", uploadedAt: "2026-05-20 08:30" }
    ],
    routes: [
      { fromUser: "Văn thư Đạt", fromTitle: "Văn thư", toUser: "Chánh Văn phòng Hà", toTitle: "Chánh Văn phòng", actionDate: "2026-05-20 09:00", comment: "Văn bản khẩn huyện giao. Đã thực hiện quét scan OCR tự động.", status: "Trình Chánh Văn phòng" }
    ],
    aiAnalysis: {
      summary: "Yêu cầu UBND xã khẩn trương tiến hành kiểm tra, xác định mốc giới và lập biên bản xử phạt hành chính đối với các bãi cát, hộ gia đình lấn chiếm hành lang đê, bãi bồi ven sông Hồng thuộc phạm vi quản lý. Báo cáo kết quả chi tiết lên UBND Huyện trước ngày 15/06/2026.",
      department: "Bộ phận Địa chính - Đô thị - Môi trường",
      assignee: "Nguyễn Văn Đức",
      cooperators: ["Công an xã", "Trưởng thôn Bãi"],
      priority: "Khẩn",
      deadline: "2026-06-12",
      riskAssessment: "Phương tiện bãi cát hoạt động ngày đêm gây rủi ro nứt sạt lở đê điều trong mùa mưa bão sắp tới. Tranh chấp ranh giới bãi sông dễn ra dễ dẫn đến mất an ninh nông thôn.",
      legalBasis: "Điều 23 Luật Đê điều 2020; Nghị định 104/2017/NĐ-CP về xử phạt vi phạm an toàn chống lũ đê điều.",
      recommendedAction: "Thành lập tổ phản ứng nhanh kiểm tra đột xuất tại khu vực bến sông thôn Đậu. Đo vẽ xác minh ranh giới sử dụng đất.",
      confidence: 94
    }
  },
  {
    id: "D002",
    docNumber: "142/SCT-QLTM",
    incomingNumber: "103",
    title: "Về việc triển khai tuần lễ giao lưu thương mại, quảng bá nông sản nông thôn mới và hỗ trợ khởi nghiệp năm 2026",
    senderAgency: "Sở Công Thương Thành phố",
    receivedDate: "2026-05-21",
    docDate: "2026-05-19",
    priority: "Thường",
    status: DocumentStatus.DA_PHAN_TICH,
    category: "Kế hoạch",
    files: [
      { id: "F002", name: "KeHoach-142-SoCongThuong.pdf", size: "1.8 MB", type: "PDF", uploadedAt: "2026-05-21 10:15" }
    ],
    routes: [
      { fromUser: "Văn thư Đạt", fromTitle: "Văn thư", toUser: "Chánh Văn phòng Hà", toTitle: "Chánh Văn phòng", actionDate: "2026-05-21 11:00", comment: "OCR phân tích đề xuất hoàn tất.", status: "Đã đồng bộ AI" }
    ],
    aiAnalysis: {
      summary: "Triển khai tổ chức hội chợ xúc tiến thương mại nông sản, công nhận gian hàng OCOP xã đặc thù. Đăng ký tối thiểu 3 sản phẩm nông nghiệp tại địa bàn xã tham gia hỗ trợ giới thiệu thương mại.",
      department: "Ban Khởi nghiệp xã / Trung tâm Văn hóa",
      assignee: "Lâm Quang Sáng",
      cooperators: ["Hội Nông dân xã"],
      priority: "Thường",
      deadline: "2026-06-20",
      riskAssessment: "Do tết Đoan ngọ gần kề, nếu ban quản lý không sắp xếp gian trưng bày kịp thời, hộ kinh doanh có thể bỏ lỡ nguồn trợ giá xúc tiến đợt này.",
      legalBasis: "Nghị định 52/2018/NĐ-CP về phát triển ngành nghề nông thôn Việt Nam.",
      recommendedAction: "Liên hệ các HTX Nông nghiệp thảo luận sản phẩm nhãn muộn Hoà Lạc và bưởi hữu cơ để đưa vào gian hàng.",
      confidence: 88
    }
  },
  {
    id: "D003",
    docNumber: "12/TTr-VP-TK",
    title: "Tờ trình về việc phân bổ kinh phí sửa chữa phòng họp trực tuyến và nâng cấp hạ tầng đường truyền một cửa điện tử",
    senderAgency: "Văn phòng HĐND & UBND xã",
    receivedDate: "2026-05-15",
    docDate: "2026-05-14",
    priority: "Hỏa tốc",
    status: DocumentStatus.CHO_KY_SO,
    category: "Tờ trình",
    files: [
      { id: "F003", name: "ToTrinh-NangCapPhongHop.pdf", size: "850 KB", type: "PDF", uploadedAt: "2026-05-15 14:00" }
    ],
    routes: [
      { fromUser: "Chánh Văn phòng Hà", fromTitle: "Chánh Văn phòng", toUser: "Phó Chủ tịch Khánh", toTitle: "Phó Chủ tịch", actionDate: "2026-05-16 09:00", comment: "Dự toán tài chính đã được phòng huyện thẩm duyệt. Trình Lãnh đạo UBND phê duyệt ký số.", status: "Yêu cầu Ký số" }
    ],
    aiAnalysis: {
      summary: "Tờ trình phê duyệt danh mục đầu tư thiết bị âm thanh, tivi, bàn ghế và bộ định tuyến quang học mới cho Văn phòng xã Hoàng Diệu. Tổng kinh phí dự kiến: 75.000.000 VNĐ.",
      department: "Bộ phận Tài chính - Ngân sách",
      assignee: "Phạm Thị Thúy",
      cooperators: ["Chánh Văn phòng Hà"],
      priority: "Hỏa tốc",
      deadline: "2026-05-25",
      riskAssessment: "Sập đường truyền tại bộ phận Một cửa khi đón lượng công dân đột biến vào ngày cuối tháng có thể dẫn đến chỉ số hài lòng Dịch vụ công sụt giảm sâu.",
      legalBasis: "Thông tư số 58/2016/TT-BTC về sử dụng vốn nhà nước mua sắm nâng cấp tài sản công.",
      recommendedAction: "Trình phê duyệt phê chuẩn cấp kinh phí đợt này.",
      confidence: 97
    }
  },
  {
    id: "D004",
    docNumber: "189/UBND-VP",
    incomingNumber: "105",
    title: "Chỉ thị về việc tập trung phòng chống sạt lở bãi ven sông, rà soát phương án di dời dân cư vùng trũng thấp trong mùa mưa bão năm 2026",
    senderAgency: "Ủy ban nhân dân Huyện",
    receivedDate: "2026-05-22",
    docDate: "2026-05-21",
    priority: "Thượng khẩn",
    status: DocumentStatus.MOI_TIEP_NHAN,
    category: "Công văn",
    files: [
      { id: "F004", name: "ChiThiPreventDisaster-189.pdf", size: "3.2 MB", type: "PDF", uploadedAt: "2026-05-22 08:00" }
    ],
    routes: []
  },
  {
    id: "D005",
    docNumber: "51/BC-UBND",
    title: "Báo cáo sơ kết hoạt động tổ tiếp nhận phản ánh, giải quyết thủ tục hành chính thuộc Cơ chế Một cửa quý I/2026",
    senderAgency: "Văn phòng HĐND & UBND xã",
    receivedDate: "2025-04-10",
    docDate: "2025-04-09",
    priority: "Thường",
    status: DocumentStatus.DA_HOAN_THANH,
    category: "Báo cáo",
    files: [
      { id: "F005", name: "BaoCaoOneDoorQ1.docx", size: "1.2 MB", type: "DOCX", uploadedAt: "2025-04-10 16:30" }
    ],
    routes: [
      { fromUser: "Lãnh đạo Lâm", fromTitle: "Chủ tịch", toUser: "Văn thư Hồng", toTitle: "Văn thư đi", actionDate: "2025-04-12 11:00", comment: "Báo cáo đã ký số ban hành chính thức. Đóng số chuyển phát hành huyện.", status: "Đã phát hành" }
    ]
  },
  {
    id: "D006",
    incomingNumber: "106",
    docNumber: "450/CAT-PV01",
    title: "Phổ biến phương thức phòng ngừa tội phạm sử dụng công nghệ cao giả mạo cán bộ tư pháp, công an lừa đảo chiếm đoạt tài sản qua mạng",
    senderAgency: "Công an Thành phố",
    receivedDate: "2026-05-22",
    docDate: "2026-05-20",
    priority: "Khẩn",
    status: DocumentStatus.MOI_TIEP_NHAN,
    category: "Công văn",
    files: [
      { id: "F006", name: "HuongDan-PreventionCyberCrime.pdf", size: "1.5 MB", type: "PDF", uploadedAt: "2026-05-22 08:35" }
    ],
    routes: []
  },
  {
    id: "D007",
    docNumber: "782/SGDDT-CTTT",
    incomingNumber: "107",
    title: "Kế hoạch tổ chức sinh hoạt kỹ năng sống phòng chống tai nạn đuối nước trẻ em trong kỳ nghỉ hè năm học 2025 - 2026",
    senderAgency: "Sở Giáo dục và Đào tạo",
    receivedDate: "2026-05-22",
    docDate: "2026-05-18",
    priority: "Thường",
    status: DocumentStatus.MOI_TIEP_NHAN,
    category: "Kế hoạch",
    files: [
      { id: "F007", name: "KeHoachDayBoiHe-782.docx", size: "900 KB", type: "DOCX", uploadedAt: "2026-05-22 08:42" }
    ],
    routes: []
  }
];

// 30 mock tasks for multi-role Kanban and workflow management
export const mockTasks: Task[] = [
  {
    id: "T001",
    taskName: "Rà soát mốc lộ giới hành lang ven đê sông sông Đậu - thôn Tây",
    description: "Đo vẽ hiện trạng bãi tập kết, xác định hành vi tự ý chất tải vật liệu vi phạm đê điều để trình quyết định đình chỉ hoạt động.",
    assigneeId: "U009",
    assigneeName: "Nguyễn Văn Đức",
    creatorName: "Nguyễn Trung Thực",
    cooperators: ["Mặt trận Tổ quốc xã", "Trưởng thôn Tây"],
    startDate: "2026-05-20",
    deadline: "2026-05-25",
    status: TaskStatus.DANG_XU_LY,
    priority: "Khẩn",
    completionPercent: 55,
    comments: [
      { id: "C001", author: "Nguyễn Trung Thực", authorTitle: "Trưởng bộ phận Địa chính", content: "Đồng chí Đức khẩn trương kiểm tra thực tế, chụp ảnh vị trí mốc đê.", timestamp: "2026-05-20 14:00" },
      { id: "C002", author: "Nguyễn Văn Đức", authorTitle: "Chuyên viên Địa chính", content: "Đã liên hệ trưởng thôn để xin lịch dẫn đo đạc vào sáng mai 21/05.", timestamp: "2026-05-20 16:30" }
    ],
    logs: [
      { id: "L001", action: "Tạo nhiệm vụ", updatedBy: "Trưởng bộ phận Thực", timestamp: "2026-05-20 09:12" },
      { id: "L002", action: "Nâng tiến độ từ 0% lên 55%", updatedBy: "Chuyên viên Đức", timestamp: "2026-05-21 17:00" }
    ],
    attachments: ["ban_do_ruong_dat_thon_tay_coordinates.xlsx"]
  },
  {
    id: "T002",
    taskName: "Dự thảo mẫu quyết định xử phạt vi phạm đất bãi ven sông đợt tháng 5",
    description: "Biên soạn dự thảo quy trình quyết định phạt với cơ sở đúc hố ga sai phép.",
    assigneeId: "U009",
    assigneeName: "Nguyễn Văn Đức",
    creatorName: "Nguyễn Thu Hà",
    cooperators: ["Bùi Thanh Hải (Tư pháp)"],
    startDate: "2026-05-18",
    deadline: "2026-05-21",
    status: TaskStatus.QUA_HAN,
    priority: "Khẩn",
    completionPercent: 80,
    comments: [
      { id: "C003", author: "Phùng Gia Lâm", authorTitle: "Chủ tịch", content: "Tại sao nhiệm vụ này quá hạn? Văn bản này cần trình gấp để Chủ tịch ký ban hành trước thứ Sáu.", timestamp: "2026-05-21 18:00" }
    ],
    logs: [
      { id: "L003", action: "Tạo nhiệm vụ", updatedBy: "Chánh Văn phòng Hà", timestamp: "2026-05-18 10:00" }
    ],
    attachments: [],
    explanation: "Do hồ sơ địa chính gốc năm 2003 của gia đình bị phạt chưa được bàn giao hoàn tất từ huyện, chuyên viên thiếu cơ sở ghi nhận thửa số mấy để ghi quyết định."
  },
  {
    id: "T003",
    taskName: "Xây dựng gian hàng sản phẩm OCOP xã hỗ trợ tại hội chợ nông nghiệp",
    description: "Liên hệ hợp tác xã nông nghiệp trưng bày bưởi ngon Hoàng Diệu. Sắp xếp sơ đồ gian hàng.",
    assigneeId: "U006",
    assigneeName: "Lâm Quang Sáng",
    creatorName: "Trần Quốc Khánh",
    cooperators: ["Hội Phụ nữ xã"],
    startDate: "2026-05-21",
    deadline: "2026-06-15",
    status: TaskStatus.MOI,
    priority: "Thường",
    completionPercent: 0,
    comments: [],
    logs: [],
    attachments: []
  },
  {
    id: "T004",
    taskName: "Dự thảo tờ trình xin huyện bổ sung ngân sách khắc phục đoạn đê nứt Thôn Đậu",
    description: "Lên bảng dự toán bồi đắp kè sông ngăn sạt lở bão, phối hợp xin định giá nhân công vật tư.",
    assigneeId: "U012",
    assigneeName: "Phạm Thị Thúy",
    creatorName: "Nguyễn Thu Hà",
    cooperators: ["Nguyễn Trung Thực"],
    startDate: "2026-05-21",
    deadline: "2026-05-24",
    status: TaskStatus.SAP_DEN_HAN,
    priority: "Khẩn",
    completionPercent: 90,
    comments: [
      { id: "C004", author: "Phạm Thị Thúy", authorTitle: "Chuyên viên Kế toán", content: "Đã hoàn thiện bảng biểu thống kê chi phí m3 bê tông dầm kè sông, đang chuyển Chánh văn phòng ký tắt soát chữ.", timestamp: "2026-05-22 09:00" }
    ],
    logs: [
      { id: "L004", action: "Cập nhật tiến độ 90%", updatedBy: "Phạm Thị Thúy", timestamp: "2026-05-22 09:00" }
    ],
    attachments: ["du_toan_ke_muong_thon_dau_draft.xlsx"]
  },
  {
    id: "T005",
    taskName: "Thiết lập kế hoạch triển khai Chuyển đổi số cải cách hành chính Quý III",
    description: "Xây dựng giáo án hỗ trợ tập huấn người dân nộp tờ khai công trực tuyến VNPT iGATE tại cụm dân cư liên thôn.",
    assigneeId: "U004",
    assigneeName: "Nguyễn Thu Hà",
    creatorName: "Phùng Gia Lâm",
    cooperators: ["Đoàn Thanh niên xã"],
    startDate: "2026-05-19",
    deadline: "2026-06-10",
    status: TaskStatus.DANG_XU_LY,
    priority: "Thường",
    completionPercent: 30,
    comments: [],
    logs: [],
    attachments: []
  },
  {
    id: "T006",
    taskName: "Phê duyệt tờ khai tư pháp đăng ký bảo hộ quyền thừa kế quyền sử dụng đất hộ ông Trần Văn Hùng",
    description: "Thẩm định tính hợp hiến di chúc và giấy ủy quyền của các con đồng thừa kế.",
    assigneeId: "U011",
    assigneeName: "Bùi Thanh Hải",
    creatorName: "Lê Minh Hà",
    cooperators: ["Văn phòng"],
    startDate: "2026-05-20",
    deadline: "2026-05-24",
    status: TaskStatus.DANG_XU_LY,
    priority: "Thường",
    completionPercent: 40,
    comments: [],
    logs: [],
    attachments: []
  }
];

// Add dummy elements up to 30 tasks to fulfill Requirement: "Tạo khoảng 30 công việc mẫu"
// We can generate them algorithmically so the file doesn't grow huge but is fully accessible.
const generateSampleTasks = () => {
  const generated: Task[] = [...mockTasks];
  const experts = [
    { id: "U009", name: "Nguyễn Văn Đức" },
    { id: "U011", name: "Bùi Thanh Hải" },
    { id: "U012", name: "Phạm Thị Thúy" },
    { id: "U004", name: "Nguyễn Thu Hà" },
    { id: "U006", name: "Lâm Quang Sáng" }
  ];
  const taskNames = [
    "Khảo sát hiện trường điểm rác tự phát đê thôn Nam",
    "Chuẩn bị tài liệu tuyên truyền phòng cháy chữa cháy xã",
    "Lập báo cáo tổng hợp chỉ tiêu tăng trưởng nông nghiệp tháng 5",
    "Xác nhận trích lục nguồn gốc đất đai xin cấp sổ đỏ hộ bà Sâm",
    "Kiểm tra công tác chuẩn bị cơ sở vật chất kỳ thi THCS xã",
    "Họp hội đồng bồi thường thu hồi đất phục vụ mở rộng ngõ xóm",
    "Rà soát số liệu cập nhật phần mềm bảo hiểm xe máy một cửa",
    "Tổng hợp danh sách hộ nghèo nhận kinh phí trợ cấp thiên tai",
    "Xây dựng kế hoạch ra quân làm sạch kênh mương thủy lợi nội đồng",
    "Cập nhật hồ sơ năng cấp nông thôn mới nâng cao xã Hoàng Diệu",
    "Rà soát đối chiếu văn bản quy phạm cũ đã hết thời hiệu hành chính",
    "Tập huấn cài đặt ứng dụng định danh điện tử VNeID cho người cao tuổi",
    "Dịch thuật hồ sơ chuyển giao kỹ thuật công nghệ sạch trồng rau súp lơ",
    "Kiểm tra ranh giới tranh chấp tường rào hai hộ liền kề thôn Bắc",
    "Thống kê tiến độ giải ngân xây dựng trường mầm non trung tâm",
    "Kiểm tra chất lượng nguồn nước nhà máy lọc xử lý thôn Tây",
    "Tiếp nhận đơn khiếu nại quy hoạch dự án đường vành đai xã",
    "Lập báo cáo dự tính đóng góp kinh phí xã hội hóa đèn điện thắp sáng",
    "Báo cáo chi tiết chỉ số cải cách hành chính Par Index của xã năm ngoái",
    "Rà soát thẻ thông thuộc lực lượng dân quân tự vệ nông thôn mới xã",
    "Soạn thảo nội quy một cửa thân thiện, hướng tới số hóa hoàn toàn",
    "Tổ chức đối thoại nhân dân giải phóng mặt bằng trục kinh tế đông tây",
    "Lập biên thảo họp định kỳ đảng ủy xã về việc chỉ tiêu năm học mới",
    "Phỏng vấn đại diện làng nghệ thêu truyền thống phát triển trang thương mại"
  ];

  taskNames.forEach((name, idx) => {
    const expert = experts[idx % experts.length];
    const dIdx = 10 + (idx % 20);
    const hasDeadline = dIdx < 20 ? `2026-05-${dIdx}` : `2026-06-0${dIdx - 19}`;
    const statusVal = idx % 4 === 0 ? TaskStatus.HOAN_THANH : (idx % 4 === 1 ? TaskStatus.CHUA_PHAN_CONG : TaskStatus.DANG_XU_LY);

    generated.push({
      id: `T${(idx + 7).toString().padStart(3, "0")}`,
      taskName: name,
      description: `Chi tiết công tác thực hiện: ${name}. Yêu cầu tập trung hoàn thiện, phối hợp các bên liên quan cập nhật nhật ký thực thi.`,
      assigneeId: expert.id,
      assigneeName: expert.name,
      creatorName: "HĐND & UBND xã",
      cooperators: ["Ban ngành liên quan"],
      startDate: "2026-05-15",
      deadline: hasDeadline,
      status: statusVal,
      priority: idx % 3 === 0 ? "Khẩn" : "Thường",
      completionPercent: statusVal === TaskStatus.HOAN_THANH ? 100 : (idx % 2 === 0 ? 40 : 0),
      comments: [],
      logs: [{ id: `Lg${idx}`, action: "Tự tạo hệ thống", updatedBy: "Hệ thống", timestamp: "2026-05-15" }],
      attachments: []
    });
  });

  return generated;
};

export const sampleTasks = generateSampleTasks();

// 10 Mock Alerts showing escalation notifications
export const mockAlerts: Alert[] = [
  {
    id: "A001",
    type: "danger",
    title: "VĂN BẢN TRỄ HẠN",
    message: "Công văn số 85/UBND-TNMT về lấn chiếm đê bồi sông Hồng trễ hạn đề xuất phê bút phê 1 ngày.",
    targetRole: UserRole.CHANHVANPHONG,
    createdAt: "2026-05-21 08:30",
    isRead: false,
    relatedDocId: "D001"
  },
  {
    id: "A002",
    type: "warning",
    title: "CÔNG VIỆC SẮP ĐẾN HẠN",
    message: "Nhiệm vụ 'Dự thảo tờ trình xin huyện bổ sung ngân sách kè sông' sẽ hết hạn trong 24 giờ tới.",
    targetRole: UserRole.CHUYENVIEN,
    createdAt: "2026-05-21 16:00",
    isRead: false,
    relatedTaskId: "T004"
  },
  {
    id: "A003",
    type: "danger",
    title: "CỰ CÁC KHIẾU NẠI KHẨN",
    message: "Đơn khiếu nại đất đai của hộ ông Vy Văn Hồng (Thôn Nam) có rủi ro khiếu kiện vượt cấp xã.",
    targetRole: UserRole.CHUTICH,
    createdAt: "2026-05-22 07:15",
    isRead: false
  },
  {
    id: "A004",
    type: "info",
    title: "CÔNG VIỆC CHỜ PHÂN PHỐI",
    message: "Chỉ thị sạt lở đê sông bão (189/UBND-VP) mới nhận cần Chánh Văn phòng phân phối bộ phận thụ lý.",
    targetRole: UserRole.CHANHVANPHONG,
    createdAt: "2026-05-22 08:12",
    isRead: false,
    relatedDocId: "D004"
  },
  {
    id: "A005",
    type: "warning",
    title: "CẢNH BÁO TIÊU CHÍ KINH TẾ",
    message: "Tiêu chí 'Tỷ lệ thu hồi ngân sách phi nông nghiệp' thấp hơn 12% so với lộ trình kế hoạch quý II.",
    targetRole: UserRole.PHOCHUTICH,
    createdAt: "2026-05-20 09:00",
    isRead: true
  },
  {
    id: "A006",
    type: "danger",
    title: "CẢNH BÁO QUÁ HẠN LÂU NGÀY",
    message: "Nhiệm vụ 'Dự thảo quyết định xử phạt vi phạm bãi ven sông' đã quá hạn 2 ngày chưa được hoàn thành.",
    targetRole: UserRole.TRUONGPHONG,
    createdAt: "2026-05-21 08:00",
    isRead: false,
    relatedTaskId: "T002"
  },
  {
    id: "A007",
    type: "info",
    title: "VĂN BẢN CHỜ KÝ DUYỆT",
    message: "Tờ trình bổ sung kinh phí sửa phòng trực tuyến (12/TTr-VP-TK) đã được rà soát lỗi chữ chuẩn bị ký số.",
    targetRole: UserRole.PHOCHUTICH,
    createdAt: "2026-05-22 09:30",
    isRead: false,
    relatedDocId: "D003"
  },
  {
    id: "A008",
    type: "warning",
    title: "MỌI HOẠT ĐỘNG CẢNH BÁO THIÊN TAI",
    message: "Có dấu hiệu nứt bờ kè cát tại Thôn Tây do lưu lượng nước dâng thượng nguồn đột ngột dâng cao.",
    targetRole: UserRole.CHUTICH,
    createdAt: "2026-05-22 09:45",
    isRead: false
  },
  {
    id: "A009",
    type: "info",
    title: "CƠ THỂ PHẢN ÁNH CHƯA PHÂN LOẠI",
    message: "Hệ thống tiếp nhận phản ảnh rác thải ô nhiễm tại thôn Đông vừa nhận từ người dân qua cổng Zalo Hành chính công.",
    targetRole: UserRole.VANTHUDEN,
    createdAt: "2026-05-22 10:00",
    isRead: false
  },
  {
    id: "A010",
    type: "warning",
    title: "KHOẢN KỸ SỐ CHỜ BAN HÀNH",
    message: "Văn bản quyết định thành lập tổ thanh tra liên ngành đã được ký, đang chờ đóng số và phát hành đi.",
    targetRole: UserRole.VANTHUDI,
    createdAt: "2026-05-22 10:15",
    isRead: false
  }
];

// 5 Mock Citizen Feedbacks (Tiếp dân / Kiến nghị)
export const mockCitizenFeedbacks: CitizenFeedback[] = [
  {
    id: "F001",
    citizenName: "Vy Văn Hồng",
    phone: "0904.555.221",
    address: "Số 15, Ngõ 4, Thôn Nam, xã Hoàng Diệu",
    receivedDate: "2026-05-18",
    feedbackType: "Khiếu nại",
    title: "Về việc hộ ông Lê Văn Ba tự ý rào chắn, xây bậc thềm lấn chiếm ngõ đi chung của cụm dân cư",
    content: "Tôi đại diện cho 5 hộ gia đình trong ngõ khiếu nại tranh chấp ngõ đi dân sinh chung bị hộ ông Lê Văn Ba chiếm đoạt xây bậc tam cấp ngăn cản đi lại. Chúng tôi đã hòa giải cấp thôn nhưng không thành. Đề xuất Ủy ban nhân dân xã xuống xem xét giải quyết dứt điểm.",
    scannedImageUrl: "scanned_invoice_citizen_feedback_001.png",
    status: "Đã giao xử lý",
    assigneeName: "Bùi Thanh Hải (Tư pháp)"
  },
  {
    id: "F002",
    citizenName: "Lê Minh Tuấn",
    phone: "0982.112.334",
    address: "Xóm bãi rác đê, Thôn Đông, xã Hoàng Diệu",
    receivedDate: "2026-05-20",
    feedbackType: "Phản ánh",
    title: "Tình trạng xe quá tải chở đất đá đổ thải bừa bãi đe dọa an toàn hành lang móng đê sông",
    content: "Mỗi tối từ 20h đến 24h đêm, xuất hiện một loạt xe tải ba dí chở vật liệu đào móng, san gạt đổ vụn gạch vỡ bừa bãi đổ trộm xuống sườn chân đê, ảnh hưởng lưu thông phòng bão và vệ sinh nông thôn xóm.",
    status: "Đang phân loại"
  },
  {
    id: "F003",
    citizenName: "Phạm Thu Hương",
    phone: "0323.889.911",
    address: "Khu tập thể HTX Nông nghiệp, thôn Tây",
    receivedDate: "2026-05-12",
    feedbackType: "Kiến nghị",
    title: "Về việc nạo vét cải tạo ao tù nước đọng sau ủy ban tránh dịch sốt xuất huyết bùng phát đầu hè",
    content: "Các ao trung tâm lắng bùn rác hiện có bọ gậy, muỗi vằn phát triển nhanh do nắng mưa thất thường. Đề xuất xã huy động đoàn viên phát quang và phun thuốc diệt muỗi.",
    status: "Đã giải quyết",
    assigneeName: "Lê Minh Hà",
    resolution: "Giao Đoàn Thanh niên xã tổ chức thứ Bảy tình nguyện quét dọ ao tù, kết hợp phun hóa chất khử trùng Cloramin B triệt để."
  },
  {
    id: "F004",
    citizenName: "Hoàng Văn Tiến",
    phone: "0915.223.355",
    address: "Thôn Bắc, xã Hoàng Diệu",
    receivedDate: "2026-05-22",
    feedbackType: "Kiến nghị",
    title: "Hỗ trợ lắp đặt bổ sung đèn chiếu sáng công cộng tại khúc quanh ngã tư Thôn Bắc",
    content: "Khu vực ngã tư hay bị khuất tầm nhìn, đợt vừa qua xảy ra 2 vụ va quệt do đêm tối thiếu ánh sáng. Rất mong chính quyền xã lắp đặt pin năng lượng mặt trời công cộng.",
    status: "Đang phân loại"
  },
  {
    id: "F005",
    citizenName: "Nguyễn Doãn Định",
    phone: "0912.000.777",
    address: "Thôn Đông, xã Hoàng Diệu",
    receivedDate: "2026-05-10",
    feedbackType: "Tố cáo",
    title: "Hành vi lén lút xả thải nước chưa qua xử lý của xưởng cơ khí đúc thép tư nhân ra ruộng lúa",
    content: "Xưởng đúc thép của ông Thức hoạt động xả chất axit, khói nhuộm vàng cánh đồng gây chết sém lúa non của nông dân. Đã có ảnh chụp chi tiết đường ống ngầm cắm lòng mương nội đồng.",
    status: "Đã lưu hồ sơ",
    assigneeName: "Nguyễn Trung Thực",
    resolution: "Ban địa chính tiến hành kiểm tra bắt quả tang xử phạt hành chính 15 triệu đồng, niêm phong thu hồi ống phát thải ngầm dứt điểm."
  }
];

// 5 Socio-Economic Indicators (Chỉ tiêu Kinh tế - Xã hội)
export const mockIndicators: SocioEconomicIndicator[] = [
  {
    id: "I001",
    name: "Tổng thu ngân sách nhà nước địa bàn",
    targetValue: "12 tỷ VNĐ",
    currentValue: "7.8 tỷ VNĐ",
    unit: "VNĐ",
    percentCompleted: 65,
    status: "Đạt tiến độ",
    history: [
      { period: "Tháng 1", value: 1.2 },
      { period: "Tháng 2", value: 2.5 },
      { period: "Tháng 3", value: 4.1 },
      { period: "Tháng 4", value: 5.6 },
      { period: "Tháng 5", value: 7.8 }
    ]
  },
  {
    id: "I002",
    name: "Tỷ lệ giải ngân vốn đầu tư công các dự án xã",
    targetValue: "8.5 tỷ VNĐ",
    currentValue: "3.57 tỷ VNĐ",
    unit: "VNĐ",
    percentCompleted: 42,
    status: "Cần đôn đốc",
    history: [
      { period: "Tháng 1", value: 0.5 },
      { period: "Tháng 2", value: 1.0 },
      { period: "Tháng 3", value: 1.8 },
      { period: "Tháng 4", value: 2.6 },
      { period: "Tháng 5", value: 3.57 }
    ]
  },
  {
    id: "I003",
    name: "Tỷ lệ rác thải sinh hoạt nông thôn phân loại tại nguồn",
    targetValue: "85%",
    currentValue: "41%",
    unit: "%",
    percentCompleted: 48,
    status: "Nguy cơ chậm chỉ tiêu",
    history: [
      { period: "Tháng 1", value: 15 },
      { period: "Tháng 2", value: 22 },
      { period: "Tháng 3", value: 30 },
      { period: "Tháng 4", value: 36 },
      { period: "Tháng 5", value: 41 }
    ]
  },
  {
    id: "I004",
    name: "Tỷ lệ người dân tham gia BHYT tự nguyện",
    targetValue: "95%",
    currentValue: "91.2%",
    unit: "%",
    percentCompleted: 96,
    status: "Đạt tiến độ",
    history: [
      { period: "Tháng 1", value: 85 },
      { period: "Tháng 2", value: 87 },
      { period: "Tháng 3", value: 89 },
      { period: "Tháng 4", value: 90 },
      { period: "Tháng 5", value: 91.2 }
    ]
  },
  {
    id: "I005",
    name: "Chỉ số hoàn thiện hạ tầng Chuyển đổi số cấp xã",
    targetValue: "100 điểm",
    currentValue: "70 điểm",
    unit: "Điểm",
    percentCompleted: 70,
    status: "Cần đôn đốc",
    history: [
      { period: "Tháng 1", value: 40 },
      { period: "Tháng 2", value: 50 },
      { period: "Tháng 3", value: 55 },
      { period: "Tháng 4", value: 62 },
      { period: "Tháng 5", value: 70 }
    ]
  }
];

// 5 Project markers on Digital Twin map (Bản đồ số xã / Digital Twin)
export const mockGeoProjects: GeoProject[] = [
  {
    id: "G001",
    name: "Công trình Nhà Văn hóa trung tâm Thôn Tây",
    type: "Công trình",
    latitude: 20.8422,
    longitude: 105.9555,
    status: "Đang thi công",
    description: "Công trình trọng điểm nông thôn mới, tiến độ xây bề mặt móng đạt 60%, hiện đang gặp vướng mắc nhỏ về san gạt đường hành lang phía Bắc.",
    relatedTask: "Kiểm tra mặt bằng thi công Nhà văn hóa"
  },
  {
    id: "G002",
    name: "Dự án Nâng cấp trạm bơm Thủy Lợi Thôn Đông",
    type: "Dự án",
    latitude: 20.8510,
    longitude: 105.9620,
    status: "Chuẩn bị đầu tư",
    description: "Đang hoàn tất thủ tục báo cáo khả thi trình UBND HĐND xã phê chuẩn bố trí ngân sách huyện kết hợp.",
    relatedTask: "Dự thảo Tờ trình dự phòng đê đập và mương máng tưới tiêu"
  },
  {
    id: "G003",
    name: "Điểm có nguy cơ rạn nứt sạt lở đê sông bãi sông Hồng",
    type: "Thiên tai",
    latitude: 20.8350,
    longitude: 105.9723,
    status: "Cảnh báo khẩn",
    description: "Vết nứt chân móng kè sạt dài 8m tại ven bãi thôn Đậu do khai thác cát trái phép. Đã đặt biển báo cấm xe trọng tải lớn đi qua.",
    relatedTask: "Rà soát mốc lộ giới hành lang ven đê sông sông Đậu"
  },
  {
    id: "G004",
    name: "Vị trí ngõ đi cụm dân cư hộ ông Vy Văn Hồng khiếu nại tranh chấp",
    type: "Phản ánh",
    latitude: 20.8465,
    longitude: 105.9501,
    status: "Đang giải quyết",
    description: "Tranh chấp mở ngõ lấn chiếm đống tường rào giữa hộ ông Hồng và ông Ba.",
    relatedTask: "Phê duyệt tờ khai tư pháp đăng ký thừa kế"
  },
  {
    id: "G005",
    name: "Dự án mở rộng Trường Tiểu học xã Hoàng Diệu",
    type: "Công trình",
    latitude: 20.8415,
    longitude: 105.9580,
    status: "Chuẩn bị đầu tư",
    description: "Xây dựng thêm phân khu lớp học 3 tầng và phòng thể chất đa năng cho học sinh tiểu học.",
    relatedTask: "Thống kê tiến độ giải ngân xây dựng trường mầm non"
  }
];

// Workflow Template Samples
export const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: "W001",
    name: "Quy trình xử lý Công văn hỏa tốc chỉ đạo từ Huyện",
    category: "Văn bản đến",
    steps: [
      { id: "S1", name: "Đồng bộ, OCR văn bản đến", role: UserRole.VANTHUDEN, durationDays: 1, isNotificationSent: true },
      { id: "S2", name: "Tham mưu phân xử lý", role: UserRole.CHANHVANPHONG, durationDays: 1, isNotificationSent: true },
      { id: "S3", name: "Cho ý kiến chỉ đạo trực tiếp", role: UserRole.CHUTICH, durationDays: 2, isNotificationSent: true },
      { id: "S4", name: "Lập dự thảo & trình xử lý kết quả", role: UserRole.CHUYENVIEN, durationDays: 5, isNotificationSent: true },
      { id: "S5", name: "Duyệt thẩm định nội chính", role: UserRole.TRUONGPHONG, durationDays: 2, isNotificationSent: true },
      { id: "S6", name: "Ký số ban hành", role: UserRole.PHOCHUTICH, durationDays: 2, isNotificationSent: true },
      { id: "S7", name: "Lưu sổ & phát hành", role: UserRole.VANTHUDI, durationDays: 1, isNotificationSent: true }
    ]
  },
  {
    id: "W002",
    name: "Quy trình giải quyết đơn thư khiếu nại kiến nghị nhân dân",
    category: "Kiến nghị/Phản ánh",
    steps: [
      { id: "S1-F", name: "Tiếp nhận đơn thư, phân loại rủi ro", role: UserRole.VANTHUDEN, durationDays: 2, isNotificationSent: true },
      { id: "S2-F", name: "Thụ lý xem xét thẩm quyền", role: UserRole.CHANHVANPHONG, durationDays: 3, isNotificationSent: false },
      { id: "S3-F", name: "Kiểm tra thực địa địa bàn tranh chấp", role: UserRole.CHUYENVIEN, durationDays: 7, isNotificationSent: true },
      { id: "S4-F", name: "Ký kết luận biên bản hòa giải", role: UserRole.CHUTICH, durationDays: 4, isNotificationSent: true }
    ]
  }
];

// System Logs demo data
export const mockSystemLogs: SystemLog[] = [
  { id: "LOG001", timestamp: "2026-05-22 09:30:12", user: "Phạm Hữu Đạt", action: "Đồng bộ quét scan PDF văn bản 85/UBND-TNMT", module: "Văn bản đến", ip: "192.168.1.15", status: "Thành công" },
  { id: "LOG002", timestamp: "2026-05-22 09:32:05", user: "Hệ thống AI Assistant", action: "Quét OCR sinh Tóm tắt, gợi ý bộ Địa chính thụ lý sổ 102", module: "Trí tuệ Nhân tạo", ip: "127.0.0.1", status: "Thành công" },
  { id: "LOG003", timestamp: "2026-05-22 09:44:18", user: "Nguyễn Thu Hà", action: "Duyệt đề xuất và chuyển xử lý cho Chủ tịch và Địa chính", module: "Quản trị công văn", ip: "192.168.1.10", status: "Thành công" },
  { id: "LOG004", timestamp: "2026-05-22 10:15:32", user: "Phùng Gia Lâm", action: "Nhập nội dung Bút phê điều hành 'Giao bộ Địa chính kiểm tra thực địa'", module: "Chỉ đạo điều hành", ip: "10.0.2.14", status: "Thành công" },
  { id: "LOG005", timestamp: "2026-05-22 10:20:00", user: "Trần Quốc Khánh", action: "Thực hiện Ký số CA công cộng phê chuẩn dự án Nhà Văn Hóa Thôn Tây", module: "Ký số", ip: "192.168.1.12", status: "Thành công" }
];
