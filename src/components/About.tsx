const About = () => {
  return (
    <section id="about" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">ABOUT</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-4">
                Come Home to Quality
              </h3>
              <p className="text-minimal text-architectural mb-12 tracking-[0.25em]">
                HOME IMPROVEMENT
              </p>

              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  D&amp;C Contracting is run by <span className="text-architectural font-medium">Dylan and Connor</span>,
                  bringing you services that include painting, drywall patching, window
                  replacement, tiling, door replacement, electrical, landscaping, flooring
                  and so much more.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  From small repairs to full remodels, we deliver dependable workmanship,
                  clear communication, and lasting results across Western New York.
                </p>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">WHY CHOOSE US</h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Quality Workmanship</h5>
                    <p className="text-muted-foreground">Attention to detail on every project, large or small</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Clear Communication</h5>
                    <p className="text-muted-foreground">Organized process and dependable project delivery</p>
                  </div>
                  <div className="border-l-2 border-architectural pl-6">
                    <h5 className="text-lg font-medium mb-2">Customer Focused</h5>
                    <p className="text-muted-foreground">Residential experience you can rely on</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">SERVICE AREA</h4>
                    <p className="text-xl">Buffalo &amp; Niagara Falls, NY</p>
                  </div>
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">CONTACT</h4>
                    <p className="text-xl">716-908-1800</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
