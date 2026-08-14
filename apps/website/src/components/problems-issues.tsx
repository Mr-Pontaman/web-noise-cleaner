import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@web-noise-cleaner/ui/components/ui/accordion";
import { issues } from "@/constants";
import { Card, CardContent } from "@web-noise-cleaner/ui/components/ui/card";

export const IssueSection = () => {
  return (
    <section className="mb-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-12">使用上の問題点</h2>
        <Card>
          <CardContent>
            <Accordion className="w-full" multiple={true}>
              {issues.map((item, index) => (
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {item.issue}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.detail}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
