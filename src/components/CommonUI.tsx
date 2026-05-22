/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, CheckCircle, Clock, AlertTriangle, Play } from "lucide-react";

interface GlassCardProps {
  children: React.ReactNode;
  id?: string;
  key?: React.Key;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: boolean;
}

export const GlassCard = ({
  children,
  id,
  className = "",
  onClick,
  hoverable = false,
  glow = false,
}: GlassCardProps) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 shadow-md transition-all duration-300 ${
        hoverable ? "hover:translate-y-[-4px] hover:shadow-xl hover:border-purple-300 cursor-pointer" : ""
      } ${
        glow ? "ring-1 ring-purple-400 shadow-purple-100 shadow-lg" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface GradientButtonProps {
  children: React.ReactNode;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: "purple" | "blue" | "teal" | "warning" | "danger" | "outline" | "ghost";
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}

export const GradientButton = ({
  children,
  id,
  onClick,
  className = "",
  variant = "purple",
  disabled = false,
  icon,
  size = "md",
  type = "button",
}: GradientButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 rounded-2xl",
  };

  const variantStyles = {
    purple: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-100 focus:ring-purple-500",
    blue: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-100 focus:ring-blue-500",
    teal: "bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 shadow-md shadow-teal-100 focus:ring-teal-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md focus:ring-amber-500",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md focus:ring-red-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

interface AIStatusBadgeProps {
  status: string;
  className?: string;
}

export const AIStatusBadge = ({ status, className = "" }: AIStatusBadgeProps) => {
  // Styles based on states
  const getBadgeStyle = () => {
    const s = status.toUpperCase();
    if (s.includes("MOI") || s.includes("NEW")) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock size={12} className="text-blue-500" />,
        label: "Mới"
      };
    }
    if (s.includes("DA_PHAN_TICH") || s.includes("AI_OK") || s.includes("ĐỒNG BỘ")) {
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <Sparkles size={12} className="text-purple-600 animate-pulse" />,
        label: "AI Thụ lý"
      };
    }
    if (s.includes("PHAN_TICH") || s.includes("XƯ_LÝ") || s.includes("XỬ LÝ") || s.includes("ĐANG")) {
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: <Clock size={12} className="text-indigo-500" />,
        label: "Đang xử lý"
      };
    }
    if (s.includes("HOAN_THANH") || s.includes("ĐẦY ĐỦ") || s.includes("ĐÃ GIẢI QUYẾT") || s.includes("ĐÃ PHÁT HÀNH")) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle size={12} className="text-emerald-500" />,
        label: "Hoàn thành"
      };
    }
    if (s.includes("CONG") || s.includes("TỜ TRÌNH") || s.includes("BÁO CÁO")) {
      return {
        bg: "bg-neutral-100 text-slate-800 border-slate-200",
        icon: null,
        label: status
      };
    }
    if (s.includes("KHẨN") || s.includes("DANGER") || s.includes("HỎA TỐC") || s.includes("CẢNH BÁO")) {
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200 font-semibold animate-pulse",
        icon: <AlertTriangle size={12} className="text-rose-500" />,
        label: status
      };
    }
    if (s.includes("QUÁ HẠN") || s.includes("TRỄ HẠN")) {
      return {
        bg: "bg-red-50 text-red-700 border-red-200 font-bold",
        icon: <AlertTriangle size={12} className="text-red-500" />,
        label: "Trễ hạn"
      };
    }
    // Default fallback
    return {
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      icon: null,
      label: status
    };
  };

  const badge = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${badge.bg} ${className}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
};
