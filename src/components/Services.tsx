const Services = () => {
  const services = [
    {
      number: "01",
      title: "PAINTING & DRYWALL",
      description: "Interior and exterior painting plus expert drywall patching for a clean, finished look."
    },
    {
      number: "02",
      title: "TILING & FLOORING",
      description: "Tile work, hardwood, and plank flooring installations done with precision and care."
    },
    {
      number: "03",
      title: "DOORS & WINDOWS",
      description: "Window replacement and door installation that boost curb appeal and efficiency."
    },
    {
      number: "04",
      title: "ELECTRICAL & LANDSCAPING",
      description: "Reliable electrical work and outdoor landscaping to complete every home improvement project."
    }
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">SERVICES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Home Improvement, Done Right
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-6">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {service.number}
                  </span>
                  <div>
                    <h4 className="text-2xl font-light mb-4 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
