import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selamat Ulang Tahun, Sayang 💗" },
      { name: "description", content: "Sebuah hadiah kecil penuh cinta untuk hari spesialmu." },
      { property: "og:title", content: "Selamat Ulang Tahun, Sayang 💗" },
      { property: "og:description", content: "Sebuah hadiah kecil penuh cinta untuk hari spesialmu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const reasons = [
  { emoji: "🌸", title: "Senyummu", text: "Satu senyummu cukup untuk membuat hari terburukku jadi indah." },
  { emoji: "☕", title: "Kencan Pertama", text: "Kopi yang dingin karena kita terlalu asyik bercerita berjam-jam." },
  { emoji: "🫶", title: "Kebaikanmu", text: "Caramu peduli pada semua orang membuatku jatuh cinta setiap hari." },
  { emoji: "🌙", title: "Obrolan Malam", text: "Telepon larut malam yang tak pernah ingin kuakhiri." },
  { emoji: "🎈", title: "Tawamu", text: "Tawa lucumu adalah lagu favoritku sepanjang masa." },
  { emoji: "💌", title: "Kamu, Apa Adanya", text: "Karena kamu adalah rumah tempat hatiku selalu pulang." },
];

const photos = [
  { src: g1, alt: "Senja berdua di pantai", w: 896, h: 1280 },
  { src: g2, alt: "Kue ulang tahun stroberi", w: 1024, h: 1024 },
  { src: g4, alt: "Buket mawar dan surat cinta", w: 1024, h: 1024 },
  { src: g3, alt: "Bergandengan tangan dengan balon", w: 896, h: 1280 },
];

const floaters = [
  { c: "💗", pos: "top-[12%] left-[8%] text-4xl", d: "0s" },
  { c: "🎀", pos: "top-[20%] right-[10%] text-5xl", d: "1s" },
  { c: "✨", pos: "bottom-[22%] left-[14%] text-3xl", d: "2s" },
  { c: "🎈", pos: "bottom-[14%] right-[16%] text-5xl", d: "0.5s" },
  { c: "💕", pos: "top-[45%] right-[4%] text-3xl hidden sm:block", d: "1.5s" },
];

function Index() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-item", { y: 40, opacity: 0, duration: 0.9, stagger: 0.18 })
          .from(".floater", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el, i) => {
          gsap.from(el, {
            y: 50, opacity: 0, duration: 0.8, delay: (i % 3) * 0.1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      }, root);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={root} className="overflow-x-hidden">
      <header className="bg-hero relative flex min-h-screen items-center justify-center px-6 text-center">
        {floaters.map((f) => (
          <span key={f.c + f.pos} aria-hidden className={`floater absolute ${f.pos}`}>
            <span className="animate-floaty inline-block" style={{ animationDelay: f.d }}>{f.c}</span>
          </span>
        ))}
        <div className="relative max-w-2xl">
          <p className="hero-item mb-4 inline-block rounded-full border-2 border-primary/40 bg-card/70 px-4 py-1 text-sm font-semibold text-primary">
            Untuk orang paling spesial 💝
          </p>
          <h1 className="hero-item font-display text-5xl leading-tight text-primary sm:text-7xl">
            Happy Birthday, Sayang!
          </h1>
          <p className="hero-item mx-auto mt-6 max-w-md text-lg text-muted-foreground">
            Hari ini dunia merayakan hadirnya kamu — dan aku merayakan betapa beruntungnya aku memilikimu.
          </p>
          <a
            href="#reasons"
            className="hero-item mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-soft transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            Buka Hadiahmu 🎁
          </a>
        </div>
      </header>

      <main>
        <section id="reasons" aria-labelledby="reasons-title" className="mx-auto max-w-6xl px-6 py-24">
          <h2 id="reasons-title" className="reveal text-center font-display text-4xl text-primary sm:text-5xl">
            Alasan Aku Sayang Kamu
          </h2>
          <p className="reveal mx-auto mt-4 max-w-md text-center text-muted-foreground">
            Sebenarnya ada tak terhingga, tapi ini beberapa favoritku.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reasons.map((r) => (
              <article
                key={r.title}
                className="reveal rounded-3xl border-2 border-secondary bg-card p-8 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl"
              >
                <div aria-hidden className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-3xl">
                  {r.emoji}
                </div>
                <h3 className="text-xl font-bold text-foreground">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="bg-secondary/60 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 id="gallery-title" className="reveal text-center font-display text-4xl text-primary sm:text-5xl">
              Kenangan Kita
            </h2>
            <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
              {photos.map((p) => (
                <figure key={p.alt} className="reveal group break-inside-avoid overflow-hidden rounded-3xl border-4 border-card shadow-soft">
                  <img
                    src={p.src}
                    alt={p.alt}
                    width={p.w}
                    height={p.h}
                    loading="lazy"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-hero px-6 py-20 text-center">
        <p className="reveal font-display text-3xl text-primary sm:text-4xl">Aku sayang kamu, selamanya.</p>
        <p className="reveal mt-4 text-muted-foreground">Selamat ulang tahun, cintaku 💗</p>
      </footer>
    </div>
  );
}
