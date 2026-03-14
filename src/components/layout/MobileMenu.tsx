"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useState } from "react";

interface Secretaria {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  secretarias?: Secretaria[];
}

export default function MobileMenu({ open, onClose, secretarias = [] }: Props) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (!open) return null;

  const toggle = (label: string) =>
    setOpenSubmenu(openSubmenu === label ? null : label);

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
          {NAV_LINKS.map((item, index) => (
            <>
              <div key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggle(item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
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

              {/* Secretarias logo após Governo (index 0) */}
              {index === 0 && secretarias.length > 0 && (
                <div key="secretarias">
                  <button
                    onClick={() => toggle("Secretarias")}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Secretarias
                    <svg
                      className={`w-4 h-4 transition-transform ${openSubmenu === "Secretarias" ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSubmenu === "Secretarias" && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        href="/governo/secretarias"
                        onClick={onClose}
                        className="block px-3 py-2 text-sm font-semibold text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        Ver todas
                      </Link>
                      {secretarias.map((sec) => (
                        <Link
                          key={sec.id}
                          href={`/governo/secretarias/${sec.slug}`}
                          onClick={onClose}
                          className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
                        >
                          {sec.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
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
