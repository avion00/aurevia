

const Services = () => {
  const services = [
    {
      number: "01",
      title: "GENERAL CONTRACTING",
      description: "Complete project coordination and contracting support from planning to completion"
    },
    {
      number: "02",
      title: "RESIDENTIAL CONSTRUCTION",
      description: "Reliable construction and improvement services for homes and residential properties"
    },
    {
      number: "03",
      title: "COMMERCIAL CONSTRUCTION",
      description: "Professional contracting solutions for commercial spaces and business properties"
    },
    {
      number: "04",
      title: "RENOVATION & REMODELING",
      description: "Upgrade, improve, and transform existing spaces with quality renovation work"
    },
    {
      number: "05",
      title: "REPAIRS & MAINTENANCE",
      description: "Dependable repair and maintenance services to keep properties in excellent condition"
    },
    {
      number: "06",
      title: "INTERIOR WORK",
      description: "Professional interior improvements, finishing, remodeling, and repair solutions"
    },
    {
      number: "07",
      title: "EXTERIOR WORK",
      description: "Exterior construction, improvement, repair, and property enhancement services"
    },
    {
      number: "08",
      title: "PROPERTY IMPROVEMENTS",
      description: "Practical and professional upgrades that improve the value, function, and appearance of properties"
    },
    {
      number: "09",
      title: "CUSTOM PROJECT SOLUTIONS",
      description: "Tailored contracting solutions designed around the unique needs of your project"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h1 className="text-minimal text-muted-foreground mb-4">SERVICES</h1>
              <h2 className="text-4xl md:text-6xl font-light text-architectural">
                What We Do
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
              {services.map((service, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-6">
                    <span className="text-minimal text-muted-foreground font-medium">
                      {service.number}
                    </span>
                    <div>
                      <h3 className="text-2xl font-light mb-4 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                        {service.title}
                      </h3>
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
    </div>
  );
};

export default Services;