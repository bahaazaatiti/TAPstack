import { Button } from "@/components/ui/button";

interface CtaProps {
  heading: string;
  description: string;
  primarybuttontext: string;
  primarybuttonurl: string;
  secondarybuttontext?: string;
  secondarybuttonurl?: string;
}

const Cta = ({
  heading = "Call to Action",
  description = "Build faster with our collection of pre-built blocks. Speed up your development and ship features in record time.",
  primarybuttontext = "Buy Now",
  primarybuttonurl = "https://www.shadcnblocks.com",
  secondarybuttontext,
  secondarybuttonurl,
}: CtaProps) => {
  return (
    <section className="py-32 w-full">
      <div className="container mx-auto max-w-screen-lg">
        <div className="bg-accent flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12 px-6">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="text-muted-foreground max-w-xl lg:text-lg">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {secondarybuttontext && (
              <Button variant="outline" size="lg" asChild>
                <a href={secondarybuttonurl}>{secondarybuttontext}</a>
              </Button>
            )}
            {primarybuttontext && (
              <Button asChild variant="default" size="lg">
                <a href={primarybuttonurl}>{primarybuttontext}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta };

export default Cta;
