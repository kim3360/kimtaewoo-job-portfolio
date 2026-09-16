export type ContactFormData = {
  name: string
  email: string
  message: string
}

type Web3FormsResponse = {
  success: boolean
  message?: string
}

export async function sendContactMessage(data: ContactFormData) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    throw new Error("CONTACT_NOT_CONFIGURED")
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: data.name,
      email: data.email,
      message: data.message,
      subject: `[포트폴리오] ${data.name}님의 문의`,
      from_name: "Portfolio Contact",
      botcheck: "",
    }),
  })

  const result = (await response.json()) as Web3FormsResponse

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "메시지 전송에 실패했습니다.")
  }

  return result
}
