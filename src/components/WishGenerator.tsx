import { motion } from "motion/react";
import { Loader2, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

export function WishGenerator() {
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [wish, setWish] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setWish("");
    try {
      const res = await fetch("/api/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memory }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal membuat ucapan.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "response.output_text.delta") {
              text += evt.delta;
              setWish(text);
            } else if (evt.type === "error" || evt.type === "response.failed") {
              throw new Error("Gagal membuat ucapan. Coba lagi nanti.");
            }
          } catch (e) {
            if (e instanceof Error && e.message.startsWith("Gagal")) throw e;
          }
        }
      }
      if (!text) throw new Error("AI tidak memberikan ucapan. Coba lagi nanti.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="wish-title" className="relative mx-auto max-w-3xl px-6 py-24">
      <h2 id="wish-title" className="text-center font-display text-4xl text-primary sm:text-5xl">Tulis Ucapanmu</h2>
      <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
        Masukkan namamu dan satu kenangan singkat, lalu biarkan AI merangkai ucapan ulang tahun yang personal ♡
      </p>
      <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl border-2 border-secondary bg-card p-6 shadow-soft sm:p-8">
        <label className="block">
          <span className="text-sm font-bold text-foreground">Namamu</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            required
            placeholder="cth. Rina"
            className="mt-1 w-full rounded-2xl border-2 border-secondary bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-foreground">Kenangan singkat</span>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            maxLength={500}
            required
            rows={3}
            placeholder="cth. Waktu kita kehujanan sepulang nonton dan tertawa sepanjang jalan"
            className="mt-1 w-full resize-none rounded-2xl border-2 border-secondary bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
          />
        </label>
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="sparkle-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {loading ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Sparkles aria-hidden className="h-5 w-5" />}
          {loading ? "Merangkai ucapan..." : "Buat Ucapan"}
        </motion.button>
        {error && <p role="alert" className="text-center text-sm font-semibold text-destructive">{error}</p>}
      </form>
      {wish && (
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="mt-8 whitespace-pre-line rounded-3xl border-2 border-accent bg-card p-6 text-lg leading-relaxed text-foreground shadow-soft sm:p-8"
        >
          {wish}
          <footer className="mt-4 text-right font-display text-primary">— {name}</footer>
        </motion.blockquote>
      )}
    </section>
  );
}
