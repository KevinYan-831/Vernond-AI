import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoStage({ isRecording, videoBlob, onStreamReady, shouldReinitialize }) {
  const videoRef = useRef(null);
  const frozenVideoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const streamInitialized = useRef(false);
  const currentStreamRef = useRef(null);

  const initCamera = useCallback(async (forceReinit = false) => {
    if (streamInitialized.current && !forceReinit) return;

    setCameraError(null);
    setHasCamera(false);

    // Stop any existing stream first
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
      currentStreamRef.current = null;
    }

    // Detect mobile devices and use much lower resolution
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || /iPad|iPhone|iPod/.test(navigator.platform)
      || (navigator.maxTouchPoints > 0);

    // Use strict max constraints for mobile to reduce file size
    const resolution = isMobile
      ? {
          width: { max: 640, ideal: 640 },
          height: { max: 480, ideal: 480 },
          frameRate: { max: 24, ideal: 24 }
        }
      : { width: { ideal: 1280 }, height: { ideal: 720 } };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", ...resolution },
        audio: false,
      });

      currentStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          setHasCamera(true);
          setCameraError(null);
          streamInitialized.current = true;
          onStreamReady(stream);
        } catch {
          setCameraError("Could not start video playback. Please refresh and try again.");
          setHasCamera(false);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      if (errorMessage.includes("Permission denied") || errorMessage.includes("NotAllowedError")) {
        setCameraError("Camera permission denied. Please allow camera access and refresh the page.");
      } else if (errorMessage.includes("NotFoundError")) {
        setCameraError("No camera found. Please connect a camera and try again.");
      } else {
        setCameraError("Unable to access camera. Please check your browser settings and try again.");
      }
      setHasCamera(false);
      streamInitialized.current = false;
    }
  }, [onStreamReady]);

  // Initial camera setup
  useEffect(() => {
    initCamera();

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach(track => track.stop());
        currentStreamRef.current = null;
      }
      streamInitialized.current = false;
    };
  }, [initCamera]);

  // Handle camera reset for retry functionality
  useEffect(() => {
    if (shouldReinitialize && !videoBlob) {
      streamInitialized.current = false;
      initCamera(true);
    }
  }, [shouldReinitialize, videoBlob, initCamera]);

  useEffect(() => {
    if (videoBlob && frozenVideoRef.current) {
      const url = URL.createObjectURL(videoBlob);
      frozenVideoRef.current.src = url;
      frozenVideoRef.current.load();
      frozenVideoRef.current.play().catch(() => {});
      return () => URL.revokeObjectURL(url);
    }
  }, [videoBlob]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video group">
      {/* Outer ambient glow */}
      <motion.div
        animate={{
          opacity: isRecording ? [0.4, 0.6, 0.4] : [0.2, 0.3, 0.2],
          scale: isRecording ? [1, 1.02, 1] : [1, 1.01, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -inset-4 rounded-3xl blur-2xl"
        style={{
          background: isRecording
            ? 'radial-gradient(ellipse, rgba(230,57,70,0.25) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%)'
        }}
      />

      {/* Outer card frame */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-[#1a1a2e] via-[#0f0f1a] to-[#0a0a12] opacity-90" />

      {/* Animated border shimmer */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
        className="absolute -inset-2 rounded-2xl overflow-hidden opacity-30"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
            filter: 'blur(8px)'
          }}
        />
      </motion.div>

      {/* Decorative border with card pattern corners */}
      <div className="absolute -inset-2 rounded-2xl border border-magic-gold/30" />

      {/* Main frame with premium edge lighting */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            linear-gradient(135deg, rgba(212,175,55,0.18) 0%, transparent 25%),
            linear-gradient(-135deg, rgba(212,175,55,0.12) 0%, transparent 25%),
            linear-gradient(45deg, rgba(212,175,55,0.12) 0%, transparent 25%),
            linear-gradient(-45deg, rgba(212,175,55,0.18) 0%, transparent 25%),
            linear-gradient(to bottom, #0d0d15 0%, #080810 100%)
          `,
          boxShadow: `
            inset 0 2px 40px rgba(0,0,0,0.9),
            0 0 80px rgba(212,175,55,0.1),
            0 25px 60px -12px rgba(0,0,0,0.8),
            0 0 0 1px rgba(212,175,55,0.05)
          `
        }}
      />

      {/* Inner video container */}
      <div className="absolute inset-3 rounded-lg overflow-hidden bg-black">
        {/* Elegant vignette overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)
            `
          }}
        />

        {/* Dynamic spotlight based on recording state */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          animate={{
            opacity: isRecording ? 0.4 : 0.2
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: isRecording
              ? "radial-gradient(circle at 50% 30%, rgba(230,57,70,0.2) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.15) 0%, transparent 50%)"
          }}
        />

        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0d0d15] to-[#080810]">
            <div className="text-center p-8 max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-b from-red-900/30 to-red-900/10 flex items-center justify-center border border-red-500/30">
                <span className="text-4xl text-red-400">♠</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{cameraError}</p>
              <button
                onClick={() => {
                  streamInitialized.current = false;
                  initCamera();
                }}
                className="px-6 py-3 bg-gradient-to-b from-magic-gold/20 to-magic-gold/10 text-magic-gold rounded-lg text-sm hover:from-magic-gold/30 hover:to-magic-gold/20 transition-all border border-magic-gold/30 shadow-[0_4px_20px_rgba(212,175,55,0.1)]"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${videoBlob ? 'hidden' : 'block'}`}
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Frozen video after recording */}
            <AnimatePresence>
              {videoBlob && (
                <motion.video
                  ref={frozenVideoRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  muted
                  playsInline
                  loop
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute top-4 right-4 z-30"
            >
              <div className="flex items-center gap-2.5 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.3)]">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,1)]"
                />
                <span className="text-xs text-white/95 tracking-widest uppercase font-semibold">REC</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elegant corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-magic-gold/40 rounded-tl" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-magic-gold/40 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-magic-gold/40 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-magic-gold/40 rounded-br" />

        {/* Corner card suits */}
        <span className="absolute top-4 left-4 text-magic-gold/20 text-sm font-serif">♠</span>
        <span className="absolute top-4 right-4 text-red-400/20 text-sm font-serif">♥</span>
        <span className="absolute bottom-4 left-4 text-red-400/20 text-sm font-serif rotate-180">♦</span>
        <span className="absolute bottom-4 right-4 text-magic-gold/20 text-sm font-serif rotate-180">♣</span>
      </div>

      {/* Stage reflection/glow underneath */}
      <motion.div
        animate={{
          opacity: isRecording ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 rounded-full blur-xl"
        style={{
          background: isRecording
            ? "radial-gradient(ellipse, rgba(230,57,70,0.3) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)"
        }}
      />
    </div>
  );
}
