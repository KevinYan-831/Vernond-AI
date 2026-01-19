import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { soundEffects } from "@/utils/sounds";

export default function Countdown({ count }) {
  const { language } = useLanguage();

  // Play tick sound on each count change
  useEffect(() => {
    if (count !== null && count > 0) {
      soundEffects.playTick();
    } else if (count === 0) {
      soundEffects.playShutter();
    }
  }, [count]);

  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
          {/* Radial spotlight effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_50%)]" />

          {/* Animated ring pulses */}
          <motion.div
            key={`ring-${count}`}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-48 h-48 rounded-full border-2 border-magic-gold/50"
          />

          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Card background */}
            <div className="w-44 h-60 rounded-2xl bg-gradient-to-b from-magic-charcoal to-black border-2 border-magic-gold/60 shadow-[0_0_80px_rgba(212,175,55,0.4)] flex items-center justify-center overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-magic-gold/10 to-transparent skew-x-12"
              />

              {/* Card pattern */}
              <div className="absolute inset-4 border border-magic-gold/30 rounded-lg" />
              <div className="absolute top-6 left-6 text-magic-gold/40 text-xl">♠</div>
              <div className="absolute top-6 right-6 text-magic-gold/40 text-xl">♥</div>
              <div className="absolute bottom-6 left-6 text-magic-gold/40 text-xl">♦</div>
              <div className="absolute bottom-6 right-6 text-magic-gold/40 text-xl">♣</div>

              {/* Number */}
              <motion.span
                key={`num-${count}`}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-9xl font-bold text-magic-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]"
              >
                {count}
              </motion.span>
            </div>

            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-magic-gold/30 blur-3xl -z-10"
            />
          </motion.div>

          {/* Preparing text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-28 font-accent italic text-magic-gold/90 text-xl tracking-wide"
          >
            {language === 'zh' ? '准备好你的魔术...' : 'Prepare your magic...'}
          </motion.p>

          {/* Progress dots */}
          <div className="absolute bottom-20 flex gap-3">
            {[3, 2, 1].map((num) => (
              <motion.div
                key={num}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: count !== null && count <= num ? 1.2 : 0.8,
                  backgroundColor: count !== null && count <= num ? "#D4AF37" : "#333"
                }}
                className="w-3 h-3 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
