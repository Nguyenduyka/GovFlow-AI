/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  UserRole,
  User
} from "../types";
import { mockUsers } from "../mockData";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Bell,
  MessageSquareCode,
  PenTool,
  Users2,
  FileSignature,
  Sliders,
  TrendingUp,
  MapPin,
  ClipboardList,
  GitBranch,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  currentUser: User;
  onLogout: () => void;
}

export const RoleBasedSidebar = ({
  currentRole,
  onRoleChange,
  currentScreen,
  onScreenChange,
  currentUser,
  onLogout,
}: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = React.useState(false);

  // Define screen links grouped into semantic categories
  const menuGroups = [
    {
      title: "Hệ thống điều hành",
      items: [
        { id: "dashboard", label: "Bàn làm việc", icon: <LayoutDashboard size={18} /> },
        { id: "indicators", label: "Chỉ tiêu Kinh tế - Xã hội", icon: <TrendingUp size={18} /> },
        { id: "digital-twin", label: "Bản đồ số / Digital Twin", icon: <MapPin size={18} /> },
      ]
    },
    {
      title: "Quản lý Nghiệp vụ",
      items: [
        { id: "documents", label: "Văn bản đến / Hồ sơ", icon: <FileText size={18} /> },
        { id: "citizen-feedback", label: "Tiếp dân & Kiến nghị", icon: <Users2 size={18} /> },
        { id: "kanban", label: "Công việc Kanban", icon: <CheckSquare size={18} /> },
        { id: "signature", label: "Ký số văn bản", icon: <FileSignature size={18} /> },
      ]
    },
    {
      title: "Bộ công cụ Trợ lý AI",
      items: [
        { id: "ai-assistant", label: "Trợ lý số Điều hành", icon: <MessageSquareCode size={18} className="text-purple-500" /> },
        { id: "ai-draft", label: "Dự thảo Văn bản AI", icon: <PenTool size={18} className="text-purple-500" /> },
        { id: "ai-meeting", label: "Giao ban & Biên bản AI", icon: <ClipboardList size={18} className="text-purple-500" /> },
        { id: "ai-reports", label: "Soạn Báo cáo AI", icon: <Award size={18} className="text-purple-500" /> },
        { id: "workflow-builder", label: "Quy trình tự động hóa", icon: <GitBranch size={18} className="text-indigo-500" /> },
      ]
    },
    {
      title: "Giám sát & Quản lý",
      items: [
        { id: "performance", label: "Hiệu suất viên chức", icon: <Award size={18} /> },
        { id: "alerts-deadlines", label: "Nhắc hạn & Cảnh báo", icon: <Bell size={18} /> },
        { id: "ai-config", label: "Cấu hình Mẫu Prompt AI", icon: <Sliders size={18} /> },
        { id: "user-admin", label: "Quản trị người dùng", icon: <ShieldCheck size={18} /> },
        { id: "system-logs", label: "Nhật ký hệ thống", icon: <FolderOpen size={18} /> },
      ]
    }
  ];

  // Map roles to Vietnamese descriptions
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.CHUTICH:
        return "bg-red-50 text-red-700 border-red-200";
      case UserRole.PHOCHUTICH:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case UserRole.CHANHVANPHONG:
        return "bg-violet-50 text-violet-700 border-violet-200";
      case UserRole.TRUONGPHONG:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case UserRole.GIAMDOC:
        return "bg-teal-50 text-teal-700 border-teal-200";
      case UserRole.VANTHUDEN:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case UserRole.VANTHUDI:
        return "bg-pink-50 text-pink-700 border-pink-200";
      case UserRole.CHUYENVIEN:
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getRoleLabelDefText = (role: UserRole) => {
    switch (role) {
      case UserRole.CHUTICH: return "Chủ tịch";
      case UserRole.PHOCHUTICH: return "Phó Chủ tịch";
      case UserRole.CHANHVANPHONG: return "Chánh Văn phòng";
      case UserRole.TRUONGPHONG: return "Trưởng bộ phận";
      case UserRole.GIAMDOC: return "G.Đốc Trung tâm";
      case UserRole.VANTHUDEN: return "Văn thư Đến";
      case UserRole.VANTHUDI: return "Văn thư Đi";
      case UserRole.CHUYENVIEN: return "Chuyên viên";
      case UserRole.ADMIN: return "Q.Trị Hệ thống";
    }
  };

  return (
    <div
      className={`glass-panel border-r border-slate-200 flex flex-col h-screen transition-all duration-300 z-40 relative group/sidebar ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* 1. Header (Logo branding) */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-100 pulse-primary">
              <Sparkles size={16} />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-800 tracking-tight text-base">
                GovFlow AI
              </h1>
              <span className="text-[10px] text-slate-400 font-medium block leading-none">
                Trợ lý hành chính số xã
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold mx-auto ring-2 ring-purple-100">
            GF
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm hidden md:block"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 2. User Profile and QUICK ROLE SWITCHING */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${currentUser.avatarColor}`}>
              {currentUser.name.split(" ").slice(-1)[0]}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800 text-sm truncate leading-snug">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500 truncate leading-snug">
                  {currentUser.title}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-200/60">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${getRoleBadgeStyle(currentRole)}`}>
                  {getRoleLabelDefText(currentRole)}
                </span>
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} className="animate-spin-hover" />
                  Đổi vai trò
                </button>
              </div>

              {showRoleSwitcher && (
                <div className="mt-1 grid grid-cols-1 gap-1 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-1.5 bg-white shadow-inner custom-scroll">
                  {mockUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onRoleChange(u.role);
                        setShowRoleSwitcher(false);
                      }}
                      className={`text-left text-xs px-2 py-1.5 rounded-md transition-colors font-medium flex items-center justify-between ${
                        currentRole === u.role
                          ? "bg-purple-50 text-purple-700"
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className="truncate">{u.title}</span>
                      {currentRole === u.role && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar custom-scroll">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2">
                {group.title}
              </h2>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onScreenChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-100 ring-1 ring-purple-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className={`flex-shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover/sidebar:translate-x-0.5"}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Footer actions */}
      <div className="p-4 border-t border-slate-140 flex-shrink-0">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Đăng xuất khỏi hệ thống</span>}
        </button>
      </div>
    </div>
  );
};
