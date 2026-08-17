function PackageDetailLoading() {
  return (
    <div>
      <section className="relative -mt-20 flex min-h-[420px] items-start overflow-hidden bg-[#0B2D5C] pb-24 pt-20 md:min-h-[650px] md:items-center md:pb-24">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#0B2D5C] via-[#123A6B] to-[#0B2D5C]" />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-4">
              <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="h-9 w-3/4 animate-pulse rounded-lg bg-white/15 md:h-11" />
              <div className="h-5 w-48 animate-pulse rounded-md bg-white/10" />
              <div className="h-20 w-full max-w-xl animate-pulse rounded-lg bg-white/10" />
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="h-14 w-44 animate-pulse rounded-xl bg-[#D4AF37]/30" />
                <div className="h-14 w-44 animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="mx-auto w-full max-w-sm animate-pulse rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-6 h-5 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-12 w-48 animate-pulse rounded-lg bg-white/10" />
                <div className="mt-6 space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12 py-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <section key={i} className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <div className="mx-auto h-5 w-28 animate-pulse rounded-full bg-[#D4AF37]/20" />
              <div className="mx-auto mt-3 h-8 w-64 animate-pulse rounded-lg bg-[#E5E7EB]" />
              <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#E5E7EB]" />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: i % 2 === 0 ? 3 : 2 }).map((_, j) => (
                <div
                  key={j}
                  className="h-28 animate-pulse rounded-2xl border border-[#0B2D5C]/10 bg-white"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default PackageDetailLoading
