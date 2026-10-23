import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "./not-found.css";

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <header className="not-found-header">
        <a href="/#about" aria-label="김태우 포트폴리오 홈">
          taewoo
        </a>
      </header>
      <main id="main-content" className="not-found-main">
        <div className="not-found-message">
          <p className="not-found-code">404 / PAGE NOT FOUND</p>
          <h1>페이지를 찾을 수 없어요.</h1>
          <p className="not-found-description">
            주소가 변경되었거나 삭제된 페이지입니다.
            <br />
            주소를 확인하거나 홈으로 이동해 주세요.
          </p>
          <div className="not-found-actions">
            <a href="/#about" className="not-found-home">
              <ArrowLeft size={15} aria-hidden="true" />
              홈으로 돌아가기
            </a>
            <a href="/#portfolio">
              프로젝트 보기
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>
      <footer className="not-found-footer">
        © {new Date().getFullYear()} Taewoo Kim
      </footer>
    </div>
  );
}
