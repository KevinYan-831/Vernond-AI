import { motion } from "framer-motion";
import { Play, Square, Upload } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Reusable button component with poker chip aesthetic
function ControlButton({
  onClick,
  disabled,
  variant,
  icon: Icon,
  label,
  glowColor,
  isActive = false,
  isLoading = false
}) {
  const variants = {
    gold: {
      bg: 'from-[#1a1510] via-[#0f0d0a] to-[#0a0908]',
      border: 'border-magic-gold/60',
      text: 'text-magic-gold',
      glow: 'rgba(212,175,55,0.4)',
      hoverGlow: 'rgba(212,175,55,0.6)',
      innerRing: 'border-magic-gold/40'
    },
    crimson: {
      bg: 'from-[#1a0a0a] via-[#0f0808] to-[#0a0606]',
      border: 'border-red-500/60',
      text: 'text-red-400',
      glow: 'rgba(239,68,68,0.4)',
      hoverGlow: 'rgba(239,68,68,0.6)',
      innerRing: 'border-red-500/40'
    },
    purple: {
      bg: 'from-[#150a1a] via-[#0d080f] to-[#08060a]',
      border: 'border-purple-500/60',
      text: 'text-purple-400',
      glow: 'rgba(168,85,247,0.4)',
      hoverGlow: 'rgba(168,85,247,0.6)',
      innerRing: 'border-purple-500/40'
    }
  };

  const style = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.06, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      className={`
        relative w-20 h-20 md:w-24 md:h-24 rounded-full
        transition-all duration-300 overflow-hidden
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer'
        }
      `}
      style={{
        boxShadow: disabled ? 'none' : `
          0 10px 40px ${glowColor},
          0 0 0 1px rgba(255,255,255,0.08),
          inset 0 2px 0 rgba(255,255,255,0.15),
          inset 0 -2px 4px rgba(0,0,0,0.4)
        `
      }}
    >
      {/* Outer ring - poker chip edge effect */}
      <div className={`
        absolute inset-0 rounded-full border-2 ${style.border}
        bg-gradient-to-b ${style.bg}
      `}>
        {/* Decorative notches around edge like a poker chip */}
        {!disabled && [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <div
            key={angle}
            className={`absolute w-1 h-3 ${style.text} opacity-40`}
            style={{
              left: '50%',
              top: '0',
              transformOrigin: '50% 40px',
              transform: `translateX(-50%) rotate(${angle}deg)`,
              background: 'currentColor',
              borderRadius: '0.5px'
            }}
          />
        ))}
      </div>

      {/* Animated shimmer on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              transform: 'skewX(-20deg)'
            }}
          />
        </motion.div>
      )}

      {/* Inner circle */}
      <div className={`
        absolute inset-2 rounded-full border ${style.innerRing}
        bg-gradient-to-b from-black/60 to-transparent
      `} />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`w-6 h-6 md:w-8 md:h-8 border-2 border-gray-600 border-t-magic-gold rounded-full`}
          />
        ) : (
          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${disabled ? 'text-gray-600' : style.text}`} />
        )}
        <span className={`text-[10px] md:text-xs mt-1 font-display uppercase tracking-wider font-semibold ${disabled ? 'text-gray-600' : style.text}`}>
          {label}
        </span>
      </div>

      {/* Active pulse effect */}
      {isActive && !disabled && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className={`absolute inset-0 rounded-full border-2 ${style.border}`}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
            className={`absolute inset-0 rounded-full border-2 ${style.border}`}
          />
        </>
      )}

      {/* Hover glow */}
      {!disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -inset-4 rounded-full blur-xl -z-10"
          style={{ background: `radial-gradient(circle, ${style.hoverGlow} 0%, transparent 70%)` }}
        />
      )}
    </motion.button>
  );
}

export default function RecordingControls({
  isRecording,
  isUploading,
  isCameraReady,
  onStart,
  onStop,
  onFileSelect,
  countdown,
}) {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isProcessing = isUploading || countdown !== null;

  return (
    <div className="mt-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Controls container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-6 md:gap-10"
      >
        {/* Start Button */}
        <div className="flex flex-col items-center">
          <ControlButton
            onClick={onStart}
            disabled={isRecording || isProcessing || !isCameraReady}
            variant="gold"
            icon={Play}
            label={language === 'zh' ? '录制' : 'Start'}
            glowColor="rgba(212,175,55,0.2)"
            isLoading={!isCameraReady}
          />
        </div>

        {/* Stop Button */}
        <div className="flex flex-col items-center">
          <ControlButton
            onClick={onStop}
            disabled={!isRecording || isUploading}
            variant="crimson"
            icon={Square}
            label={language === 'zh' ? '停止' : 'Stop'}
            glowColor="rgba(239,68,68,0.2)"
            isActive={isRecording}
          />
        </div>

        {/* Upload Button */}
        <div className="flex flex-col items-center">
          <ControlButton
            onClick={handleUploadClick}
            disabled={isRecording || isProcessing}
            variant="purple"
            icon={Upload}
            label={language === 'zh' ? '上传' : 'Upload'}
            glowColor="rgba(168,85,247,0.2)"
          />
        </div>
      </motion.div>

      {/* Decorative line below controls */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-magic-gold/30 to-transparent"
      />
    </div>
  );
}
