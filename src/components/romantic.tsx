import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, Mail } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  ✏️  EDIT BAGIAN INI: tanggal jadian, cerita, surat, dan pesan      */
/* ------------------------------------------------------------------ */

// Format: "TAHUN-BULAN-TANGGAL" (ganti dengan tanggal jadian kalian)
export const ANNIVERSARY_DATE = "2024-01-14T00:00:00";

export const timeline = [
  { date: "Awal Pertemuan", emoji: "👀", title: "Pertama Kali Bertemu", text: "Aku belum tahu, hari itu hidupku mulai berubah." },
  { date: "Hari Itu", emoji: "☕", title: "Kencan Pertama", text: "Kopi dingin, obrolan hangat, dan hati yang berdebar." },
  { date: "Hari Spesial", emoji: "💍", title: "Resmi Jadi Kita", text: "Hari saat 'aku' dan 'kamu' pelan-pelan menjadi 'kita'." },
  { date: "Sampai Sekarang", emoji: "🌈", title: "Tumbuh Bersama", text: "Tertawa, bertengkar kecil, berdamai, dan makin sayang." },
  { date: "Nanti", emoji: "🏡", title: "Mimpi Kita", text: "Masih banyak halaman kosong yang ingin kutulis bersamamu." },
];

export const loveLetter = `Untuk kamu, yang paling kusayang,

Di hari ulang tahunmu ini, aku ingin bilang terima kasih. Terima kasih sudah hadir, sudah bertahan, dan sudah memilih aku.

Bersamamu, hal-hal sederhana terasa istimewa. Kopi pagi, pesan singkat di tengah hari, sampai diam yang nyaman di malam hari.

Semoga di usia barumu, kamu selalu sehat, bahagia, dan dikelilingi hal-hal baik. Dan semoga aku boleh terus ada di sampingmu, merayakan semuanya.

Aku sayang kamu, hari ini dan selamanya. 💗`;

export const loveNotes = [
  "Kamu itu alasan aku senyum-senyum sendiri sama HP. 📱",
  "Kalau dunia ribet, aku tinggal ingat kamu, dan semuanya terasa ringan. ☁️",
  "Aku nggak butuh bintang, aku sudah punya kamu. ⭐",
  "Peluk dari jauh dulu ya, nanti yang asli menyusul. 🤗",
  "Kamu bukan cuma pacar, kamu itu sahabat, rumah, dan tempat pulangku. 🏡",
  "Hal favoritku: menunggu balasan chat darimu. 💬",
  "Jangan lupa makan dan istirahat. Aku sayang kamu. 🍙",
  "Kalau kamu capek, bersandarlah. Aku di sini. 🫶",
  "Setiap hari bersamamu adalah hari terbaik. 🌸",
  "Terima kasih sudah jadi kamu. 💗",
];

export const wishes = [
  "Semoga semua mimpimu pelan-pelan jadi nyata ✨",
  "Semoga tahun ini penuh tawa dan sedikit air mata bahagia 💗",
  "Semoga kita selalu punya alasan untuk saling jatuh cinta lagi 🌷",
];

/* ------------------------------------------------------------------ */

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

function useMotionTransition() {
  const reduce = useReducedMotion();
  return reduce ? { duration: 0 } : { duration: 0.7, ease: "easeOut" as const };
}

function SectionTitle({ id, children, sub }: { id: string; children: string; sub?: string }) {
  const t = useMotionTransition();
  return (
    <>
      <motion.h2 id={id} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} transition={t} className="text-center font-display text-4xl text-primary sm:text-5xl">
        {children}
      </motion.h2>
      {sub && (
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={t} className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          {sub}
        </motion.p>
      )}
    </>
  );
}

async function fireHearts(origin?: { x: number; y: number }) {
  const { default: confetti } = await import("canvas-confetti");
  const heart = confetti.shapeFromPath({
    path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
  });
  confetti({
    particleCount: 40,
    spread: 90,
    startVelocity: 30,
    scalar: 1.6,
    ticks: 260,
    origin: origin ?? { x: 0.5, y: 0.6 },
    colors: ["#F875AA", "#FFDFDF", "#AEDEFC"],
    shapes: [heart],
  });
}

/* ---------------- 1. Hati & kelopak berjatuhan ---------------- */
export function FallingHearts() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<
    { id: number; left: number; size: number; dur: number; delay: number; char: string }[]
  >([]);

  useEffect(() => {
    if (reduce) return;
    const chars = ["♥", "♡", "🌸", "✦", "💗"];
    setItems(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 16,
        dur: 12 + Math.random() * 12,
        delay: -Math.random() * 20,
        char: chars[i % chars.length] ?? "♥",
      })),
    );
  }, [reduce]);

  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="falling-heart absolute top-0 text-primary/40"
          style={{ left: `${p.left}%`, fontSize: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}

/* ---------------- 2. Penghitung waktu bersama ---------------- */
export function LoveCounter() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = useMemo(() => {
    if (now === null) return null;
    const diff = Math.max(0, now - new Date(ANNIVERSARY_DATE).getTime());
    const s = Math.floor(diff / 1000);
    return [
      { label: "Hari", value: Math.floor(s / 86400) },
      { label: "Jam", value: Math.floor((s % 86400) / 3600) },
      { label: "Menit", value: Math.floor((s % 3600) / 60) },
      { label: "Detik", value: s % 60 },
    ];
  }, [now]);

  const t = useMotionTransition();
  return (
    <section aria-labelledby="counter-title" className="relative mx-auto max-w-4xl px-6 py-24">
      <SectionTitle id="counter-title" sub="Setiap detiknya berharga bagiku.">
        Waktu Kita Bersama
      </SectionTitle>
      <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={t} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(parts ?? [{ label: "Hari", value: 0 }, { label: "Jam", value: 0 }, { label: "Menit", value: 0 }, { label: "Detik", value: 0 }]).map((p) => (
          <div key={p.label} className="rounded-3xl border-2 border-secondary bg-card p-6 text-center shadow-sm">
            <div className="font-display text-4xl text-primary tabular-nums sm:text-5xl">{String(p.value).padStart(2, "0")}</div>
            <div className="mt-2 text-sm font-bold text-muted-foreground">{p.label}</div>
          </div>
        ))}
      </motion.div>
      <p className="mt-6 text-center text-sm text-muted-foreground">…dan aku masih mau menambah angkanya terus ♡</p>
    </section>
  );
}

/* ---------------- 3. Linimasa perjalanan cinta ---------------- */
export function LoveTimeline() {
  const reduce = useReducedMotion();
  const t = useMotionTransition();
  return (
    <section aria-labelledby="timeline-title" className="relative mx-auto max-w-3xl px-6 py-24">
      <SectionTitle id="timeline-title" sub="Perjalanan kecil kita, dari awal sampai sekarang.">
        Cerita Cinta Kita
      </SectionTitle>
      <ol className="relative mt-14 border-l-4 border-dotted border-primary/40 pl-8 sm:pl-12">
        {timeline.map((item) => (
          <motion.li
            key={item.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...t, delay: 0.05 }}
            whileHover={reduce ? {} : { x: 6 }}
            className="relative mb-10 last:mb-0"
          >
            <span aria-hidden className="absolute -left-[3.25rem] top-1 grid h-10 w-10 place-items-center rounded-full border-2 border-primary/40 bg-card text-xl shadow-sm sm:-left-[4.25rem] sm:h-12 sm:w-12">
              {item.emoji}
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.date}</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">{item.title}</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">{item.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- 4. Kue ulang tahun: tiup lilin & make a wish ---------------- */
export function BirthdayCake() {
  const [lit, setLit] = useState(true);
  const [wishIndex, setWishIndex] = useState(0);
  const t = useMotionTransition();

  const blow = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!lit) {
      setLit(true);
      return;
    }
    setLit(false);
    setWishIndex((v) => (v + 1) % wishes.length);
    const r = e.currentTarget.getBoundingClientRect();
    void fireHearts({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight });
  }, [lit]);

  return (
    <section aria-labelledby="cake-title" className="relative overflow-hidden bg-secondary/60 px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle id="cake-title" sub="Pejamkan mata, buat permohonan, lalu tiup lilinnya.">
          Make a Wish
        </SectionTitle>
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={t} className="mt-12">
          <div aria-hidden className="cake mx-auto">
            <div className="cake-candles">
              {[0, 1, 2].map((i) => (
                <div key={i} className="candle">
                  <span className={`flame ${lit ? "flame-on" : "flame-off"}`} style={{ animationDelay: `${i * 0.2}s` }} />
                  <span className="stick" />
                </div>
              ))}
            </div>
            <div className="cake-top" />
            <div className="cake-mid" />
            <div className="cake-base" />
          </div>
          <button
            type="button"
            onClick={blow}
            className="sparkle-button mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-soft transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            {lit ? "🌬️ Tiup Lilin" : "🕯️ Nyalakan Lagi"}
          </button>
          <div className="mt-6 min-h-14" aria-live="polite">
            <AnimatePresence mode="wait">
              {!lit && (
                <motion.p key={wishIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-sm rounded-2xl border-2 border-accent bg-card px-5 py-3 font-bold text-foreground shadow-soft">
                  {wishes[wishIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- 5. Surat cinta interaktif (efek mengetik) ---------------- */
export function LoveLetter() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const t = useMotionTransition();

  useEffect(() => {
    if (!open) {
      setCount(0);
      return;
    }
    if (reduce) {
      setCount(loveLetter.length);
      return;
    }
    const timer = window.setInterval(() => {
      setCount((c) => {
        if (c >= loveLetter.length) {
          window.clearInterval(timer);
          return c;
        }
        return c + 2;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [open, reduce]);

  return (
    <section aria-labelledby="letter-title" className="relative mx-auto max-w-2xl px-6 py-24">
      <SectionTitle id="letter-title" sub="Ada surat kecil untukmu. Ketuk amplopnya.">
        Surat Cinta
      </SectionTitle>
      <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={t} className="mt-12 flex flex-col items-center">
        <motion.button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Tutup surat" : "Buka surat"}
          onClick={() => {
            setOpen((v) => !v);
            if (!open) void fireHearts({ x: 0.5, y: 0.55 });
          }}
          whileHover={reduce ? {} : { scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.92 }}
          className="grid h-28 w-28 place-items-center rounded-3xl border-2 border-primary/40 bg-card text-primary shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        >
          <motion.span animate={open ? { rotate: [0, -10, 10, 0] } : { y: [0, -5, 0] }} transition={{ duration: 2, repeat: open ? 0 : Infinity }}>
            {open ? <Heart className="h-12 w-12 fill-current" /> : <Mail className="h-12 w-12" />}
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="letter-paper mt-8 w-full rounded-3xl border-2 border-secondary bg-card p-8 shadow-soft sm:p-10"
            >
              <p className="whitespace-pre-line leading-loose text-foreground">
                {loveLetter.slice(0, count)}
                {count < loveLetter.length && <span aria-hidden className="ml-0.5 animate-pulse text-primary">|</span>}
              </p>
              <span className="sr-only">{loveLetter}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- 6. Toples pesan cinta ---------------- */
export function LoveJar() {
  const reduce = useReducedMotion();
  const t = useMotionTransition();
  const [index, setIndex] = useState<number | null>(null);

  const draw = () => {
    setIndex((prev) => {
      let next = Math.floor(Math.random() * loveNotes.length);
      if (loveNotes.length > 1) while (next === prev) next = Math.floor(Math.random() * loveNotes.length);
      return next;
    });
  };

  return (
    <section aria-labelledby="jar-title" className="relative overflow-hidden bg-secondary/60 px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <SectionTitle id="jar-title" sub="Kapan pun kamu butuh semangat, ambil satu.">
          Toples Pesan Cinta
        </SectionTitle>
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={t} className="mt-10">
          <motion.button
            type="button"
            onClick={draw}
            aria-label="Ambil pesan cinta"
            whileHover={reduce ? {} : { rotate: [0, -6, 6, 0], scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="text-8xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 rounded-full"
          >
            🫙
          </motion.button>
          <p className="mt-2 text-sm font-bold text-primary">Ketuk toplesnya</p>
          <div className="mt-6 min-h-28" aria-live="polite">
            <AnimatePresence mode="wait">
              {index !== null && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24, rotate: -4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto max-w-sm rounded-3xl border-2 border-accent bg-card px-6 py-5 font-bold leading-relaxed text-foreground shadow-soft"
                >
                  {loveNotes[index]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- 7. Hati yang bisa dipencet (ketuk di mana saja) ---------------- */
export function TapHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; c: string }[]>([]);

  useEffect(() => {
    let id = 0;
    const chars = ["💗", "💖", "💕", "♥", "🌸"];
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea")) return;
      const item = { id: id++, x: e.clientX, y: e.clientY, c: chars[id % chars.length] ?? "♥" };
      setHearts((h) => [...h.slice(-12), item]);
      window.setTimeout(() => setHearts((h) => h.filter((x) => x.id !== item.id)), 1200);
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            className="absolute text-2xl"
            style={{ left: h.x - 12, top: h.y - 12 }}
            initial={{ opacity: 1, scale: 0.4, y: 0 }}
            animate={{ opacity: 0, scale: 1.3, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {h.c}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
