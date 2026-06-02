import { useParams, useLocation } from "wouter";
import { useGetPainting } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaintingDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = params.id ? parseInt(params.id) : null;
  
  const { data: painting, isLoading, error } = useGetPainting(id!, {
    query: { enabled: !!id, queryKey: ["getPainting", id] }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          <div className="w-full lg:w-3/5">
            <Skeleton className="aspect-square w-full" />
          </div>
          <div className="w-full lg:w-2/5 space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!painting || error) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">Artwork not found</h1>
        <button 
          onClick={() => setLocation("/collections")}
          className="mt-8 text-primary hover:underline uppercase tracking-widest text-sm"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const subject = encodeURIComponent(`Inquiry: ${painting.title}`);
  const emailHref = `mailto:hello@artistname.com?subject=${subject}`;

  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-3/5 bg-card p-4 md:p-8 shadow-sm border border-border"
        >
          <img 
            src={painting.imageUrl || ""} 
            alt={painting.title}
            className="w-full h-auto max-h-[80vh] object-contain mx-auto shadow-md"
          />
        </motion.div>

        {/* Details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-2/5 flex flex-col gap-8 sticky top-32"
        >
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">
              {painting.title}
            </h1>
            <p className="text-xl text-muted-foreground font-serif italic">
              {painting.year}
            </p>
          </div>

          <div className="flex flex-col gap-2 py-6 border-y border-border text-sm tracking-wide text-foreground uppercase">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Medium</span>
              <span>{painting.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size</span>
              <span>{painting.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span>${painting.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium mt-2">
              <span className="text-muted-foreground">Status</span>
              <span className={painting.available ? "text-primary" : "text-muted-foreground"}>
                {painting.available ? "Available" : "Sold"}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed font-light text-lg">
            {painting.description}
          </p>

          <div className="pt-6 flex flex-col gap-4">
            <a 
              href={emailHref}
              data-testid="button-inquire-email"
              className={`flex items-center justify-center gap-3 w-full py-4 text-sm uppercase tracking-widest font-medium transition-all ${
                painting.available 
                  ? "bg-foreground text-background hover:bg-primary" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              onClick={(e) => !painting.available && e.preventDefault()}
            >
              <Mail size={18} />
              {painting.available ? "Inquire About This Piece" : "Sold"}
            </a>
            
            <a
              href="https://instagram.com/artistname"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-inquire-instagram"
              className="flex items-center justify-center gap-3 w-full py-4 border border-border text-foreground text-sm uppercase tracking-widest hover:bg-card transition-colors"
            >
              <SiInstagram size={16} />
              Message on Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
