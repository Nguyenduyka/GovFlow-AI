import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initializer for Google GenAI SDK to avoid crashing if API key is not present initially
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// --------------------------------------------------
// API ENDPOINTS FOR GOVFLOW AI
// --------------------------------------------------

// 1. Health & Config Check
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    hasApiKey: hasKey,
    appName: "GovFlow AI",
    status: "online",
  });
});

// Helper for Mock Responses when Gemini API Key is missing or fails
function getMockChatResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("kinh tế") || p.includes("chỉ tiêu")) {
    return `### Đánh giá Chỉ tiêu Kinh tế - Xã hội UBND Xã:
- **Thu ngân sách:** Đạt 65% kế hoạch năm (7.8 tỷ / 12 tỷ VNĐ). Cần đẩy nhanh tiến độ thu thuế phi nông nghiệp và phí trước bạ.
- **Giải ngân đầu tư công:** Đạt 42% chỉ tiêu. Hiện tại công trình xây dựng Nhà văn hóa thôn Tây đang chậm tiến độ do vướng giải phóng mặt bằng đường dẫn.
- **Nông thôn mới nâng cao:** Đạt 15/19 tiêu chí. 4 tiêu chí chưa đạt gồm: Môi trường (phân loại rác tại nguồn), Thu nhập bình quân, Y tế (tỷ lệ tham gia BHYT tự nguyện), và Chuyển đổi số cấp xã.
- **Dự báo:** Nếu không quyết liệt chỉ đạo giải phóng mặt bằng trong tháng 6, dự án đường liên thôn có rủi ro trễ hạn giải ngân nguồn vốn Trung ương năm 2026.`;
  }
  if (p.includes("bút phê") || p.includes("văn bản")) {
    return `### Đề xuất Bút phê Chỉ đạo của Chủ tịch:
1. **Lĩnh vực:** Quản lý Đất đai & Quy hoạch chi tiết.
2. **Nội dung:** Giao bộ phận Địa chính - Xây dựng chủ trì rà soát hiện trạng vị trí đất phản ánh.
3. **Phối hợp:** Tư pháp xã kiểm tra tính hợp pháp của hồ sơ địa chính qua các thời kỳ.
4. **Thời hạn (Deadline):** Hoàn thành báo cáo tham mưu UBND xã trước ngày 30/05/2026 để trả lời cử tri.`;
  }
  if (p.includes("quá hạn") || p.includes("tồn đọng")) {
    return `### Tổng hợp Công việc Quá hạn & Tồn đọng (Cảnh báo AI):
Hiện đang có **3 nhiệm vụ quá hạn** và **2 công việc có rủi ro trễ hạn**:
1. *Bản giải trình quy hoạch sử dụng đất dịch vụ:* Đồng chí Lê Minh Triết (Địa chính) trễ hạn 2 ngày. Lý do: Chưa lấy đủ ý kiến của Văn phòng Đăng ký Đất đai huyện.
2. *Dự thảo kế hoạch chuyển đổi số năm 2026:* Đồng chí Nguyễn Thu Hà (Văn phòng) sắp đến hạn. Tiến độ hiện tại đạt 80%.
3. *Đơn phản ánh ô nhiễm khu chăn nuôi thôn Nam:* Hạn xử lý ngày mai. Hiện chuyên viên chưa cập nhật biên bản làm việc thực tế với hộ dân. Đề xuất lãnh đạo nhắc việc gấp.`;
  }
  return `### Trợ lý số điều hành UBND Xã (GovFlow AI):
Tôi có thể hỗ trợ đồng chí Lãnh đạo thực hiện các nhiệm vụ sau:
1. **Phân tích văn bản đến:** Trích xuất tự động nội dung, tóm tắt ý chính và đề xuất phòng ban thụ lý.
2. **Dự thảo văn bản hành chính:** Soạn thảo nhanh Tờ trình, Quyết định, Công văn điều hành chuẩn thể thức.
3. **Báo cáo hiệu suất:** Tổng hợp tiến độ công việc của từng chuyên viên và bộ phận một cửa.
4. **Trợ lý cuộc họp giao ban:** Tóm tắt biên bản họp và tự động phân rã chỉ đạo thành danh sách nhiệm vụ.

Đồng chí hãy nhập yêu cầu hoặc câu hỏi cụ thể để tôi hỗ trợ. *(Lưu ý: Hệ thống đang chạy ở chế độ Demo mô phỏng do chưa cấu hình Khóa Gemini API thực tế ở Settings > Secrets)*`;
}

// 2. AI Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { prompt, history, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Yêu cầu cung cấp nội dung prompt" });
  }

  const ai = getAi();
  if (!ai) {
    // Graceful fake fallback response
    return res.json({ text: getMockChatResponse(prompt), isFallback: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "Bạn là GovFlow AI, trợ lý số chuyên nghiệp phục vụ hành chính công tại UBND cấp xã Việt Nam. Hãy trả lời ngắn gọn, chuẩn xác, đúng thuật ngữ hành chính công, lễ phép và mang tính xây dựng.",
        temperature: 0.2,
      },
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.json({
      text: `### Lỗi kết nối AI:\nKhông thể kết nối đến máy chủ Gemini API (${error.message || "Unknown error"}). Dưới đây là kết quả mô phỏng từ cơ sở tri thức cục bộ:\n\n` + getMockChatResponse(prompt),
      isFallback: true,
      errorDetails: error.message,
    });
  }
});

// 3. Document Analysis & OCR Metadata Extraction
app.post("/api/gemini/analyze-document", async (req, res) => {
  const { title, docType, rawText } = req.body;
  const sampleText = rawText || `ỦY BAN NHÂN DÂN HUYỆN TN - SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG\nVề việc: Tăng cường rà soát, kiểm tra xử lý dứt điểm các vi phạm lấn chiếm đất công ích, sử dụng đất sai mục đích dọc trục quốc lộ 1A đi qua địa phận xã.\nYêu cầu báo cáo kết quả tổ chức thực hiện trước ngày 15 tháng 06 năm 2026.`;

  const ai = getAi();
  if (!ai) {
    // Generate intelligent simulation mock metadata
    const mockAnalysis = {
      summary: `Yêu cầu UBND xã khẩn trương kiểm tra, thu hồi đất công ích bị lấn chiếm hoặc sử dụng sai mục đích dọc tuyến Quốc lộ 1A. Tổng hợp biên bản xử phạt và xây dựng kế hoạch quản lý quỹ đất này, báo cáo Ủy ban nhân dân huyện trước ngày 15/06/2026.`,
      department: "Địa chính - Xây dựng - Đô thị và Môi trường",
      assignee: "Nguyễn Văn Đức",
      cooperators: ["Văn pháp - Hộ tịch", "Công an xã"],
      priority: "Khẩn",
      deadline: "2026-06-12",
      riskAssessment: "Cao. Khu vực dọc Quốc lộ 1A có mật độ giao thương lớn, nguy cơ xảy ra tranh chấp đất đai phức tạp, người dân có xu hướng tự ý san lấp đất nông nghiệp làm bãi đỗ xe.",
      legalBasis: "Khoản 3 Điều 208 Luật Đất đai 2024; Nghị định số 91/2019/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực đất đai.",
      recommendedAction: " UBND xã thành lập tổ công tác kiểm tra thực địa, tiến hành đo đạc hiện trạng, lập biên bản vi phạm hành chính đối với các hộ có hành vi san lấp trái phép.",
      confidence: 96,
      isFallback: true
    };
    return res.json(mockAnalysis);
  }

  const prompt = `Phân tích văn bản hành chính sau đây và trả về định dạng JSON đại diện cho kết quả xử lý của Trợ lý số UBND xã. 
  Tiêu đề: ${title || "Chưa rõ"}
  Loại văn bản: ${docType || "Công văn"}
  Nội dung văn bản: ${sampleText}

  Hãy trả về một đối tượng JSON đúng cấu trúc sau (không bọc trong thẻ markdown khác, chỉ trả về JSON nguyên bản):
  {
    "summary": "Tóm tắt ngắn gọn khoảng 2-3 câu nội dung cốt lõi và yêu cầu thực thi",
    "department": "Tên phòng ban đề xuất thụ lý (Ví dụ: Địa chính - Xây dựng, Văn phòng - Thống kê, Tư pháp - Hộ tịch, Tài chính - Kế hoạch, Văn hóa - Xã hội)",
    "assignee": "Tên chuyên viên phù hợp đề xuất xử lý chính",
    "cooperators": ["Danh sách các phòng ban/cá nhân phối hợp"],
    "priority": "Mức độ khẩn (Thường, Khẩn, Thượng khẩn, Hỏa tốc)",
    "deadline": "Thời hạn hoàn thành đề xuất định dạng YYYY-MM-DD dựa trên yêu cầu trong văn bản (ví dụ nếu hạn báo cáo huyện trước 15/06/2026 thì deadline đề xuất chuyên viên nộp xã là 12/06/2026)",
    "riskAssessment": "Phân tích rủi ro pháp lý hoặc thực tế của việc chậm trễ xử lý văn bản này",
    "legalBasis": "Các căn cứ pháp lý liên quan tại Việt Nam (ví dụ Luật Đất đai 2024, Nghị định liên quan)",
    "recommendedAction": "Đề xuất các bước thực thi cụ thể cho chuyên viên",
    "confidence": 95
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Document Analysis Model Error:", error);
    // Graceful response fallback
    res.json({
      summary: `Tóm tắt: Văn bản chỉ đạo về việc rà soát và xử lý các hành vi vi phạm đất đai, yêu cầu tổng hợp trước ngày 15/06/2026.`,
      department: "Địa chính - Xây dựng - Đô thị và Môi trường",
      assignee: "Nguyễn Văn Đức",
      cooperators: ["Văn phòng - Thống kê"],
      priority: "Khẩn",
      deadline: "2026-06-12",
      riskAssessment: "Trực tiếp ảnh hưởng đến chỉ tiêu thi đua hiệu quả quản lý nhà nước nếu không lập biên bản ngăn chặn kịp thời.",
      legalBasis: "Luật Đất đai mới nhất, Nghị định xử lý vi phạm hành chính về đất đai.",
      recommendedAction: "Địa chính lập kế hoạch đi kiểm tra thực tế trục đường phản ánh.",
      confidence: 80,
      isFallback: true,
    });
  }
});

// 4. Document Draft Generation (Soạn thảo văn bản chuẩn mẫu Chính phủ)
app.post("/api/gemini/draft", async (req, res) => {
  const { docType, title, purpose, points, requesterName, requesterTitle } = req.body;

  const ai = getAi();
  if (!ai) {
    // Simulated Draft in standard Vietnamese Administrative format
    const mockDraft = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------

ỦY BAN NHÂN DÂN               Hà Nội, ngày 22 tháng 05 năm 2026
XÃ HOÀNG DIỆU
Số:      /QD-UBND

QUYẾT ĐỊNH
Về việc thành lập Tổ công tác kiểm tra liên ngành xử lý vi phạm
hành chính đất đai dọc Quốc lộ 1A đi qua địa bàn xã Hoàng Diệu
--------------------

ỦY BAN NHÂN DÂN XÃ HOÀNG DIỆU

Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;
Căn cứ Luật Xử lý vi phạm hành chính ngày 20 tháng 6 năm 2012; Luật sửa đổi, bổ sung một số điều của Luật Xử lý vi phạm hành chính ngày 13 tháng 11 năm 2020;
Xét đề nghị của Chánh Văn phòng HĐND & UBND và Công chức Địa chính - Xây dựng xã Hoàng Diệu.

QUYẾT ĐỊNH:

Điều 1. Thành lập Tổ công tác kiểm tra liên ngành xử lý dứt điểm vi phạm hành chính về lấn chiếm đất đai, xây dựng trái phép dọc hành lang Quốc lộ 1A bao gồm các đồng chí sau:
1. Ông Trần Quốc Khánh - Phó Chủ tịch UBND xã - Tổ trưởng.
2. Ông Nguyễn Văn Đức - Công chức Địa chính - Xây dựng xã - Tổ phó thường trực.
3. Ông Lê Trung Kiên - Trưởng Công an xã - Thành viên.
4. Bà Phạm Thị Thảo - Công chức Tư pháp - Hộ tịch - Thành viên.

Điều 2. Tổ liên ngành có nhiệm vụ:
- Tiến hành đo đạc, rà soát và lập biên bản xử lý vi phạm hành chính đối với toàn bộ các trường hợp vi phạm lấn chiếm đất công, lấn chiếm hành lang an toàn giao thông dọc Quốc lộ 1A.
- Tham mưu Ủy ban nhân dân xã ban hành Quyết định cưỡng chế khắc phục hậu quả đối với các trường hợp cố tình không chấp hành.
- Tổng hợp báo cáo kết quả thực hiện gửi UBND huyện trước ngày 15/06/2026.

Điều 3. Quyết định này có hiệu lực kể từ ngày ký. 
Văn phòng UBND xã, các bộ phận chuyên môn liên quan và các cá nhân có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này./.

Nơi nhận:                                  TL. CHỦ TỊCH
- UBND Huyện (để b/c);                     PHÓ CHỦ TỊCH
- Thường trực Đảng ủy;
- Như Điều 3 (để thực hiện);
- Lưu: VT, ĐC.
                                           (Đã Ký Số)
                                           
                                           Trần Quốc Khánh`;
    return res.json({ draftContent: mockDraft, isFallback: true });
  }

  const prompt = `Hãy đóng vai là một Chuyên viên Văn phòng xuất sắc của UBND Xã, soạn thảo dự thảo văn bản hành chính Việt Nam theo Nghị định 30/2020/NĐ-CP về công tác văn thư.
  Loại văn bản: ${docType}
  Tiêu đề: ${title}
  Mục đích: ${purpose}
  Các nội dung cốt lõi cần đưa vào: 
  ${points || "Thực hiện theo chỉ đạo của cấp trên."}
  Người ký đề xuất: ${requesterName || "Nguyễn Văn Đức"}
  Chức vụ người ký: ${requesterTitle || "Công chức Địa chính - Xây dựng"}

  Hãy trình bày văn bản theo phong cách chuyên nghiệp chuẩn mực nhất, bao gồm đầy đủ Quốc hiệu, Tiêu ngữ, Tên cơ quan ban hành, Số hiệu (để trống), Địa danh/Thời gian, Tên văn bản, Căn cứ pháp lý hành chính liên quan trực tiếp, Các Điều khoản hay Nội dung chi tiết rõ ràng, Nới nhận và phần chữ ký số. Chỉ trả về chuỗi văn bản hành chính hoàn chỉnh, đẹp đẽ.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });
    res.json({ draftContent: response.text });
  } catch (error: any) {
    console.error("Draft Generation Model Error:", error);
    res.json({
      draftContent: `### Lỗi API: Không thể gọi Gemini API (${error.message || "Unknown Error"}). Dưới đây là Văn bản mô phỏng đúng thể thức:\n\n=== DỰ THẢO SOẠN THẢO BỞI GOVFLOW CỤC BỘ ===\n\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nỦY BAN NHÂN DÂN XÃ HOÀNG DIỆU\nSố: ... /QD-UBND\n\nQUYẾT ĐỊNH\nVề việc: ${title}\n\n- Căn cứ chức năng nhiệm vụ quyền hạn của UBND cấp xã.\n- Căn cứ thực tế yêu cầu xử lý công tác: ${purpose}.\n\nQUYẾT ĐỊNH:\nĐiều 1: Thực hiện nhiệm vụ ${purpose} với các nội dung chính: ${points}\nĐiều 2: Giao Chuyên viên ${requesterName} phối hợp chuyên môn kiểm tra.\nĐiều 3: Văn phòng Ủy ban và các cá nhân liên quan chịu trách nhiệm thi hành.\n\nNơi nhận:\n- Như Điều 3;\n- Lưu: VT.`,
      isFallback: true,
    });
  }
});

// 5. Briefing Minutes & Task Extraction (Giao ban AI)
app.post("/api/gemini/summarize-meeting", async (req, res) => {
  const { notes } = req.body;
  if (!notes) {
    return res.status(400).json({ error: "Yêu cầu cung cấp nội dung ghi chú buổi họp" });
  }

  const ai = getAi();
  if (!ai) {
    const mockTasks = [
      {
        taskName: "Rà soát toàn bộ các điểm hộ gia đình vi phạm lấn chiếm đất đai Thôn Tây",
        assignee: "Nguyễn Văn Đức (Địa chính)",
        cooperators: "Công an xã",
        deadline: "2026-05-30",
        priority: "Khẩn"
      },
      {
        taskName: "Dự thảo Tờ trình xin nguồn vốn sửa chữa hư hỏng tuyến đường Trục Chính liên xã",
        assignee: "Phạm Thị Thúy (Tài chính - Kế hoạch)",
        cooperators: "Nguyễn Thu Hà (Văn phòng)",
        deadline: "2026-06-05",
        priority: "Thường"
      },
      {
        taskName: "Hoàn thiện hồ sơ giải quyết khiếu nại tranh chấp ngõ đi chung của hộ ông Vy Văn Hồng",
        assignee: "Bùi Thanh Hải (Tư pháp)",
        cooperators: "Trưởng thôn Nam",
        deadline: "2026-05-28",
        priority: "Khẩn"
      }
    ];
    return res.json({
      summary: "Phiên họp giải quyết các nội dung nổi cộm của xã trong tuần 4 tháng 5 năm 2026: Trực tiếp đôn đốc giải quyết dứt điểm các vướng mắc về địa chính đất đai dọc Quốc lộ 1A, lập hồ sơ dự thảo sửa chữa hạ tầng liên thôn và giải trình dứt điểm khiếu nại tranh chấp đất đai ngõ đi Thôn Nam.",
      tasks: mockTasks,
      isFallback: true
    });
  }

  const prompt = `Hãy đóng vai trò Thư ký cuộc họp ảo AI của UBND xã. Dưới đây là biên bản thô hoặc bản ghi thảo âm thanh họp giao ban:
  "${notes}"

  Hãy tóm tắt cuộc họp và tự động phân rã thành các nhiệm vụ cụ thể để phân công cho cán bộ xã. Trả về một đối tượng JSON đúng cấu trúc sau (không bọc trong markdown khác ngoài JSON):
  {
    "summary": "Tóm tắt ngắn gọn 3-4 câu tinh thần chỉ đạo nổi bật của Chủ trì cuộc họp (Chủ tịch UBND xã)",
    "tasks": [
      {
        "taskName": "Tên chi tiết nhiệm vụ cụ thể cần thực hiện",
        "assignee": "Tên chuyên viên phụ trách chính kèm chức vụ (nếu suy luận được)",
        "cooperators": "Đơn vị/Cá nhân phối hợp phụ",
        "deadline": "Thời hạn hoàn thành gợi ý định dạng YYYY-MM-DD",
        "priority": "Mức độ ưu tiên (Thường, Khẩn, Hỏa tốc)"
      }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Meeting Summarize Error:", error);
    res.json({
      summary: "Biên bản họp giao ban tập trung chỉ đạo các kế hoạch hành động khắc phục lấn chiếm đất đai, tăng tốc giải ngân đầu tư công và thúc đẩy hoàn thành thủ tục đo đạc tranh chấp.",
      tasks: [
        {
          taskName: "Tổ chức cưỡng chế vi phạm đất trồng lúa thôn Đông",
          assignee: "Nguyễn Văn Đức (Địa chính)",
          cooperators: "Công an xã",
          deadline: "2026-06-01",
          priority: "Khẩn"
        }
      ],
      isFallback: true,
    });
  }
});


// --------------------------------------------------
// VITE DEV SERVER OR STATIC SERVING RUNTIME
// --------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite hot middleware integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Joined development mode with Vite middleware.");
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GovFlow AI backend up on: http://localhost:${PORT}`);
  });
}

startServer();
