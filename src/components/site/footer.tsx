import { Heart } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/zora";
import { BrandMark } from "./nav";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-zora-700/40 bg-zora-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-zora-950 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <BrandMark size="lg" />
            <div>
              <p dir="ltr" className="text-gradient-lav text-2xl font-black lowercase tracking-tight">{BRAND.name}</p>
              <p dir="ltr" className="mt-1 text-[10px] font-semibold tracking-[0.34em] text-zora-silver5">reader</p>
              <p className="mt-2 text-sm text-zora-silver3">{BRAND.taglineFa}</p>
              <p dir="ltr" className="text-xs text-zora-silver5">{BRAND.taglineEn}</p>
            </div>
          </div>

          <nav aria-label="پیوندهای فوتر">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm md:flex md:gap-8">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-zora-silver5 transition-colors hover:text-zora-lavh">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#download" className="font-semibold text-zora-lavh transition-colors hover:text-zora-silver">
                  دانلود اپ
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-zora-700/40 pt-8 text-center">
          <p className="flex items-center gap-1.5 text-sm text-zora-silver3">
            ساخته‌شده با
            <Heart className="h-4 w-4 fill-zora-rose text-zora-rose" aria-hidden="true" />
            برای دانش‌آموزان ایران — توسط <span className="font-bold text-zora-silver">{BRAND.founders}</span>
          </p>
          <p className="text-xs text-zora-silver7">
            © zora ۱۴۰۴ – ۱۴۰۵ · سایت رسمی دانلود و اطلاع‌رسانی نسخه‌های جدید zora
          </p>
        </div>
      </div>
    </footer>
  );
}
