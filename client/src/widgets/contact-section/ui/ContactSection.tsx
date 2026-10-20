import { useState } from "react";
import { toast } from "sonner";
import { PortfolioMarks } from "@/shared/ui/PortfolioMarks";
import { ArrowUpRight } from "lucide-react";
import { sendContactMessage } from "@/features/contact-form";

const socialLinks = [
  {
    label: "Email",
    href: "mailto:rlaxkd1226@naver.com",
    value: "rlaxkd1226@naver.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/kim3360",
    value: "@kim3360",
  },
];

export const ContactComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("유효한 이메일을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      toast.success("메시지가 전송되었습니다!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "CONTACT_NOT_CONFIGURED"
      ) {
        toast.error(
          "메일 전송 설정이 필요합니다. 관리자에게 직접 연락해 주세요.",
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contactme" className="contact-section section-space">
      <div className="page-width">
        <div className="section-heading">
          <span className="small-label">05 / Get in touch</span>
          <span className="small-label">
            Good things start with a conversation
          </span>
        </div>
        <div className="contact-layout">
          <div className="contact-intro">
            <PortfolioMarks className="marks-small" />
            <h2 className="serif-section-title">
              Let’s make
              <br />
              <em>something good.</em>
            </h2>
            <p className="section-description">
              좋은 경험을 만드는 일, 함께 이야기해요.
              <br />
              프로젝트와 협업에 관한 연락을 기다립니다.
            </p>
            <div className="contact-socials">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  <span className="small-label">{link.label}</span>
                  <span>{link.value}</span>
                  <ArrowUpRight size={18} strokeWidth={1} />
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            <p className="small-label">Leave a note</p>
            <div className="form-two-columns">
              <div>
                <label htmlFor="contact-name">
                  이름 <span>Name</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="성함을 알려주세요"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="contact-email">
                  이메일 <span>Email</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="답변받으실 이메일"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message">
                메시지 <span>Message</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="어떤 이야기를 나누고 싶으신가요?"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={5000}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="send-button"
            >
              <span>{isSubmitting ? "Sending…" : "Send message"}</span>
              <ArrowUpRight size={20} strokeWidth={1} />
            </button>
          </form>
        </div>
        <div className="contact-closing">
          <span>
            Thank you for
            <br />
            your time.
          </span>
          <PortfolioMarks />
        </div>
      </div>
    </section>
  );
};
