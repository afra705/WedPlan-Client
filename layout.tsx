
import React from "react";

const Layout = () => {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50">
      {/* Navbar Skeleton */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-9 w-32 rounded-lg bg-gray-200" />

          <div className="hidden items-center gap-6 md:flex">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-4 w-16 rounded bg-gray-200"
              />
            ))}
          </div>

          <div className="h-10 w-28 rounded-lg bg-gray-200" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {/* Hero Section Skeleton */}
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <div className="h-5 w-32 rounded-full bg-gray-200" />
            <div className="h-10 w-full max-w-lg rounded-lg bg-gray-200" />
            <div className="h-10 w-4/5 rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
            <div className="flex gap-3 pt-3">
              <div className="h-12 w-36 rounded-lg bg-gray-200" />
              <div className="h-12 w-32 rounded-lg bg-gray-200" />
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-gray-200 md:h-80" />
        </section>

        {/* Statistics Skeleton */}
        <section className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="h-8 w-12 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </section>

        {/* Featured Section Skeleton */}
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="h-8 w-64 rounded-lg bg-gray-200" />
            <div className="h-4 w-80 max-w-full rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-200" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-10 w-32 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Skeleton */}
        <section className="space-y-4 rounded-2xl bg-gray-200 p-10">
          <div className="mx-auto h-8 w-64 max-w-full rounded bg-gray-300" />
          <div className="mx-auto h-4 w-80 max-w-full rounded bg-gray-300" />
          <div className="mx-auto h-11 w-36 rounded-lg bg-gray-300" />
        </section>
      </main>
    </div>
  );
};

export default Layout;
