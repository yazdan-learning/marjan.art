import { Painting } from "@/data/paintings";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function PaintingCard({ painting }: { painting: Painting }) {
  return (
    <Link href={`/paintings/${painting.id}`}>
      <motion.div 
        className="group cursor-pointer flex flex-col gap-4"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        data-testid={`card-painting-${painting.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={painting.imageUrl}
            alt={painting.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {!painting.available && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-background/90 text-foreground px-4 py-1.5 text-xs font-medium tracking-widest uppercase border border-border shadow-sm">
                Sold
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl text-foreground">{painting.title}</h3>
          <div className="flex justify-between items-center text-sm text-muted-foreground font-sans tracking-wide">
            <span>{painting.medium}</span>
            <span>${painting.price.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
