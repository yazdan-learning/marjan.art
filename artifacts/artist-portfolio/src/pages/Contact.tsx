import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiInstagram } from "react-icons/si";

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-serif text-5xl text-foreground mb-6">Contact</h1>
        <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl mx-auto">
          For inquiries regarding available works, studio visits, or exhibition opportunities, please reach out via email or direct message.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-card p-8 md:p-16 border border-border shadow-sm">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div>
            <h3 className="uppercase tracking-widest text-xs text-muted-foreground mb-3 flex items-center gap-2">
              <Mail size={14} /> Direct Inquiry
            </h3>
            <a
              href="mailto:marjan.artspace@gmail.com"
              className="font-serif text-2xl text-foreground hover:text-primary transition-colors"
              data-testid="link-contact-email"
            >
              marjan.artspace@gmail.com
            </a>
          </div>
          
          <div>
            <h3 className="uppercase tracking-widest text-xs text-muted-foreground mb-3 flex items-center gap-2">
              <SiInstagram size={14} /> Social
            </h3>
            <a
              href="https://instagram.com/marjan.artspace"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl text-foreground hover:text-primary transition-colors"
              data-testid="link-contact-instagram"
            >
              @marjan.artspace
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
