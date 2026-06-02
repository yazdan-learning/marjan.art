import { Link } from "wouter";
import { SiInstagram } from "react-icons/si";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-16 bg-card">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <Link href="/" className="font-serif text-xl tracking-wide text-foreground">
            MARJAN
          </Link>
          <p className="text-sm text-muted-foreground mt-2 font-sans tracking-wide">
            Contemporary Fine Art
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <a
            href="mailto:hello@artistname.com"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
            data-testid="link-footer-email"
          >
            <Mail size={16} strokeWidth={1.5} />
            <span>Inquire</span>
          </a>
          <a
            href="https://instagram.com/artistname"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
            data-testid="link-footer-instagram"
          >
            <SiInstagram size={14} />
            <span>Studio</span>
          </a>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 text-center md:text-left text-xs text-muted-foreground/60 tracking-wider">
        &copy; {new Date().getFullYear()} Marjan. All rights reserved.
      </div>
    </footer>
  );
}
