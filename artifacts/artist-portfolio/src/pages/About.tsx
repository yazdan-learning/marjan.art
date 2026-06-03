import { motion } from "framer-motion";
import { useGetAboutSettings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_BIO = `I am a painter working mainly with acrylic and oil, inspired by nature, peaceful landscapes, cozy places, and the emotions hidden in everyday moments. Through my paintings, I try to capture warmth, light, and colour — and the feeling of being truly connected to the natural world.

Each artwork is created with care and patience. Before a brushstroke is made, I spend time observing — not just what a scene looks like, but how it feels. A quiet lake in the early morning, a forest bathed in soft light, a colourful sky at dusk, a peaceful corner of a home. These are the moments I want to hold onto and share.

My goal is to create paintings that bring calm, comfort, and beauty into your space. Thank you for being here and for supporting handmade art.`;

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80";

export default function About() {
  const { data: settings, isLoading } = useGetAboutSettings();

  const bioText = settings?.bioText || DEFAULT_BIO;
  const imageUrl = settings?.imageUrl || DEFAULT_IMAGE;

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-16 items-start">
        <div className="w-full md:w-5/12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="aspect-[3/4] relative"
          >
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <img
                src={imageUrl}
                alt="Artist in studio"
                className="w-full h-full object-cover shadow-lg"
              />
            )}
          </motion.div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl text-foreground"
          >
            About the Artist
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light"
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              bioText.split("\n\n").filter(Boolean).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
