function PackagesLoading() {
  return (
    <>
      <section className="relative -mt-20 flex min-h-[420px] items-center overflow-hidden bg-[#0B2D5C] md:min-h-[520px]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#0B2D5C] via-[#123A6B] to-[#0B2D5C]" />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="h-7 w-56 animate-pulse rounded-lg bg-white/15 md:h-9 md:w-72" />
              <div className="h-5 w-72 animate-pulse rounded-md bg-white/10 md:h-6 md:w-96" />
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
                <div className="h-10 w-56 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[32px] border border-[#0B2D5C]/10 bg-white shadow-sm"
              >
                <div className="aspect-[16/10] animate-pulse bg-[#E5E7EB]" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#E5E7EB]" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-[#E5E7EB]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="h-6 w-28 animate-pulse rounded bg-[#E5E7EB]" />
                    <div className="h-11 w-28 animate-pulse rounded-xl bg-[#0B2D5C]/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default PackagesLoading
