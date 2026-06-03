import { Link } from "wouter";
import { useListPaintings } from "@workspace/api-client-react";
import { PaintingCard } from "@/components/PaintingCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: paintings, isLoading } = useListPaintings();

  if (isLoading) {
    return (
      <div className="w-full">
        <section className="container mx-auto px-6 py-12 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="w-full lg:w-1/2">
              <Skeleton className="aspect-[4/5] w-full" />
            </div>
          </div>
        </section>
        <section className="bg-card py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const featuredPainting = paintings?.find(p => p.featured) ?? paintings?.[0];
  const recentWorks = paintings?.filter(p => p.id !== featuredPainting?.id).slice(0, 3) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="w-full lg:w-1/2 flex flex-col gap-8 order-2 lg:order-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-serif text-5xl md:text-7xl leading-tight text-foreground"
            >
              Quiet moments, <br/>
              <span className="text-primary italic">captured in pigment.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              "I paint to capture the warmth hidden in everyday moments — the light on a quiet lake, the glow of a colorful sky, the peace of a place that feels like home."
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link 
                href="/collections" 
                className="inline-block border-b border-foreground pb-1 uppercase tracking-widest text-sm font-medium hover:text-primary hover:border-primary transition-colors"
                data-testid="link-view-gallery"
              >
                View the Gallery
              </Link>
            </motion.div>
          </div>
          
          {featuredPainting && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full lg:w-1/2 order-1 lg:order-2"
            >
              <Link href={`/paintings/${featuredPainting.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted group cursor-pointer shadow-xl">
                  <img 
                    src={featuredPainting.imageUrl || ""} 
                    alt={featuredPainting.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="font-serif text-2xl text-foreground">{featuredPainting.title}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="bg-card py-24 mt-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Recent Works</h2>
            <Link 
              href="/collections"
              className="hidden md:block uppercase tracking-widest text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {recentWorks.map((painting, index) => (
              <motion.div
                key={painting.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <PaintingCard painting={painting as any} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link 
              href="/collections"
              className="inline-block border border-border px-8 py-3 uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-colors"
            >
              View All Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
