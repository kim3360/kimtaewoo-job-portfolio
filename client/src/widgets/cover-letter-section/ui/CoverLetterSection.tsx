import { coverLetterItems } from "@/entities/profile";
import { Plus } from "lucide-react";
export function CoverLetterSection() {
  return (
    <section
      id="cover-letter"
      className="letter-section page-width section-space"
    >
      <div className="section-heading">
        <span className="small-label">My perspective</span>
        <span className="small-label">The person behind the code</span>
      </div>
      <div className="letter-layout">
        <div>
          <h2 className="serif-section-title">
            코드 너머의 생각,
            <br />
            <em>함께 일하는 방식.</em>
          </h2>
          <p className="section-description">
            무엇을 만들었는지, 그리고 어떻게 일하는지.
            <br />
            개발자로서의 생각을 담았습니다.
          </p>
        </div>
        <div className="letter-list">
          {coverLetterItems.map((item, index) => (
            <details className="letter-item" key={item.title}>
              <summary>
                <span className="small-label">0{index + 1}</span>
                <h3>{item.title}</h3>
                <Plus size={20} strokeWidth={1} />
              </summary>
              <div className="letter-body">
                {item.body.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
