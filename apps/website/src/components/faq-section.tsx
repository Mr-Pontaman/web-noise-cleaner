import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@web-noise-cleaner/ui/components/ui/accordion";
import { faqs } from "@/constants";
import { Card, CardContent } from "@web-noise-cleaner/ui/components/ui/card";

export function FaqSection() {
  return (
    <section className="mb-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-12">FAQ</h2>
        <Card>
          <CardContent>
            <Accordion className="w-full" multiple={true}>
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
