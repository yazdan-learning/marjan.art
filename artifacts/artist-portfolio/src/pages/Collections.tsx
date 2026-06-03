import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListPaintings, useListSeries } from "@workspace/api-client-react";
import { PaintingCard } from "@/components/PaintingCard";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "medium" | "series";

export default function Collections() {
  const [viewMode, setViewMode] = useState<ViewMode>("medium");
  const [filter, setFilter] = useState<string>("All");

  const { data: paintings, isLoading: paintingsLoading } = useListPaintings();
  const { data: series, isLoading: seriesLoading } = useListSeries();

  const mediums = ["All", ...Array.from(new Set((paintings ?? []).map(p => p.medium).filter(Boolean))).sort()];

  const isLoading = paintingsLoading || seriesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col items-center mb-16 gap-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const allPaintings = paintings || [];
  const allSeries = series || [];

  const filteredPaintings =
    filter === "All" ? allPaintings : allPaintings.filter((p) => p.medium === filter);

  const paintingsBySeries = allSeries.map((s) => ({
    series: s.name,
    works: allPaintings.filter((p) => p.seriesId === s.id),
  })).filter(group => group.works.length > 0);

  const uncollected = allPaintings.filter((p) => !p.seriesId);

  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col items-center mb-16 gap-8">
        <h1 className="font-serif text-5xl text-foreground text-center">
          Collections
        </h1>

        {/* View Toggle */}
        <div
          className="flex items-center gap-1 border border-border p-1"
          data-testid="toggle-view-mode"
        >
          <button
            onClick={() => setViewMode("medium")}
            data-testid="button-view-medium"
            className={`px-5 py-1.5 uppercase tracking-widest text-xs font-medium transition-colors ${
              viewMode === "medium"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            By Medium
          </button>
          <button
            onClick={() => setViewMode("series")}
            data-testid="button-view-series"
            className={`px-5 py-1.5 uppercase tracking-widest text-xs font-medium transition-colors ${
              viewMode === "series"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            By Series
          </button>
        </div>

        {/* Medium Filters — only shown in medium view */}
        <AnimatePresence>
          {viewMode === "medium" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8"
            >
              {mediums.map((m) => (
                <button
                  key={m}
                  onClick={() => setFilter(m)}
                  data-testid={`button-filter-${m.toLowerCase()}`}
                  className={`uppercase tracking-widest text-xs font-medium pb-1 border-b-2 transition-colors ${
                    filter === m
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Medium View */}
      <AnimatePresence mode="wait">
        {viewMode === "medium" && (
          <motion.div
            key="medium-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredPaintings.map((painting) => (
                  <motion.div
                    key={painting.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                  >
                    <PaintingCard painting={painting as any} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredPaintings.length === 0 && (
              <div className="py-24 text-center text-muted-foreground font-serif text-xl">
                No pieces available in this medium at the moment.
              </div>
            )}
          </motion.div>
        )}

        {/* Series View */}
        {viewMode === "series" && (
          <motion.div
            key="series-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-20"
          >
            {paintingsBySeries.map(({ series, works }, groupIndex) => (
              <motion.section
                key={series}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
              >
                <div className="flex items-end gap-6 mb-8 border-b border-border pb-4">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                    {series}
                  </h2>
                  <span className="text-muted-foreground text-sm tracking-widest uppercase mb-1">
                    {works.length} {works.length === 1 ? "work" : "works"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {works.map((painting) => (
                    <PaintingCard key={painting.id} painting={painting as any} />
                  ))}
                </div>
              </motion.section>
            ))}

            {uncollected.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: paintingsBySeries.length * 0.1,
                  duration: 0.5,
                }}
              >
                <div className="flex items-end gap-6 mb-8 border-b border-border pb-4">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                    Individual Works
                  </h2>
                  <span className="text-muted-foreground text-sm tracking-widest uppercase mb-1">
                    {uncollected.length}{" "}
                    {uncollected.length === 1 ? "work" : "works"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {uncollected.map((painting) => (
                    <PaintingCard key={painting.id} painting={painting as any} />
                  ))}
                </div>
              </motion.section>
            )}
            
            {allPaintings.length === 0 && (
              <div className="py-24 text-center text-muted-foreground font-serif text-xl">
                No collections available at the moment.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
