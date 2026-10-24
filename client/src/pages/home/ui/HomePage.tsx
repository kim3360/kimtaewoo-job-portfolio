import { useEffect, useState } from "react";

const referenceTitle = "김태우 | 프론트엔드 개발자";

function initialReferenceUrl() {
  const query = new URLSearchParams();
  const current = new URLSearchParams(window.location.search);
  for (const key of ["motion", "debug"]) {
    const value = current.get(key);
    if (value) query.set(key, value);
  }
  const legacyAnchors: Record<string, string> = {
    "#about": "#top",
    "#career": "#experience",
    "#cover-letter": "#contact",
    "#letter": "#contact",
  };
  const hash = legacyAnchors[window.location.hash] ?? window.location.hash;
  const search = query.toString();
  return `/resume-reference/index.html${search ? `?${search}` : ""}${hash}`;
}

export function HomePage() {
  const [source] = useState(initialReferenceUrl);

  useEffect(() => {
    const previousTitle = document.title;
    const previousOverflow = document.body.style.overflow;
    document.title = referenceTitle;
    document.body.style.overflow = "hidden";

    // Preserve the original document's GSAP/Lenis lifecycle and DOM ownership
    // without allowing its global styles to affect existing React routes.
    return () => {
      document.title = previousTitle;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <iframe
      src={source}
      title={referenceTitle}
      style={{
        position: "fixed",
        inset: 0,
        display: "block",
        width: "100%",
        height: "100dvh",
        border: 0,
        background: "#fff",
      }}
    />
  );
}
