
'use client';

import { FileText, Sparkles, ArrowRight, Download, Columns3 } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="relative px-6 sm:px-10 py-10 sm:py-14">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 sm:gap-8 max-w-4xl">
        {/* PDF Skeleton Card */}
        <div className="relative">
          <div className="mx-auto w-full max-w-sm">
            <div
              className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 ring-1 ring-rose-200 flex items-center justify-center"
              style={{ animation: 'floaty 4.5s ease-in-out infinite' }}
            >
              <FileText className="w-6 h-6 text-rose-500" />
            </div>
            <div className="mt-3 text-center text-sm font-medium text-slate-500">
              PDF statement
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {/* Document header */}
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-20 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 1.7s linear infinite' }}
                ></div>
                <div
                  className="h-3 w-24 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 1.8s linear infinite .2s' }}
                ></div>
              </div>
              {/* Lines */}
              <div className="mt-4 space-y-2.5">
                <div
                  className="h-3 w-11/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 1.9s linear infinite' }}
                ></div>
                <div
                  className="h-3 w-9/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 1.9s linear infinite .15s' }}
                ></div>
                <div
                  className="h-3 w-10/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 2s linear infinite .3s' }}
                ></div>
                <div
                  className="h-3 w-8/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 2s linear infinite .45s' }}
                ></div>
                <div
                  className="h-3 w-7/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 2.1s linear infinite .6s' }}
                ></div>
              </div>
              {/* Footer line */}
              <div
                className="mt-4 h-3 w-5/12 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                style={{ animation: 'shimmer 2.2s linear infinite .75s' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Center: Flow / Transition */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[220px] mx-auto">
            {/* Flow rail */}
            <div className="h-14 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 ring-1 ring-slate-200/70 shadow-inner flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Sparkles
                  className="w-5 h-5 text-teal-500"
                  style={{ animation: 'pulseSoft 2.6s ease-in-out infinite' }}
                />
                <div className="text-sm font-medium text-slate-600">
                  Converting
                </div>
              </div>
            </div>

            {/* Animated arrow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20 flex items-center justify-center text-white"
                style={{ animation: 'swapArrow 1.8s ease-in-out infinite' }}
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Floating particles left-to-right */}
            <div className="pointer-events-none absolute inset-0">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-sky-400/70"
                style={{ '--dx': '11rem', '--dy': '-0.3rem', animation: 'moveParticles 2.8s ease-in-out infinite' } as React.CSSProperties}
              ></span>
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-cyan-400/70"
                style={{ '--dx': '10.5rem', '--dy': '0.25rem', animation: 'moveParticles 3.1s ease-in-out .25s infinite' } as React.CSSProperties}
              ></span>
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 h-[7px] w-[7px] rounded-full bg-teal-400/70"
                style={{ '--dx': '11.4rem', '--dy': '-0.1rem', animation: 'moveParticles 3.4s ease-in-out .5s infinite' } as React.CSSProperties}
              ></span>
            </div>
          </div>
        </div>

        {/* Excel Skeleton Card */}
        <div className="relative">
          <div className="mx-auto w-full max-w-sm">
            <div
              className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 ring-1 ring-emerald-200 flex items-center justify-center"
              style={{ animation: 'floaty 4.5s ease-in-out 1.2s infinite' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-600"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M8 13h2"></path><path d="M14 13h2"></path><path d="M8 17h2"></path><path d="M14 17h2"></path></svg>
            </div>
            <div className="mt-3 text-center text-sm font-medium text-slate-500">
              Excel sheet
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {/* Grid header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="h-3 w-28 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
                  style={{ animation: 'shimmer 1.7s linear infinite .1s' }}
                ></div>
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 rounded-md bg-emerald-100/80 ring-1 ring-emerald-200 flex items-center justify-center">
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="h-6 w-6 rounded-md bg-emerald-100/70 ring-1 ring-emerald-200/80 flex items-center justify-center">
                    <Columns3 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>
              {/* Grid cells */}
              <div className="grid grid-cols-6 gap-1.5">
                {/* Row 1 */}
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 1.9s linear infinite' }}></div>
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite .15s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-emerald-200 via-emerald-100 to-emerald-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2.1s linear infinite .3s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite .45s' }}></div>
                {/* Row 2 */}
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite .6s' }}></div>
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2.1s linear infinite .75s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-emerald-200 via-emerald-100 to-emerald-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite .9s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2.1s linear infinite 1.05s' }}></div>
                {/* Row 3 */}
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite 1.2s' }}></div>
                <div className="col-span-2 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2.1s linear infinite 1.35s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-emerald-200 via-emerald-100 to-emerald-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s linear infinite 1.5s' }}></div>
                <div className="col-span-1 h-7 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" style={{ animation: 'shimmer 2.1s linear infinite 1.65s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
