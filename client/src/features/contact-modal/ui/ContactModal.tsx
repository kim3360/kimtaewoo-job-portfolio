import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Mail, User, Instagram } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("유효한 이메일을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending email
    setTimeout(() => {
      toast.success("메시지가 전송되었습니다! 곧 연락드리겠습니다.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            연락하기
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">김태우</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">rlaxkd1226@naver.com</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">전화번호</Label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Instagram className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">010-2332-0838</span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
