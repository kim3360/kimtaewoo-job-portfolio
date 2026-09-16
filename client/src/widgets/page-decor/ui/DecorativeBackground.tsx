/** 페이지 전역 배경 — 은은한 핑크 글로우만 (그리드/노이즈 없음) */
export default function DecorativeBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,800px)] h-[50vh] bg-pearl-accent/[0.04] blur-[120px] rounded-full" />
    </div>
  );
}
