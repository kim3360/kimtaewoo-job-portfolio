import { useState } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Github, Mail, ArrowUpRight } from "lucide-react"
import { sendContactMessage } from "@/features/contact-form"

const whyMePoints = [
  "React와 TypeScript를 중심으로 웹·모바일 서비스를 직접 다뤄 본 경험이 있습니다. UI 구현부터 API 연동, 상태 관리까지 담당하며 디자이너·백엔드와 긴밀히 소통해 왔습니다. 팀 목표를 우선하며 일정 안에 완성도 있는 결과를 만들어냅니다.",
  "사용자가 처음 만나는 화면부터 로딩·에러 처리까지 세심하게 다룹니다. 재사용 가능한 컴포넌트와 읽기 쉬운 코드를 지향하고, 동작과 경험 두 가지를 모두 놓치지 않으려 합니다. 유지보수하기 좋은 프론트엔드가 팀 전체의 속도를 높인다고 믿습니다.",
  "새로운 기술을 빠르게 익혀 프로젝트에 적용하는 것을 즐기며, 함께 배우고 성장할 수 있는 환경을 찾고 있습니다. 코드 리뷰와 피드백을 주고받으며 서로의 결과물을 높이는 문화를 좋아합니다. 좋은 제품을 만들기 위해 끊임없이 고민하고 실행하는 동료와 일하고 싶습니다.",
]

const socialLinks = [
  {
    label: "Email",
    href: "mailto:rlaxkd1226@naver.com",
    icon: Mail,
    value: "rlaxkd1226@naver.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/kim3360",
    icon: Github,
    value: "@kim3360",
  },
]

export const ContactComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("모든 필드를 입력해주세요")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("유효한 이메일을 입력해주세요")
      return
    }

    setIsSubmitting(true)

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })
      toast.success("메시지가 전송되었습니다!")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      if (error instanceof Error && error.message === "CONTACT_NOT_CONFIGURED") {
        toast.error("메일 전송 설정이 필요합니다. 관리자에게 직접 연락해 주세요.")
      } else {
        toast.error(error instanceof Error ? error.message : "메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contactme" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-pearl-accent/20 to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 md:mb-28">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-base md:text-lg font-medium mb-4 text-muted-foreground">Let&apos;s</p>
            <h2 className="display-title text-[clamp(4rem,14vw,9rem)] mb-8 gradient-text">Connect</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-2">저에 대해 궁금한 점이 있으시다면 편하게 연락 주세요.</p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">경력, 프로젝트, 협업 방식 등 무엇이든 괜찮습니다. 메시지 남겨 주시면 성심껏 답변드리겠습니다.</p>

            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-4 p-4 border border-border/60 bg-pearl-surface/40 hover:border-pearl-accent/50 hover:bg-pearl-accent/5 transition-all duration-300 card-shine">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border border-border group-hover:border-pearl-accent/50 group-hover:text-pearl-accent transition-colors">
                    <link.icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{link.label}</p>
                    <p className="text-sm font-medium truncate">{link.value}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-pearl-accent transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} onSubmit={handleSubmit} className="space-y-8 lg:pt-16 p-8 md:p-10 border border-border/60 bg-pearl-surface/30 backdrop-blur-sm">
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold tracking-[0.25em] uppercase mb-3 text-muted-foreground">
                Full Name *
              </label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} className="form-field" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold tracking-[0.25em] uppercase mb-3 text-muted-foreground">
                Email *
              </label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="form-field" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-[10px] font-bold tracking-[0.25em] uppercase mb-3 text-muted-foreground">
                Message *
              </label>
              <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="form-field resize-none" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="contact-btn contact-btn-glow w-full disabled:opacity-50 relative">
              <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
            </button>
          </motion.form>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="border-t border-border/60 pt-16 md:pt-20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-pearl-accent" />
            Why me?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {whyMePoints.map((text) => (
              <p key={text} className="text-muted-foreground leading-[1.85] text-sm md:text-base">
                {text}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="spaced-letters mt-20 md:mt-28" aria-hidden>
          {"CONTACT".split("").map((letter, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
