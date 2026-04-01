import ProjectGrid from "@/components/ProjectGrid";
import SocialIcons from "@/components/SocialIcons";
import { PersonSchema } from "@/schemas/PersonSchema";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="win-desktop flex flex-col gap-5 p-4 pb-[38px]"
      style={{ minHeight: "100vh", fontFamily: "var(--font-body)" }}
    >
      <PersonSchema />

      {/* Bio window — Win2000 dialog style */}
      <div className="win-window w-full max-w-2xl">
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1">
            {/* User icon */}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5" r="3" fill="#c0c0c0" stroke="#fff" strokeWidth="0.5" />
              <path d="M2 16c0-4 2.7-6 6-6s6 2 6 6" fill="#c0c0c0" stroke="#fff" strokeWidth="0.5" />
            </svg>
            <span style={{ fontSize: "11px" }}>Zach Marino — Portfolio</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="win-titlebar-btn" aria-hidden="true">_</span>
            <span className="win-titlebar-btn" aria-hidden="true">&#9633;</span>
            <span className="win-titlebar-btn" aria-hidden="true">&#x2715;</span>
          </div>
        </div>

        {/* Menu bar */}
        <div className="win-menubar">
          <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>F</u>ile</span>
          <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>E</u>dit</span>
          <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>V</u>iew</span>
          <span className="win-menubar-item" style={{ fontSize: "11px" }}><u>H</u>elp</span>
        </div>

        <div style={{ height: "1px", background: "var(--win-btn-shadow)", margin: "0 2px" }} />
        <div style={{ height: "1px", background: "var(--win-btn-highlight)", margin: "0 2px" }} />

        {/* Body */}
        <div style={{ padding: "10px 12px", background: "var(--win-btn-face)" }}>
          <div className="win-inset" style={{ padding: "8px 10px", marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", lineHeight: "1.6", color: "var(--foreground)", marginBottom: "6px" }}>
              Zach Marino is a multi-hyphenate UX designer and web developer focused on the media and
              entertainment space. His work refines the experiences creatives and consumers have with
              the media they love.{" "}
              <Link href="/about" style={{ color: "#0000ff", textDecoration: "underline" }}>
                read more
              </Link>
            </p>
            <p style={{ fontSize: "11px", lineHeight: "1.6", color: "var(--foreground)" }}>
              Prev. Product Design Internship at Dow Jones and Product Management Co-op at the Boston Globe
            </p>
          </div>

          {/* Social icons row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--foreground)" }}>Find me here:</span>
            <SocialIcons />
          </div>
        </div>

        {/* Status bar */}
        <div className="win-statusbar">
          <div className="win-statusbar-panel flex-1" style={{ fontSize: "11px" }}>
            UX Designer &amp; Web Developer
          </div>
        </div>
      </div>

      {/* "Pardon the Dust" — Win2000 warning dialog */}
      <div className="win-window w-full max-w-2xl">
        <div className="win-titlebar" style={{ background: "linear-gradient(to right, #7a0000, #c04040)" }}>
          <div className="flex items-center gap-1">
            {/* Warning icon */}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1 L15 14 L1 14 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
              <rect x="7" y="6" width="2" height="4" fill="#000" />
              <rect x="7" y="11" width="2" height="2" fill="#000" />
            </svg>
            <span style={{ fontSize: "11px" }}>Notice — Construction in Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="win-titlebar-btn" aria-hidden="true">_</span>
            <span className="win-titlebar-btn" aria-hidden="true">&#9633;</span>
            <span className="win-titlebar-btn" aria-hidden="true">&#x2715;</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", padding: "12px", background: "var(--win-btn-face)", alignItems: "flex-start" }}>
          {/* Classic warning icon */}
          <div style={{ flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Warning" role="img">
              <path d="M16 2 L30 28 L2 28 Z" fill="#ffff00" stroke="#000" strokeWidth="1" />
              <rect x="14.5" y="11" width="3" height="9" fill="#000" />
              <rect x="14.5" y="22" width="3" height="3" fill="#000" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px", color: "var(--foreground)" }}>
              pardon the dust!
            </p>
            <p style={{ fontSize: "11px", color: "var(--foreground)", lineHeight: "1.5" }}>
              I am currently migrating my projects to a new{" "}
              <a href="https://www.sanity.io/" target="_blank" style={{ color: "#0000ff", textDecoration: "underline" }}>
                CMS
              </a>
              . All project pages now have a useful one-pager and embedded deliverables, but I am still working on the detailed writeups!
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", padding: "4px 10px 8px 10px", background: "var(--win-btn-face)" }}>
          <button className="win-btn" style={{ minWidth: "70px", fontSize: "11px" }}>
            OK
          </button>
        </div>
      </div>

      {/* Project grid as an Explorer window */}
      <ProjectGrid />
    </main>
  );
}
