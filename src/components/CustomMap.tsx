/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GeoProject } from "../types";
import { mockGeoProjects } from "../mockData";
import { GlassCard, GradientButton } from "./CommonUI";
import { MapPin, Filter, Plus, ShieldAlert, Waves, CheckCircle2, ChevronRight, FileUp } from "lucide-react";

interface CustomMapProps {
  onAddTaskFromMap?: (taskName: string, location: string) => void;
}

export const CustomMap = ({ onAddTaskFromMap }: CustomMapProps) => {
  const [projects, setProjects] = React.useState<GeoProject[]>(mockGeoProjects);
  const [selectedType, setSelectedType] = React.useState<string>("All");
  const [selectedProject, setSelectedProject] = React.useState<GeoProject | null>(projects[2]); // Default select landslide point
  const [floodSimulation, setFloodSimulation] = React.useState(false);
  const [hoveredProject, setHoveredProject] = React.useState<GeoProject | null>(null);

  // New marker form states
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newMarkerName, setNewMarkerName] = React.useState("");
  const [newMarkerType, setNewMarkerType] = React.useState<"Công trình" | "Dự án" | "Thiên tai" | "Phản ánh">("Phản ánh");
  const [newMarkerDesc, setNewMarkerDesc] = React.useState("");
  const [clickCoords, setClickCoords] = React.useState<{ x: number; y: number } | null>(null);

  // Handle map click to place coordinates
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Get absolute SVG relative dimensions
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setClickCoords({ x, y });
    setShowAddForm(true);
  };

  // Submit new marker
  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerName.trim() || !clickCoords) return;

    // Convert screen coordinates x,y directly to simulated lat/long offsets
    // Center of map is approx (20.8422, 105.9555)
    const lat = 20.83 + (clickCoords.y / 100) * 0.03;
    const lng = 105.94 + (clickCoords.x / 100) * 0.04;

    const newProj: GeoProject = {
      id: `G${(projects.length + 1).toString().padStart(3, "0")}`,
      name: newMarkerName,
      type: newMarkerType,
      latitude: Number(lat.toFixed(4)),
      longitude: Number(lng.toFixed(4)),
      status: newMarkerType === "Thiên tai" ? "Cảnh báo khẩn" : "Đang giải quyết",
      description: newMarkerDesc || "Marker số hóa tạo bởi cán bộ điều hành xã.",
    };

    setProjects([...projects, newProj]);
    setSelectedProject(newProj);
    setNewMarkerName("");
    setNewMarkerDesc("");
    setShowAddForm(false);
    setClickCoords(null);
  };

  // Get color for each project type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Công trình": return { marker: "fill-blue-500", glow: "bg-blue-500", text: "text-blue-600" };
      case "Dự án": return { marker: "fill-purple-500", glow: "bg-purple-500", text: "text-purple-600" };
      case "Thiên tai": return { marker: "fill-red-500 animate-pulse", glow: "bg-red-500", text: "text-red-600" };
      case "Phản ánh": return { marker: "fill-amber-500", glow: "bg-amber-500", text: "text-amber-600" };
      default: return { marker: "fill-slate-500", glow: "bg-slate-500", text: "text-slate-600" };
    }
  };

  // Filter projects list
  const filteredProjects = projects.filter((p) => selectedType === "All" || p.type === selectedType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* MAP FILTERS & INFO PANEL */}
      <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar max-h-[85vh]">
        <GlassCard className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Filter size={16} className="text-purple-600" />
            <h3 className="font-display font-semibold text-slate-800 text-sm">Bản đồ quy hoạch</h3>
          </div>

          {/* Type Selector Buttons */}
          <div className="flex flex-col gap-1">
            {["All", "Công trình", "Dự án", "Thiên tai", "Phản ánh"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`text-left text-xs px-3 py-2 rounded-xl border transition-all ${
                  (selectedType === t)
                    ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {t === "All" ? "Tất cả địa điểm" : t}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <GradientButton
              size="sm"
              variant={floodSimulation ? "warning" : "blue"}
              icon={<Waves size={14} />}
              onClick={() => setFloodSimulation(!floodSimulation)}
              className="w-full"
            >
              Mô phỏng mực nước ngập dâng
            </GradientButton>
            <p className="text-[10px] text-slate-400 mt-1">
              Phân tích dải ảnh rủi ro ngập lụt ven đê khi mực nước sông Hồng vượt báo động III.
            </p>
          </div>
        </GlassCard>

        {/* Selected Project Card */}
        {selectedProject && (
          <GlassCard className="p-4 border-l-4 border-purple-500 bg-purple-50/20" glow={selectedProject.type === "Thiên tai"}>
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border ${getTypeColor(selectedProject.type).text}`}>
                {selectedProject.type}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedProject.latitude}, {selectedProject.longitude}
              </span>
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm leading-snug mb-1">
              {selectedProject.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-4 mb-3">
              {selectedProject.description}
            </p>

            <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="font-semibold text-slate-700">{selectedProject.status}</span>
              </div>
              {selectedProject.relatedTask && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Nhiệm vụ gán:</span>
                  <span className="font-medium text-purple-600 underline truncate max-w-[130px]" title={selectedProject.relatedTask}>
                    {selectedProject.relatedTask}
                  </span>
                </div>
              )}
            </div>

            {onAddTaskFromMap && selectedProject.type === "Thiên tai" && (
              <GradientButton
                size="sm"
                variant="danger"
                onClick={() => onAddTaskFromMap(`Tổ chức thanh sát khẩn cấp rủi ro tại: ${selectedProject.name}`, selectedProject.name)}
                className="w-full mt-3"
                icon={<ShieldAlert size={12} />}
              >
                Giao việc cứu hộ khẩn
              </GradientButton>
            )}
          </GlassCard>
        )}
      </div>

      {/* SVG INTERACTIVE MAP CONTAINER */}
      <div className="lg:col-span-3 flex flex-col gap-3 relative h-full">
        <div className="bg-slate-900 rounded-2xl relative overflow-hidden flex-1 border border-slate-800 shadow-inner flex items-center justify-center">
          
          {/* Legend absolute bar */}
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 z-10 text-[10px] text-slate-300 flex items-center gap-3 shadow-md">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"/>Công trình</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"/>Dự án bồi</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block animate-pulse"/>Điểm Thiên tai</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/>Phản ánh xã</span>
          </div>

          {/* Interaction Guide label */}
          <div className="absolute bottom-4 left-4 text-slate-400 text-[10px] bg-slate-950/80 p-1.5 rounded border border-slate-800">
            💡 Mẹo: Nhấp bất kỳ điểm nào trên bản đồ để thêm Mối nguy hại / Điểm phản ánh mới dán vị trí.
          </div>

          {/* INTERACTIVE VECTOR SVG MAP */}
          <svg
            viewBox="0 0 100 100"
            className="w-full max-h-full cursor-crosshair select-none"
            onClick={handleMapClick}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Simulated River Streams Layer */}
            <path
              d="M -10,35 Q 25,25 45,45 T 110,65"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="12"
              opacity="0.4"
            />
            <path
              d="M -10,35 Q 25,25 45,45 T 110,65"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              opacity="0.3"
            />

            {/* Flood Simulation overlay */}
            {floodSimulation && (
              <path
                d="M -10,35 Q 25,25 45,45 T 110,65"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="18"
                opacity="0.25"
                className="animate-pulse"
              />
            )}

            {/* Simulated Road National Highway/Inter-commune Road */}
            <path
              d="M 15,-10 L 15,110"
              fill="none"
              stroke="#334155"
              strokeWidth="2.5"
              strokeDasharray="1.5,1.5"
              opacity="0.8"
            />
            
            {/* Inter-commune central road */}
            <path
              d="M -10,60 Q 40,65 60,40 T 110,30"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Commune Boundary boundaries polygon */}
            <polygon
              points="10,10 90,8 95,85 55,95 5,88"
              fill="none"
              stroke="rgba(124, 58, 237, 0.4)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Built-up Commune administrative zones label */}
            <text x="50" y="50" fill="rgba(255,255,255,0.12)" fontSize="3.5" fontFamily="Space Grotesk" fontWeight="bold" textAnchor="middle">
              UBND XÃ HOÀNG DIỆU
            </text>
            <text x="18" y="15" fill="rgba(255,255,255,0.1)" fontSize="2" fontStyle="italic">
              Quốc lộ 1A
            </text>
            <text x="80" y="68" fill="rgba(255,255,255,0.1)" fontSize="2.2" fontFamily="sans-serif">
              Lưu vực sông Đậu
            </text>

            {/* MARKERS ITERATION */}
            {filteredProjects.map((p) => {
              // Map simulated coordinates to offset x, y on a scale of 100
              // lat range around 20.83 to 20.86 => map to y from 10 to 90
              const y = ((p.latitude - 20.832) / 0.025) * 80 + 10;
              // lng range around 105.94 to 105.98 => map to x from 10 to 90
              const x = ((p.longitude - 105.94) / 0.04) * 80 + 10;

              const colors = getTypeColor(p.type);
              const isSelected = selectedProject?.id === p.id;
              const isHovered = hoveredProject?.id === p.id;

              return (
                <g
                  key={p.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop parent map click
                    setSelectedProject(p);
                  }}
                  onMouseEnter={() => setHoveredProject(p)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Outer glow aura */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                    className={`opacity-30 ${colors.marker}`}
                  />
                  {/* Bullet center point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 1.5 : 1}
                    className={`transition-all ${colors.marker} stroke-white stroke-[0.3]`}
                  />
                  {/* Tooltip labels when hovered */}
                  {(isHovered || isSelected) && (
                    <g transform={`translate(${x}, ${y - 4})`} className="pointer-events-none">
                      <rect
                        x="-18"
                        y="-4.5"
                        width="36"
                        height="4"
                        rx="1"
                        fill="rgba(15,23,42,0.95)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.2"
                      />
                      <text
                        x="0"
                        y="-1.8"
                        fill="#fff"
                        fontSize="1.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {p.name.length > 22 ? p.name.substring(0, 20) + "..." : p.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Click-to-Add indicator */}
            {clickCoords && (
              <g transform={`translate(${clickCoords.x}, ${clickCoords.y})`}>
                <circle cx="0" cy="0" r="2.5" fill="none" stroke="#7C3AED" strokeWidth="0.4" className="animate-ping" />
                <path d="M-2,0 L2,0 M0,-2 L0,2" stroke="#7C3AED" strokeWidth="0.5" />
              </g>
            )}
          </svg>
        </div>

        {/* INPUT SPARK MARKER FORM */}
        {showAddForm && clickCoords && (
          <div className="absolute inset-x-4 bottom-4 glass-panel-dark rounded-2xl p-4 shadow-xl z-20 border border-slate-700/60 max-w-lg mx-auto">
            <form onSubmit={handleAddMarker} className="space-y-3 text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                <span className="text-xs font-bold font-display text-purple-400 flex items-center gap-1">
                  <Plus size={14} /> Thêm điểm tọa độ số mới
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setClickCoords(null);
                  }}
                  className="text-white/40 hover:text-white text-xs"
                >
                  Hủy
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] text-white/60 mb-0.5">Tên địa điểm / Tên sự vụ</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Ô nhiễm đống rác thôn Nam..."
                    value={newMarkerName}
                    onChange={(e) => setNewMarkerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-0.5">Loại điểm</label>
                  <select
                    value={newMarkerType}
                    onChange={(e: any) => setNewMarkerType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Công trình">Công trình</option>
                    <option value="Dự án">Dự án bồi</option>
                    <option value="Thiên tai">Thiên tai khẩn</option>
                    <option value="Phản ánh">Phản ánh cử tri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-white/60 mb-0.5">Mô tả sự vụ chi tiết</label>
                <textarea
                  placeholder="Nêu hiện trạng, ghi chú, yêu cầu bộ phận nào đi khảo sát xử lý..."
                  value={newMarkerDesc}
                  onChange={(e) => setNewMarkerDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white h-12 focus:outline-none focus:border-purple-500 text-slate-300"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-white/40 font-mono">
                  Simulated GPS: ({(20.83 + (clickCoords.y / 100) * 0.03).toFixed(4)}, {(105.94 + (clickCoords.x / 100) * 0.04).toFixed(4)})
                </span>
                <GradientButton size="sm" variant="purple" type="submit">
                  Đăng ký tọa độ số
                </GradientButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
