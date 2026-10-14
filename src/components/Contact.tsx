const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">GET IN TOUCH</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Start Your
                <br />
                Project Today
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">EMAIL</h4>
                  <a href="mailto:dylanszal9912@gmail.com" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    dylanszal9912@gmail.com
                  </a>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">PHONE</h4>
                  <div className="space-y-1">
                    <a href="tel:+17168634913" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                      716-863-4913
                    </a>
                    <a href="tel:+17169081800" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                      716-908-1800
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">SERVICE AREA</h4>
                  <address className="text-xl not-italic">
                    WNY · Buffalo WNY · Buffalo WNY · Buffalo, NY · United States Niagara Falls, NY Niagara Falls, NY
                  </address>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">HOURS</h4>
                  <p className="text-xl">Always open</p>
                </div>

              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">FOLLOW US</h4>
                <div className="space-y-4">
                  <a href="https://www.facebook.com/profile.php?id=61589264420672" target="_blank" rel="noopener noreferrer" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Facebook
                  </a>
                </div>
              </div>
              
              <div className="pt-12 border-t border-border">
                <p className="text-muted-foreground">
                  D&amp;C Contracting provides professional construction, renovation, remodeling,
                  and contracting services for residential and commercial projects. Contact us
                  for a free quote and let's discuss your next project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;