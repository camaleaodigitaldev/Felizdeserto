"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-brand-blue">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                    }
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSubmenu === item.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/fale-conosco"
            onClick={onClose}
            className="btn-primary w-full justify-center"
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
