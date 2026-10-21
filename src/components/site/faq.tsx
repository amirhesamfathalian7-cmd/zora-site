"use client";

import { MessageCircleQuestion } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/zora";
import { Reveal } from "./reveal";

export function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zora-lav/25 bg-zora-tint/60 px-4 py-1.5 text-xs font-bold text-zora-lavh">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            سوالات پرتکرار
          </span>
          <h2 className="text-3xl font-black leading-snug text-zora-silver sm:text-4xl">
            هرچه می‌خواهی <span className="text-gradient-lav">بپرس</span>
          </h2>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-zora-700/60 bg-zora-900/60 px-5 transition-colors data-[state=open]:border-zora-lav/35 data-[state=open]:bg-zora-850"
              >
                <AccordionTrigger className="py-4 text-start text-[15px] font-extrabold text-zora-silver hover:no-underline [&[data-state=open]>svg]:text-zora-lav">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-8 text-zora-silver5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
