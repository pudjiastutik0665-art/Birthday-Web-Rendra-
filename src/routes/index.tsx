import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gift, Heart, Sparkles } from "lucide-react";
import { lazy, Suspense, useEffect, useState, type MouseEvent } from "react";

const Cinnamoroll3D = lazy(() => import("@/components/Cinnamoroll3D"));
import cinnamoroll from "@/assets/cinnamoroll-wave.png";
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
  { c: "♥", pos: "top-[13%] left-[7%] text-3xl text-primary/45 sm:text-4xl", d: 0 },
  { c: "✦", pos: "top-[21%] right-[9%] text-4xl text-accent-foreground/35 sm:text-5xl", d: 0.8 },
  { c: "✧", pos: "bottom-[19%] left-[12%] text-2xl text-primary/45 sm:text-3xl", d: 1.6 },
  { c: "♡", pos: "bottom-[15%] right-[14%] text-4xl text-primary/35 sm:text-5xl", d: 0.4 },
];

const cloudPositions = [
  "left-[-8rem] top-[9%] w-64 opacity-60 sm:w-96",
  "right-[-7rem] top-[31%] w-52 opacity-70 sm:w-80",
  "left-[7%] bottom-[8%] w-44 opacity-45 sm:w-64",
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

function Cloud({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      animate={{ x: [0, 18, 0], y: [0, -7, 0] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="cloud-shape" />
    </motion.div>
  );
}

function SparkleBurst({ burst }: { burst: number }) {
  const particles = ["✦", "♥", "★", "♡", "✧", "♥", "★", "✦"];
  return (
    <AnimatePresence>
      {burst > 0 && (
        <motion.div key={burst} aria-hidden className="pointer-events-none absolute inset-0">
          {particles.map((particle, index) => {
            const angle = (index / particles.length) * Math.PI * 2;
            return (
              <motion.span
                key={`${burst}-${index}`}
                className="absolute left-1/2 top-1/2 text-xl"
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * (66 + (index % 2) * 22),
                  y: Math.sin(angle) * (66 + (index % 3) * 12),
                  scale: [0, 1.15, 0.7],
                  opacity: [1, 1, 0],
                  rotate: index % 2 ? 35 : -35,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.15, ease: "easeOut" }}
              >
                {particle}
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingMascot() {
  const [showBubble, setShowBubble] = useState(false);
  const [burst, setBurst] = useState(0);
  const reduceMotion = useReducedMotion();

  const fireConfetti = (event: MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    void import("canvas-confetti").then(({ default: confetti }) => {
      const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
      const colors = ["#F875AA", "#FFDFDF", "#AEDEFC", "#FFFFFF"];
      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 34,
        scalar: 0.9,
        ticks: 200,
        origin,
        colors,
        shapes: ["circle", "star"],
      });
      const heart = confetti.shapeFromPath({
        path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
      });
      confetti({
        particleCount: 26,
        spread: 110,
        startVelocity: 26,
        scalar: 1.4,
        ticks: 240,
        origin,
        colors: ["#F875AA", "#FFDFDF", "#AEDEFC"],
        shapes: [heart],
      });
    });
  };

  useEffect(() => {
    if (!showBubble) return;
    const timer = window.setTimeout(() => setShowBubble(false), 3200);
    return () => window.clearTimeout(timer);
  }, [showBubble, burst]);

  return (
    <div className="fixed bottom-3 right-2 z-50 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            className="speech-bubble absolute bottom-[88%] right-[72%] w-44 rounded-2xl border-2 border-accent bg-card px-4 py-3 text-center text-sm font-bold text-foreground shadow-soft sm:w-52"
          >
            Semoga harimu semanis awan! ♡
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label="Sapaan dari Cinnamoroll"
        className="relative block h-28 w-28 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:h-36 sm:w-36"
        animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
        whileHover={reduceMotion ? {} : { scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        transition={{ y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 5, repeat: Infinity } }}
        onClick={(event) => {
          setShowBubble(true);
          setBurst((value) => value + 1);
          fireConfetti(event);
        }}
      >
        <img src={cinnamoroll} alt="Cinnamoroll melayang di atas awan" width={1024} height={1024} loading="lazy" className="h-full w-full object-contain drop-shadow-xl" />
        <SparkleBurst burst={burst} />
      </motion.button>
    </div>
  );
}

function Index() {
  const reduceMotion = useReducedMotion();
  const motionTransition = reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" as const };

  return (
    <div className="overflow-x-hidden">
      <header className="bg-hero relative flex min-h-[92svh] items-center justify-center overflow-hidden px-6 pb-16 pt-8 text-center sm:min-h-screen">
        {cloudPositions.map((position, index) => <Cloud key={position} className={position} delay={index * 1.4} />)}
        {floaters.map((floater) => (
          <motion.span
            key={floater.c + floater.pos}
            aria-hidden
            className={`absolute ${floater.pos}`}
            animate={reduceMotion ? false : { y: [0, -15, 0], rotate: [0, 7, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: floater.d, ease: "easeInOut" }}
          >
            {floater.c}
          </motion.span>
        ))}
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.13 }} className="relative z-10 max-w-2xl">
          <motion.div variants={reveal} transition={motionTransition} className="mx-auto -mb-2 h-48 w-48 cursor-grab touch-pan-y active:cursor-grabbing sm:h-64 sm:w-64">
            <ClientOnly fallback={<img src={cinnamoroll} alt="Cinnamoroll" width={1024} height={1024} className="h-full w-full object-contain" />}>
              <Suspense fallback={<img src={cinnamoroll} alt="Cinnamoroll" width={1024} height={1024} className="h-full w-full object-contain" />}>
                <Cinnamoroll3D className="h-full w-full" />
              </Suspense>
            </ClientOnly>
          </motion.div>
          <motion.p variants={reveal} transition={motionTransition} className="mb-4 inline-block rounded-full border-2 border-primary/40 bg-card/80 px-4 py-1 text-sm font-semibold text-primary backdrop-blur-sm">
            Untuk orang paling spesial ♡
          </motion.p>
          <motion.h1 variants={reveal} transition={motionTransition} className="font-display text-5xl leading-tight text-primary sm:text-7xl">
            Happy Birthday, Sayang!
          </motion.h1>
          <motion.p variants={reveal} transition={motionTransition} className="mx-auto mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Hari ini dunia merayakan hadirnya kamu — dan aku merayakan betapa beruntungnya aku memilikimu.
          </motion.p>
          <motion.a
            variants={reveal}
            transition={{ ...motionTransition, type: "spring", stiffness: 300, damping: 18 }}
            whileHover={reduceMotion ? {} : { y: -7, scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            href="#reasons"
            className="sparkle-button mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            <Gift aria-hidden className="h-5 w-5" /> Buka Hadiahmu <Sparkles aria-hidden className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </header>

      <main>
        <section id="reasons" aria-labelledby="reasons-title" className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.h2 id="reasons-title" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={motionTransition} className="text-center font-display text-4xl text-primary sm:text-5xl">
            Alasan Aku Sayang Kamu
          </motion.h2>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={motionTransition} className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
            Sebenarnya ada tak terhingga, tapi ini beberapa favoritku.
          </motion.p>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reasons.map((reason, index) => (
              <motion.article
                key={reason.title}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                transition={{ ...motionTransition, delay: index * 0.05, type: "spring", stiffness: 180, damping: 18 }}
                whileHover={reduceMotion ? {} : { y: -9, scale: 1.025, rotate: index % 2 ? 0.5 : -0.5 }}
                className="memory-card group relative overflow-hidden rounded-3xl border-2 border-secondary bg-card p-8 shadow-sm"
              >
                <span aria-hidden className="card-sparkle left-5 top-4">✦</span>
                <span aria-hidden className="card-sparkle right-6 top-7 [animation-delay:120ms]">✧</span>
                <div aria-hidden className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-3xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {reason.emoji}
                </div>
                <h3 className="text-xl font-bold text-foreground">{reason.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{reason.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="relative overflow-hidden bg-secondary/60 px-6 py-24">
          <Cloud className="-left-24 top-12 w-64 opacity-35" delay={2} />
          <div className="relative mx-auto max-w-6xl">
            <motion.h2 id="gallery-title" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={motionTransition} className="text-center font-display text-4xl text-primary sm:text-5xl">
              Kenangan Kita
            </motion.h2>
            <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
              {photos.map((photo, index) => (
                <motion.figure
                  key={photo.alt}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...motionTransition, delay: index * 0.06 }}
                  whileHover={reduceMotion ? {} : { y: -6, scale: 1.015 }}
                  className="gallery-photo group relative break-inside-avoid overflow-hidden rounded-3xl border-4 border-card shadow-soft"
                >
                  <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-110" />
                  <div className="gallery-overlay absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    <motion.span aria-hidden initial={{ scale: 0, rotate: -12 }} whileInView={{ scale: 1, rotate: 0 }} className="grid h-16 w-16 place-items-center rounded-full bg-card/85 text-primary shadow-soft backdrop-blur-sm">
                      <Heart className="h-8 w-8 fill-current" />
                    </motion.span>
                  </div>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-hero relative overflow-hidden px-6 py-20 text-center">
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={motionTransition} className="font-display text-3xl text-primary sm:text-4xl">Aku sayang kamu, selamanya.</motion.p>
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={motionTransition} className="mt-4 text-muted-foreground">Selamat ulang tahun, cintaku ♡</motion.p>
      </footer>
      <FloatingMascot />
    </div>
  );
}