"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      href: "/detection",
      label: "Toxicity Detection",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" x2="12" y1="8" y2="16" />
          <line x1="8" x2="16" y1="12" y2="12" />
        </svg>
      )
    },
    {
      href: "/comparison",
      label: "Model Comparison",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      )
    },
    {
      href: "/analytics",
      label: "Dataset Analytics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      )
    },
    {
      href: "/about",
      label: "About Project",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="16" y2="12" />
          <line x1="12" x2="12.01" y1="8" y2="8" />
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 7.54 16.59l-1.41-1.41A8 8 0 1 0 5.88 15.2l-1.42 1.4A10 10 0 0 1 12 2Z" />
          <path d="M12 6a6 6 0 0 1 4.52 9.95l-1.41-1.41A4 4 0 1 0 8.9 13.06l-1.42 1.4A6 6 0 0 1 12 6Z" />
          <circle cx="12" cy="12" r="2" fill="#a855f7" />
        </svg>
        <span className="brand-text">ToxicDetect AI</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        <ul className="nav-links">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link href={link.href} className={`nav-link ${isActive ? "active" : ""}`}>
                  {link.icon}
                  <span className="nav-text">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
        <span>ToxicDetect AI v1.0<br/>NLP UAS Project</span>
      </div>
    </aside>
  );
}
