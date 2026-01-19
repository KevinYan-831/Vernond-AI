import { motion, AnimatePresence } from "framer-motion";

const variants = {
  gold: {
    bg: 'from-[#1a1510] via-[#0f0d0a] to-[#0a0908]',
    border: 'border-magic-gold/60',
    text: 'text-magic-gold',
    glow: 'rgba(212,175,55,0.4)',
    innerRing: 'border-magic-gold/40'
  },
  crimson: {
    bg: 'from-[#1a0a0a] via-[#0f0808] to-[#0a0606]',
    border: 'border-red-500/60',
    text: 'text-red-400',
    glow: 'rgba(239,68,68,0.4)',
    innerRing: 'border-red-500/40'
  },
  purple: {
    bg: 'from-[#150a1a] via-[#0d080f] to-[#08060a]',
    border: 'border-purple-500/60',
    text: 'text-purple-400',
    glow: 'rgba(168,85,247,0.4)',
    innerRing: 'border-purple-500/40'
  }
};

export default function MagicAlert({
  isOpen,
  title,
  message,
  type = 'gold',
  onConfirm,
  confirmText = 'OK'
}) {
  const style = variants[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onConfirm}
          />

          {/* Alert Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              {/* Outer glow */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl -z-10"
                style={{ background: `radial-gradient(ellipse, ${style.glow} 0%, transparent 70%)` }}
              />

              {/* Main card */}
              <div
                className={`
                  relative rounded-2xl border-2 ${style.border}
                  bg-gradient-to-b ${style.bg}
                  shadow-2xl overflow-hidden
                `}
                style={{
                  boxShadow: `
                    0 10px 40px ${style.glow},
                    0 0 0 1px rgba(255,255,255,0.08),
                    inset 0 2px 0 rgba(255,255,255,0.15),
                    inset 0 -2px 4px rgba(0,0,0,0.4)
                  `
                }}
              >
                {/* Inner ring */}
                <div className={`
                  absolute inset-1 rounded-xl border ${style.innerRing}
                  bg-gradient-to-b from-black/60 to-transparent
                `} />

                {/* Decorative corner accents */}
                <div className={`absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 ${style.text} opacity-40 rounded-tl`} />
                <div className={`absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 ${style.text} opacity-40 rounded-tr`} />
                <div className={`absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 ${style.text} opacity-40 rounded-bl`} />
                <div className={`absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 ${style.text} opacity-40 rounded-br`} />

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`
                      w-16 h-16 mx-auto mb-6 rounded-full
                      bg-gradient-to-b from-black/40 to-transparent
                      border-2 ${style.border}
                      flex items-center justify-center
                    `}
                  >
                    {type === 'crimson' && (
                      <span className="text-3xl text-red-400">!</span>
                    )}
                    {type === 'gold' && (
                      <span className="text-3xl text-magic-gold">✦</span>
                    )}
                    {type === 'purple' && (
                      <span className="text-3xl text-purple-400">ℹ</span>
                    )}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-xl font-display font-semibold text-center mb-4 ${style.text}`}
                  >
                    {title}
                  </motion.h3>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-center text-sm leading-relaxed mb-8 font-body"
                  >
                    {message}
                  </motion.p>

                  {/* Confirm Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className={`
                      w-full py-3 px-6 rounded-lg font-display font-semibold
                      text-sm uppercase tracking-wider transition-all
                      bg-gradient-to-b from-white/10 to-white/5
                      border ${style.border} ${style.text}
                      hover:from-white/15 hover:to-white/10
                      shadow-lg
                    `}
                    style={{
                      boxShadow: `0 4px 20px ${style.glow}`
                    }}
                  >
                    {confirmText}
                  </motion.button>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px ${style.text} opacity-40`}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
