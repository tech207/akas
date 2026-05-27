import Link from "next/link";

import { Container } from "@/components/common/Container";
import { FacebookIcon, LinkedinIcon } from "@/components/common/SocialIcons";
import { COMPANY, NAV_ITEMS } from "@/lib/constants";

const externalLinks = [
  {
    label: "雇主違法公告連結",
    href: "https://ilabour.osha.gov.tw/ilabour/wSite/ct?xItem=8840&ctNode=332&mp=3"
  },
  {
    label: "就業歧視連結",
    href: "https://www.wda.gov.tw"
  }
] as const;

export function Footer() {
  return (
    <footer className="border-t border-brand-gold/30 bg-brand-navy">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
          <div>
            <Link
              href="/"
              aria-label={COMPANY.nameEn}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-brand-red"
            >
              <span className="font-sans text-sm font-bold text-white">A-KAS</span>
            </Link>
            <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-brand-stone">
              {COMPANY.tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-white/70 transition-colors hover:text-brand-red"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-white/70 transition-colors hover:text-brand-red"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold">
              QUICK LINKS
            </h2>
            <nav aria-label="Footer navigation" className="mt-3">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-1 font-sans text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold">
              CONTACT US
            </h2>
            <address className="not-italic">
              <p className="mt-3 font-zh text-sm leading-6 text-white/70">
                {COMPANY.addressZh}
              </p>
              <p className="mt-1 font-sans text-xs leading-5 text-white/50">
                {COMPANY.addressEn}
              </p>
              <p className="mt-3 font-sans text-sm leading-6 text-white/70">
                Tel/Fax: {COMPANY.tel}
              </p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-1 inline-block font-sans text-sm text-white/70 transition-colors hover:text-brand-gold"
              >
                Email: {COMPANY.email}
              </a>
            </address>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="font-sans text-xs text-white/40">
              © 2024 {COMPANY.nameEn}. All rights reserved.
            </p>
            <p className="font-sans text-xs text-white/40">{COMPANY.license}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-xs text-white/40 underline transition-colors hover:text-white/70"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
