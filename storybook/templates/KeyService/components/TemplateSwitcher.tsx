import React, { useState, useRef, useEffect } from "react";
import { Menu, LayoutDashboard, MessageSquare, Grid, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: "keyservice",
    name: "Key Service",
    icon: Sparkles,
    description: "Full-screen split layout with image",
  },
  {
    id: "chat",
    name: "Chat Layout",
    icon: MessageSquare,
    description: "Traditional chat interface",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Widget grid layout",
  },
  {
    id: "booking",
    name: "Booking",
    icon: Grid,
    description: "Master widget layout",
  },
];

interface TemplateSwitcherProps {
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  logoUrl?: string;
  logoLink?: string;
}

export function TemplateSwitcher({
  currentTemplate,
  onTemplateChange,
  logoUrl,
  logoLink,
}: TemplateSwitcherProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const currentTemplateInfo = AVAILABLE_TEMPLATES.find((t) => t.id === currentTemplate);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Left side - Logo */}
      <div className="flex items-center space-x-3">
        {logoUrl && (
          <div className="flex items-center">
            {logoLink ? (
              <a href={logoLink}>
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-8 transition-transform hover:scale-105"
                />
              </a>
            ) : (
              <img src={logoUrl} alt="Logo" className="h-8" />
            )}
          </div>
        )}
      </div>

      {/* Right side - Template switcher */}
      <div className="flex items-center space-x-3">
        {/* Current template indicator */}
        <div className="hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-400">
          {currentTemplateInfo && (
            <>
              <currentTemplateInfo.icon className="w-4 h-4 mr-2" />
              <span className="font-medium">{currentTemplateInfo.name}</span>
            </>
          )}
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Switch Template"
          >
            <Menu className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Switch Template
                </div>
                {AVAILABLE_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  const isActive = currentTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onTemplateChange(template.id);
                      }}
                      className={`flex items-start w-full px-4 py-3 text-sm transition-colors text-left ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${
                        isActive ? "text-emerald-600 dark:text-emerald-400" : ""
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isActive ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {template.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 flex-shrink-0 mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
