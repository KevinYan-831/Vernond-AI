import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, Scan, Brain, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const analysisMessages = {
  en: [
    { text: "Analyzing hand movements...", icon: "scan" },
    { text: "Detecting misdirection patterns...", icon: "eye" },
    { text: "Scanning for hidden objects...", icon: "scan" },
    { text: "Tracking finger positions...", icon: "eye" },
    { text: "Analyzing timing sequences...", icon: "brain" },
    { text: "Checking thumb alignment...", icon: "brain" },
    { text: "Computing sleight probability...", icon: "sparkles" },
    { text: "Final verification in progress...", icon: "sparkles" },
  ],
  zh: [
    { text: "正在分析手部动作...", icon: "scan" },
    { text: "检测误导技巧...", icon: "eye" },
    { text: "扫描隐藏物品...", icon: "scan" },
    { text: "追踪手指位置...", icon: "eye" },
    { text: "分析时机控制...", icon: "brain" },
    { text: "检查拇指角度...", icon: "brain" },
    { text: "计算手法概率...", icon: "sparkles" },
    { text: "最终验证中...", icon: "sparkles" },
  ],
};

const IconComponent = ({ type }) => {
  const props = { className: "w-4 h-4 text-magic-gold mr-2" };
  switch (type) {
    case "eye": return <Eye {...props} />;
    case "scan": return <Scan {...props} />;
    case "brain": return <Brain {...props} />;
    case "sparkles": return <Sparkles {...props} />;
    default: return <Scan {...props} />;
  }
};

export default function AnalysisOverlay({ isAnalyzing, progress }) {
  const { language } = useLanguage();
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = analysisMessages[language];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentMessage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnalyzing, messages.length]);

  return (
    <AnimatePresence>
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-4 z-30 rounded-xl overflow-hidden"
        >
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Scanning laser line */}
          <motion.div
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-magic-gold to-transparent shadow-[0_0_20px_rgba(212,175,55,0.8)]"
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* AI eye animation */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-24 h-24 mb-6"
            >
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-magic-gold/30"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-magic-gold rounded-full" />
              </motion.div>

              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-magic-gold/50"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 bg-magic-gold rounded-full" />
              </motion.div>

              {/* Center eye */}
              <div className="absolute inset-6 rounded-full bg-magic-gold/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 rounded-full bg-magic-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                />
              </div>
            </motion.div>

            {/* Status message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center text-magic-gold text-sm tracking-wide"
              >
                <IconComponent type={messages[currentMessage].icon} />
                <span>{messages[currentMessage].text}</span>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-6 w-48 h-1 bg-magic-charcoal rounded-full overflow-hidden border border-magic-gold/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-magic-gold/50 via-magic-gold to-magic-gold/50"
              />
            </div>

            {/* Progress percentage */}
            <p className="mt-2 text-magic-gold/60 text-xs font-display">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Corner brackets animation */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-8"
          >
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-magic-gold/50" />
            <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-magic-gold/50" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-magic-gold/50" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-magic-gold/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
