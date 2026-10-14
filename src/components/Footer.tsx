import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { brand } from "@/data/brand";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-top">
      <div className="footer-brand">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-wordmark"><strong>{brand.logoText}</strong><small>Dubai · United Arab Emirates</small></span>
        </Link>
        <p>Property discovery, grounded in context and clear sourcing.</p>
      </div>
      <div className="footer-column"><h2>Explore</h2><Link to="/properties">Properties</Link><Link to="/locations">Locations</Link><Link to="/developers">Developers</Link><Link to="/guides">Guides</Link></div>
      <div className="footer-column"><h2>Aurevia</h2><Link to="/about">About us</Link><Link to="/services">Our approach</Link><Link to="/faq">FAQs</Link><Link to="/contact">Contact</Link></div>
      <div className="footer-contact"><h2>Start a conversation</h2><p>{brand.email || "Email address to be configured"}<br />{brand.phone || "Telephone to be configured"}</p><Link className="footer-contact-link" to="/contact">Get in touch <ArrowUpRight size={15} /></Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {brand.name}. Brand and contact details are configurable placeholders.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><span>Independent property discovery · No affiliation implied</span></div>
  </footer>
);

export default Footer;
