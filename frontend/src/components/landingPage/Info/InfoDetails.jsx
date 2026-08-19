import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/* ─────────── data ─────────── */
const events = [
  {
    icon: "✉️",
    title: "Connect with Gmail",
    description:
      "Logging in is completely seamless. No long forms to fill out—simply connect using your existing Gmail account and start messaging your friends in seconds.",
    tags: ["OAuth 2.0", "One-click Login", "Secure"],
    accent: "from-zinc-500/30 to-transparent",
    border: "",
    dot: "bg-neutral-500",
    glow: "shadow-violet-300/20",
  },
  {
    icon: "📎",
    title: "Share Files & Send Emojis",
    description:
      "Make your text conversations fun and expressive with emojis. Easily share files, documents, and assets with anyone in your network.",
    tags: ["File Sharing", "Emojis", "Rich Media"],
    accent: "from-cyan-400/30 to-transparent",
    border: "",
    dot: "bg-neutrak-500",
    glow: "shadow-cyan-300/20",
  },
  {
    icon: "💬",
    title: "Purely Focused on Communication", 
    description:
      "We are a platform built solely for instant messaging. We do not support video chat right now, ensuring a lightweight, distraction-free environment.",
    tags: ["Instant Messaging", "Lightweight", "No Distractions"],
    accent: "from-purple-400/30 to-transparent",
    border: "",
    dot: "bg-neutral-500",
    glow: "shadow-purple-300/20",
  },
];

/* ─────────── animated branch line ─────────── */
function TrunkLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-neutral-800 overflow-hidden"
    >
      {/* static dimmed track */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-700/40 to-transparent" />
      {/* animated fill */}
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute inset-0 bg-gradient-to-b from-neutral-400/30 to-neutral-100/30 rounded-full"
      />
    </div>
  );
}

function HBranch({ side }) {
  return (
    <div
      className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-10 lg:w-14
        bg-gradient-to-${side === "left" ? "l" : "r"} from-neutral-500/60 to-transparent
        ${side === "left" ? "right-0 translate-x-full" : "left-0 -translate-x-full"}
      `}
    />
  );
}

/* ─────────── single leaf card ─────────── */
function LeafCard({ event, index }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [isLeft ? -60 : 60, 0]);
  const xMobile = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <div ref={ref} className="relative w-full">

      {/* ══════ MOBILE layout: left bar + single column ══════ */}
      <div className="flex md:hidden items-start gap-0 w-full">
        {/* dot sits on the left bar */}
        <div className="relative flex-shrink-0 w-10 flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${event.dot} shadow-lg ring-4 ring-black mt-1 z-10`} />
          <span className="mt-1 text-[9px] font-mono font-bold text-neutral-600 tracking-widest select-none">
            {event.label}
          </span>
        </div>
        {/* card slides in from right */}
        <motion.div
          style={{ x: xMobile, opacity }}
          className="flex-1 pr-2"
        >
          <LeafBox event={event} />
        </motion.div>
      </div>

      {/* ══════ DESKTOP layout: alternating left-right tree ══════ */}
      <div className="hidden md:flex items-center justify-center w-full">
        {/* dot on the center trunk */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className={`w-5 h-5 rounded-full ${event.dot} shadow-lg ring-4 ring-black`} />
        </div>

        {/* two-column grid */}
        <div className="grid grid-cols-2 w-full max-w-5xl mx-auto gap-0">
          {/* LEFT SLOT */}
          <div className="flex justify-end pr-12 lg:pr-16 items-center relative">
            {isLeft ? (
              <>
                <HBranch side="right" />
                <motion.div style={{ x, opacity }} className="relative w-full max-w-xs lg:max-w-sm">
                  <LeafBox event={event} />
                </motion.div>
              </>
            ) : (
              <div />
            )}
          </div>

          {/* RIGHT SLOT */}
          <div className="flex justify-start pl-12 lg:pl-16 items-center relative">
            {!isLeft ? (
              <>
                <HBranch side="left" />
                <motion.div style={{ x, opacity }} className="relative w-full max-w-xs lg:max-w-sm">
                  <LeafBox event={event} />
                </motion.div>
              </>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─────────── the leaf box itself ─────────── */
function LeafBox({ event }) {
  return (
    <div
      className={`
        relative group rounded-2xl p-5 lg:p-6
        bg-gradient-to-b ${event.accent}
        border ${event.border}
        backdrop-blur-sm bg-black/20
        shadow-xl ${event.glow}
        transition-all duration-500
        hover:scale-[1.03] hover:shadow-2xl
      `}
    >
      {/* corner glow accent */}
      <div
        className={`absolute -top-px -left-px w-8 h-8 rounded-tl-2xl
          bg-gradient-to-br ${event.accent} opacity-60 blur-sm pointer-events-none`}
      />

      {/* icon + label row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{event.icon}</span>
        <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-neutral-500 uppercase">
          Feature {event.label}
        </span>
      </div>

      {/* title */}
      <h3 className="text-lg lg:text-xl font-bold text-neutral-100 leading-snug mb-2">
        {event.title}
      </h3>

      {/* description */}
      <p className="text-sm text-neutral-400 leading-relaxed mb-4">
        {event.description}
      </p>

      {/* tags */}
      <div className="flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
              bg-white/5 border ${event.border} text-neutral-300 tracking-wide`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────── main export ─────────── */
export function InfoDetails() {
  return (
    <div id="About" className="relative w-full overflow-clip bg-black">
      {/* section header */}
      <div className="max-w-7xl mx-auto pt-16 pb-4 px-4 md:px-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs font-mono font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-3"
        >
          Why Chetty?
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white leading-tight"
        >
          Let&apos;s Connect Socially
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3 text-sm md:text-base text-neutral-400 max-w-xl mx-auto"
        >
          Experience the joy of seamless communication. Our platform is designed
          to bring you closer to the people that matter.
        </motion.p>
      </div>

      {/* tree body */}
      <div className="relative max-w-5xl mx-auto pb-24 pt-10 pl-2 pr-4 md:px-10">
        {/* trunk line — left on mobile, center on desktop */}
        <TrunkLine />

        {/* leaf cards — extra left padding on mobile to clear the trunk */}
        <div className="flex flex-col gap-14 md:gap-28 pl-2 md:pl-0">
          {events.map((event, i) => (
            <LeafCard key={i} event={event} index={i} />
          ))}
        </div>

        {/* end cap */}
        <div className="relative flex justify-start md:justify-center mt-12 z-10 pl-2 md:pl-0">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg ml-0 md:ml-0">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
