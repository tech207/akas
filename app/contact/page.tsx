"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Container } from "@/components/common/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/lib/constants";

const mapUrl =
  "https://maps.google.com/maps?q=台北市松山區八德路2段374號6樓之2&output=embed&hl=zh-TW";

const contactSchema = z.object({
  nameZh: z.string().min(1, "請填寫中文姓名"),
  nameEn: z.string().optional(),
  email: z.string().email("請填寫正確 Email 格式"),
  subject: z.string().optional(),
  message: z.string().min(10, "訊息至少 10 個字")
});

type ContactFormValues = z.infer<typeof contactSchema>;
type SubmitState = "idle" | "success" | "error";

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nameZh: "",
      nameEn: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState("idle");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      setSubmitState("error");
      return;
    }

    reset();
    setSubmitState("success");
  };

  return (
    <>
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">CONTACT</h1>
        <p className="font-zh-serif mt-2 text-2xl text-brand-gold">
          / 聯絡我們
        </p>

        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">
            Home
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>Contact</span>
        </nav>
      </section>

      <section className="bg-brand-red py-10 text-white">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h2 className="font-zh-serif text-xl font-bold">
                {COMPANY.nameZh}
              </h2>
              <p className="mt-1 font-sans text-sm opacity-80">
                {COMPANY.nameEn}
              </p>
              <p className="mt-2 font-sans text-xs opacity-60">
                {COMPANY.tagline}
              </p>
            </div>

            <div>
              <p className="font-zh text-sm">{COMPANY.addressZh}</p>
              <p className="mt-1 font-sans text-xs opacity-70">
                {COMPANY.addressEn}
              </p>
            </div>

            <div>
              <p className="font-mono text-sm">Tel/Fax：{COMPANY.tel}</p>
              <p className="mt-2 font-sans text-sm">
                Email：
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-white hover:underline"
                >
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-cream py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <iframe
                src={mapUrl}
                width="100%"
                height="500"
                style={{ border: 0, borderRadius: "4px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="A-KAS office location"
              />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border border-brand-gold/20 bg-brand-porcelain p-6 shadow-soft sm:p-8"
            >
              <div className="space-y-5">
                <Field
                  label="中文名* (chinese name 中文名)"
                  error={errors.nameZh?.message}
                >
                  <Input {...register("nameZh")} disabled={isSubmitting} />
                </Field>

                <Field
                  label="英文名 (english name 英文名)"
                  error={errors.nameEn?.message}
                >
                  <Input {...register("nameEn")} disabled={isSubmitting} />
                </Field>

                <Field label="Email*" error={errors.email?.message}>
                  <Input
                    type="email"
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="主題 (subject 主題)"
                  error={errors.subject?.message}
                >
                  <Input {...register("subject")} disabled={isSubmitting} />
                </Field>

                <Field
                  label="您的訊息* (your message 您的訊息)"
                  error={errors.message?.message}
                >
                  <Textarea
                    className="min-h-[160px]"
                    {...register("message")}
                    disabled={isSubmitting}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-2 bg-brand-red px-8 py-3 font-zh text-sm text-white transition-colors duration-300 hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    送出中...
                  </>
                ) : (
                  "送出"
                )}
              </button>

              {submitState === "success" && (
                <p className="font-zh mt-4 text-sm text-green-700">
                  感謝您的來信！我們將盡快與您聯繫。
                </p>
              )}
              {submitState === "error" && (
                <p className="font-zh mt-4 text-sm text-red-700">
                  送出失敗，請稍後再試或直接來信 info@a-kas.com
                </p>
              )}
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-zh mb-2 block text-sm text-brand-charcoal">
        {label}
      </span>
      {children}
      {error && <span className="font-zh mt-2 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
