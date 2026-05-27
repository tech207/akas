import Link from 'next/link'

export function CtaSection() {
  return (
    <section
      className="relative bg-brand-navy py-24 text-center"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.05) 0.5px, transparent 0.5px)',
        backgroundSize: '16px 16px'
      }}
    >
      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <h2 className="font-display text-5xl font-light text-white">準備好了嗎？</h2>
        <p className="mt-4 font-sans text-lg text-brand-gold">
          Ready to find your next executive leader?
        </p>
        <p className="mt-2 font-zh text-sm text-white/60">
          讓我們的顧問團隊為您提供保密諮詢服務。
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block bg-brand-red px-10 py-4 font-sans text-white transition-colors duration-300 hover:bg-red-700"
        >
          聯絡我們　Contact Us
        </Link>
      </div>
    </section>
  )
}
