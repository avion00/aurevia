import { Link } from "react-router-dom";
import { Hammer, Paintbrush, Home, Wrench, TreePine, Zap, Phone, MapPin } from "lucide-react";
import projectKitchen from "@/assets/project-kitchen-1.jpg";
import projectBathroom from "@/assets/project-bathroom-1.jpg";

const About = () => {
  const services = [
    { icon: Paintbrush, label: "Painting & Drywall" },
    { icon: Home, label: "Tiling & Flooring" },
    { icon: Wrench, label: "Doors & Windows" },
    { icon: Zap, label: "Electrical Work" },
    { icon: TreePine, label: "Landscaping" },
    { icon: Hammer, label: "Framing & Remodels" },
  ];

  const process = [
    { step: "01", title: "Free Quote", description: "Reach out and we'll visit, listen, and provide a clear no-pressure estimate." },
    { step: "02", title: "Plan & Schedule", description: "We line up materials, timelines, and keep you in the loop every step." },
    { step: "03", title: "Quality Build", description: "Dylan, Connor, and crew get to work with care, precision, and respect for your home." },
    { step: "04", title: "Walkthrough", description: "We finish with a final walkthrough to make sure every detail meets your expectations." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h1 className="text-minimal text-muted-foreground mb-4">ABOUT</h1>
                <h2 className="text-4xl md:text-6xl font-light text-architectural mb-4">
                  About D&amp;C Contracting
                </h2>
                <p className="text-minimal text-architectural mb-12 tracking-[0.25em]">
                  HOME IMPROVEMENT — COME HOME TO QUALITY
                </p>

                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    D&amp;C Contracting is run by <span className="text-architectural font-medium">Dylan and Connor</span>,
                    two hands-on craftsmen serving homeowners across Western New York. We
                    bring you services that include painting, drywall patching, window
                    replacement, tiling, door replacement, electrical, landscaping,
                    flooring and so much more.
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Whether it's a small repair or a full remodel, our goal is the same:
                    deliver quality results, on time, with clear communication from start
                    to finish.
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-6">WHY CHOOSE US</h3>
                  <div className="space-y-6">
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Quality Workmanship</h4>
                      <p className="text-muted-foreground">Attention to detail on every residential project, large or small</p>
                    </div>
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Clear Communication</h4>
                      <p className="text-muted-foreground">Organized project process and dependable updates throughout</p>
                    </div>
                    <div className="border-l-2 border-architectural pl-6">
                      <h4 className="text-lg font-medium mb-2">Customer Satisfaction</h4>
                      <p className="text-muted-foreground">Reliable, professional service focused on lasting results</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">SERVICE AREA</h3>
                      <p className="text-xl">Buffalo &amp; Niagara Falls, NY</p>
                    </div>
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">EXPERIENCE</h3>
                      <p className="text-xl">Residential Home Improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img
                src={projectKitchen}
                alt="D&C Contracting kitchen remodel"
                className="w-full h-[60vh] object-cover"
              />
            </div>
            <div>
              <h3 className="text-minimal text-muted-foreground mb-4">OUR STORY</h3>
              <h4 className="text-3xl md:text-5xl font-light text-architectural mb-8">
                Two craftsmen.
                <br />
                One standard.
              </h4>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  D&amp;C was founded by Dylan and Connor, two locals who grew up around
                  tools, jobsites, and the kind of work ethic that finishes what it
                  starts. After years working in the trades, they teamed up to offer
                  homeowners a better experience — one built on honesty and craftsmanship.
                </p>
                <p>
                  Today, D&amp;C Contracting helps families across Buffalo and Niagara
                  Falls upgrade and protect their homes — from a fresh coat of paint to
                  a full kitchen remodel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h3 className="text-minimal text-muted-foreground mb-4">WHAT WE DO</h3>
              <h4 className="text-3xl md:text-5xl font-light text-architectural">
                Everything your home needs.
              </h4>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div
                  key={i}
                  className="border border-border p-8 hover:border-architectural transition-colors duration-500 group"
                >
                  <s.icon className="w-8 h-8 mb-6 text-architectural group-hover:scale-110 transition-transform duration-500" />
                  <h5 className="text-xl font-light text-architectural">{s.label}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h3 className="text-minimal text-muted-foreground mb-4">OUR PROCESS</h3>
              <h4 className="text-3xl md:text-5xl font-light text-architectural">
                Simple, organized, dependable.
              </h4>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {process.map((p) => (
                <div key={p.step}>
                  <span className="text-minimal text-muted-foreground">{p.step}</span>
                  <h5 className="text-2xl font-light text-architectural mt-3 mb-4">{p.title}</h5>
                  <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-5xl md:text-6xl font-light text-architectural mb-3">100%</p>
              <p className="text-minimal text-muted-foreground">FREE ESTIMATES</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-light text-architectural mb-3">10+</p>
              <p className="text-minimal text-muted-foreground">SERVICES OFFERED</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-light text-architectural mb-3">WNY</p>
              <p className="text-minimal text-muted-foreground">LOCALLY OWNED</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-minimal text-primary-foreground/60 mb-4">GET IN TOUCH</h3>
            <h4 className="text-4xl md:text-6xl font-light text-architectural mb-10">
              Ready to start your project?
            </h4>
            <p className="text-lg text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get a free, no-pressure quote from Dylan and Connor. We'd love to hear
              what you're working on.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="tel:7169081800"
                className="flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary hover:opacity-80 transition-opacity"
              >
                <Phone className="w-4 h-4" />
                <span className="text-minimal">716-908-1800</span>
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-8 py-4 border border-primary-foreground/40 hover:border-primary-foreground transition-colors"
              >
                <span className="text-minimal">REQUEST A QUOTE</span>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-3 text-primary-foreground/60">
              <MapPin className="w-4 h-4" />
              <p className="text-minimal">SERVING BUFFALO &amp; NIAGARA FALLS, NY</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
