
import { Heart } from "lucide-react";

const Loading = () => {
  return (
    <main className="min-h-screen bg-[#FBF7F0]">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-[#3B101D] px-5 py-20 sm:py-24">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#641E32] opacity-50 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#C9A45C] opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-5 h-4 w-36 animate-pulse rounded-full bg-[#C9A45C]/30" />

          <div className="mx-auto h-10 w-72 max-w-full animate-pulse rounded-lg bg-white/15 sm:h-12 sm:w-[450px]" />

          <div className="mx-auto mt-5 h-4 w-80 max-w-full animate-pulse rounded bg-white/10" />
          <div className="mx-auto mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-white/10" />

          <div className="mx-auto mt-8 h-12 w-full max-w-md animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        {/* Section Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-[#C9A45C]/40" />
            <div className="h-8 w-56 animate-pulse rounded-lg bg-[#641E32]/10" />
          </div>

          <div className="h-11 w-full animate-pulse rounded-xl bg-[#641E32]/10 sm:w-44" />
        </div>

        {/* Category Filters */}
        <div className="mb-9 flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-[#641E32]/10"
            />
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-[#E8D5D8] bg-white"
            >
              {/* Image */}
              <div className="relative h-56 animate-pulse bg-[#E8D5D8]">
                <div className="absolute right-4 top-4 h-7 w-20 rounded-full bg-white/60" />
              </div>

              {/* Content */}
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#C9A45C]/30" />
                  <div className="h-4 w-16 animate-pulse rounded bg-[#641E32]/10" />
                </div>

                <div className="h-6 w-3/4 animate-pulse rounded bg-[#641E32]/15" />

                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="flex items-center justify-between border-t border-[#E8D5D8] pt-4">
                  <div className="h-6 w-24 animate-pulse rounded bg-[#C9A45C]/20" />

                  <div className="h-10 w-28 animate-pulse rounded-xl bg-[#641E32]/15" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Loading Indicator */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-[#641E32]">
          <Heart className="h-4 w-4 animate-pulse fill-[#C9A45C] text-[#C9A45C]" />
          <span className="font-medium">Finding beautiful wedding services...</span>
        </div>
      </section>
    </main>
  );
};

export default Loading;
