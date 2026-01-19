import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Trophy, AlertTriangle, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { soundEffects } from "@/utils/sounds";

// Discord Icon SVG
function DiscordIcon({ className }) {
  return (
    <svg viewBox="0 0 127.14 96.36" className={className} fill="currentColor">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,7,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
    </svg>
  );
}

// Instagram Icon SVG
function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="currentColor">
      <path d="M349.33,69.33a93.62,93.62,0,0,1,93.34,93.34v186.66a93.62,93.62,0,0,1-93.34,93.34H162.67a93.62,93.62,0,0,1-93.34-93.34V162.67a93.62,93.62,0,0,1,93.34-93.34H349.33m0-37.33H162.67C90.8,32,32,90.8,32,162.67V349.33C32,421.2,90.8,480,162.67,480H349.33C421.2,480,480,421.2,480,349.33V162.67C480,90.8,421.2,32,349.33,32Z"/>
      <path d="M256,128a128,128,0,1,0,128,128A128.14,128.14,0,0,0,256,128Zm0,218.67A90.67,90.67,0,1,1,346.67,256,90.77,90.77,0,0,1,256,346.67Z"/>
      <circle cx="394.67" cy="117.33" r="32"/>
    </svg>
  );
}

// Particle component for confetti/sparkles
function Particle({ color, delay, isCaught }) {
  const randomX = 20 + Math.random() * 60;
  const randomDrift = (Math.random() - 0.5) * 30;
  const randomDuration = isCaught ? 3 + Math.random() * 2 : 4 + Math.random() * 3;

  return (
    <motion.div
      initial={{
        x: `${randomX}vw`,
        y: "100vh",
        opacity: 0,
        rotate: 0,
        scale: 0.5
      }}
      animate={{
        x: [`${randomX}vw`, `${randomX + randomDrift}vw`],
        y: "-20vh",
        opacity: isCaught ? [0, 1, 1, 0] : [0, 0.8, 1, 0.8, 0],
        rotate: isCaught ? [0, 180] : [0, 45, -45, 180],
        scale: isCaught ? [0.5, 1, 0.8] : [0.3, 0.8, 1, 0.9, 0.6]
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: isCaught ? "easeOut" : "easeInOut",
        x: { ease: "easeInOut" }
      }}
      className="absolute pointer-events-none"
      style={{
        width: isCaught ? "4px" : "6px",
        height: isCaught ? "16px" : "6px",
        backgroundColor: color,
        borderRadius: isCaught ? "0" : "50%",
        boxShadow: `0 0 ${isCaught ? "8px" : "16px"} ${color}`,
        filter: isCaught ? "none" : "blur(0.5px)"
      }}
    />
  );
}

// Social links section
function SocialLinks() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.4 }}
      className="mt-4 pt-4 border-t border-magic-gold/40"
    >
      <p className="text-sm font-bold text-magic-gold mb-3 text-center font-display">
        {t('social.follow')}
      </p>
      <div className="flex items-center justify-center gap-3">
        {/* Discord */}
        <a
          href="https://discord.gg/RrVE3mAd"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#5865F2]/20 hover:bg-[#5865F2]/40 rounded-xl p-3 shadow-lg flex items-center justify-center transition-all group-hover:scale-105">
            <DiscordIcon className="w-full h-full text-[#5865F2]" />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 group-hover:text-[#5865F2] transition-colors">
            Discord
          </p>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/vernond_ai?igsh=OXMxNDdjcXd0Z2Fo"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-orange-500/40 rounded-xl p-3 shadow-lg flex items-center justify-center transition-all group-hover:scale-105">
            <InstagramIcon className="w-full h-full text-white" />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 group-hover:text-pink-400 transition-colors">
            Instagram
          </p>
        </a>
      </div>
    </motion.div>
  );
}

export default function VerdictDisplay({ verdict, timestamps = [], analysis, onRetry }) {
  const { t } = useLanguage();
  const [showParticles, setShowParticles] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const soundPlayedRef = useRef(null);

  useEffect(() => {
    if (verdict && soundPlayedRef.current !== verdict) {
      soundPlayedRef.current = verdict;

      soundEffects.playFlash();
      setFlashVisible(true);
      setTimeout(() => setFlashVisible(false), 200);
      setTimeout(() => {
        setShowParticles(true);
        if (verdict === "fooled") {
          soundEffects.playApplause();
          soundEffects.playSparkle();
        } else {
          soundEffects.playOminousDrone();
          soundEffects.playWhoosh();
        }
      }, 300);
    } else if (!verdict) {
      soundPlayedRef.current = null;
      setShowParticles(false);
    }
  }, [verdict]);

  const isCaught = verdict === "caught";
  const particleColors = isCaught
    ? ["#8B0000", "#FF4444", "#AA0000", "#660000"]
    : ["#D4AF37", "#FFD700", "#FFA500", "#FFEC8B"];

  return (
    <AnimatePresence>
      {verdict && (
        <>
          {/* Flash effect */}
          <AnimatePresence>
            {flashVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-50 bg-white"
              />
            )}
          </AnimatePresence>

          {/* Particles */}
          {showParticles && (
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <Particle
                  key={i}
                  color={particleColors[i % particleColors.length]}
                  delay={i * 0.1}
                  isCaught={isCaught}
                />
              ))}
            </div>
          )}

          {/* Verdict card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              delay: 0.3,
              exit: { duration: 0.4, ease: "easeInOut" }
            }}
            className="fixed inset-x-4 bottom-4 top-4 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-xl max-h-full overflow-y-auto">
              {/* Main verdict card */}
              <motion.div
                initial={{ scale: 0.9, rotateX: -10 }}
                animate={{ scale: 1, rotateX: 0 }}
                transition={{ type: "spring", damping: 20, delay: 0.4 }}
                className={`
                  relative p-8 sm:p-10 rounded-2xl border-2 shadow-2xl overflow-hidden backdrop-blur-md
                  ${isCaught
                    ? "bg-[#0a0a0f]/95 border-magic-crimson/60"
                    : "bg-[#0a0a0f]/95 border-magic-gold/60"
                  }
                `}
              >
                {/* Animated background glow */}
                <motion.div
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 -z-10 blur-3xl ${isCaught ? "bg-magic-crimson/30" : "bg-magic-gold/30"}`}
                  style={{
                    transformOrigin: "center"
                  }}
                />

                {/* Header with icon and verdict */}
                <div className="flex items-center gap-5 mb-6">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
                    className={`
                      w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center border-2
                      ${isCaught
                        ? "bg-black/70 border-magic-crimson shadow-lg shadow-magic-crimson/30"
                        : "bg-black/70 border-magic-gold shadow-lg shadow-magic-gold/30"
                      }
                    `}
                  >
                    {isCaught ? (
                      <AlertTriangle className="w-10 h-10 text-magic-crimson" />
                    ) : (
                      <Trophy className="w-10 h-10 text-magic-gold" />
                    )}
                  </motion.div>

                  {/* Verdict text */}
                  <div className="flex-1 min-w-0">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`
                        font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-wider
                        ${isCaught ? "text-magic-crimson" : "text-magic-gold"}
                      `}
                      style={{
                        textShadow: isCaught
                          ? "0 0 30px rgba(139,0,0,0.5)"
                          : "0 0 30px rgba(212,175,55,0.5)"
                      }}
                    >
                      {t(isCaught ? 'verdict.caught' : 'verdict.fooled')}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="font-accent italic text-base text-gray-300"
                    >
                      {t(isCaught ? 'verdict.caught.subtitle' : 'verdict.fooled.subtitle')}
                    </motion.p>
                  </div>
                </div>

                {/* Content sections */}
                <div className="space-y-4">
                  {/* Timestamps for caught verdict */}
                  {isCaught && timestamps.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="p-4 bg-black/60 rounded-lg border border-magic-crimson/50"
                    >
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-body">
                        {t('verdict.timestamps')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {timestamps.map((time, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-magic-crimson/30 text-magic-crimson rounded-full text-sm font-body"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* AI Analysis - Scrollable */}
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="p-4 bg-black/60 rounded-lg border border-magic-gold/50 max-h-48 overflow-y-auto custom-scrollbar"
                    >
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-body">
                        {t('verdict.analysis')}
                      </p>
                      <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line font-body">
                        {analysis}
                      </div>
                    </motion.div>
                  )}

                  {/* Skill badge for fooled verdict */}
                  {!isCaught && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="flex justify-center"
                    >
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-black/50 rounded-full border border-magic-gold/60">
                        <span className="text-magic-gold text-base font-bold font-display">
                          {t('verdict.badge')}
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <motion.svg
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.9 + i * 0.08 }}
                              className="w-5 h-5 text-magic-gold"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Social Links */}
                  <SocialLinks />

                  {/* Retry button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    onClick={onRetry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={t('verdict.tryagain')}
                    className={`
                      w-full py-4 rounded-xl font-display font-bold text-base uppercase tracking-wider
                      flex items-center justify-center gap-2 transition-all shadow-lg border
                      bg-black/70 border-magic-gold/50 text-magic-gold hover:bg-black/80
                    `}
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t('verdict.tryagain')}
                  </motion.button>
                </div>

                {/* Decorative corner accents */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-l border-t ${isCaught ? 'border-magic-crimson/70' : 'border-magic-gold/70'}`} />
                <div className={`absolute top-2 right-2 w-4 h-4 border-r border-t ${isCaught ? 'border-magic-crimson/70' : 'border-magic-gold/70'}`} />
                <div className={`absolute bottom-2 left-2 w-4 h-4 border-l border-b ${isCaught ? 'border-magic-crimson/70' : 'border-magic-gold/70'}`} />
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-r border-b ${isCaught ? 'border-magic-crimson/70' : 'border-magic-gold/70'}`} />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
