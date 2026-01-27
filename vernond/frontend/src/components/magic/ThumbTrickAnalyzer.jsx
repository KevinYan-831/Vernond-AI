import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Upload } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { soundEffects } from "@/utils/sounds";

// Specific prompt for the thumb trick
const THUMB_TRICK_PROMPT = {
  en: `You are analyzing a performance of the classic "Thumb Trick" magic illusion.

The performer should:
1. Hold left hand horizontally at chest level, palm facing themselves
2. Tuck left thumb tip into palm while keeping knuckle visible
3. Position right thumb to create illusion of being the detached tip
4. Cover the joint with right pointer and middle fingers
5. Slowly pull hands apart to show thumb "detaching"
6. Reattach by bringing hands back together

Common mistakes that reveal the secret:
- Showing the palm straight-on
- Pulling apart too fast/abruptly
- Over-bending thumbs (creates tension)
- Exposing where thumbs meet
- Finger shaking or tension

SCORING GUIDE (0-100):
- 90-100: Perfect execution, no visible mistakes
- 70-89: Good performance with minor issues
- 50-69: Fair performance, several mistakes visible
- 30-49: Poor execution, major flaws
- 0-29: Failed to perform the trick properly

Respond strictly in this JSON format (no other text):
{
  "verdict": "caught" or "fooled",
  "score": 85,
  "confidence": 0.75,
  "timestamps": ["0:02.34", "0:05.12"],
  "analysis": "Detailed analysis (min 100 words)"
}`,
  zh: `你正在分析经典的"大拇指技巧"魔术表演。

表演者应该：
1. 左手水平举在胸前，掌心向自己
2. 将左拇指尖藏入掌心，同时保持拇指关节可见
3. 用右手拇指制造错觉，仿佛是被拔下的拇指尖
4. 用右手食指和中指掩盖关节连接处
5. 缓慢地拉开双手，展示拇指"脱落"
6. 将双手重新靠拢，完成"重新连接"

常见露馅错误：
- 从正面展示手掌
- 拉开速度太快/太突然
- 过度弯曲拇指（造成紧张感）
- 暴露拇指相接处
- 手指颤抖或紧张

评分标准 (0-100分):
- 90-100分：完美执行，无明显失误
- 70-89分：表现良好，有轻微问题
- 50-69分：表现一般，多个失误可见
- 30-49分：表现较差，重大缺陷
- 0-29分：未能正确完成魔术

请严格用以下JSON格式回复（不要有其他文字）：
{
  "verdict": "caught" 或 "fooled",
  "score": 85,
  "confidence": 0.75,
  "timestamps": ["0:02.34", "0:05.12"],
  "analysis": "详细分析（至少100字）"
}`
};

// Diamond corner decoration component
function DiamondCorner({ position }) {
  const positionStyles = {
    topLeft: 'top-0 left-0',
    topRight: 'top-0 right-0',
    bottomLeft: 'bottom-0 left-0',
    bottomRight: 'bottom-0 right-0',
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`absolute ${positionStyles[position]}`}
      style={{ margin: -4 }}
    >
      <path
        d="M12 0L24 12L12 24L0 12Z"
        fill="none"
        stroke="rgba(212, 175, 55, 0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M12 4L20 12L12 20L4 12Z"
        fill="rgba(139, 92, 246, 0.3)"
      />
    </svg>
  );
}

// Poker chip button component
function PokerChipButton({ variant, icon: Icon, label, disabled, onClick, isActive }) {
  const variants = {
    gold: {
      bg: 'from-amber-900/80 via-amber-950/90 to-amber-900/80',
      border: 'border-amber-500/60',
      text: 'text-amber-400',
      shadow: 'rgba(245, 158, 11, 0.4)',
      notches: 'text-amber-500/30',
    },
    red: {
      bg: 'from-red-900/80 via-red-950/90 to-red-900/80',
      border: 'border-red-500/60',
      text: 'text-red-400',
      shadow: 'rgba(239, 68, 68, 0.4)',
      notches: 'text-red-500/30',
    },
    purple: {
      bg: 'from-purple-900/80 via-purple-950/90 to-purple-900/80',
      border: 'border-purple-500/60',
      text: 'text-purple-400',
      shadow: 'rgba(168, 85, 247, 0.4)',
      notches: 'text-purple-500/30',
    }
  };

  const style = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.08, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        boxShadow: disabled ? 'none' : `0 8px 32px ${style.shadow}, inset 0 2px 0 rgba(255,255,255,0.1)`
      }}
    >
      {/* Poker chip notches */}
      {!disabled && [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <div
          key={angle}
          className={`absolute w-1 h-2 ${style.notches}`}
          style={{
            left: '50%',
            top: 2,
            transformOrigin: '50% 32px',
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
      ))}

      {/* Main chip body */}
      <div className={`absolute inset-0 rounded-full border-2 ${style.border} bg-gradient-to-b ${style.bg}`} />

      {/* Inner ring */}
      <div className={`absolute inset-2 rounded-full border ${style.border.replace('60', '40')} bg-black/40`} />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${disabled ? 'text-gray-600' : style.text}`} />
        <span className={`text-[9px] sm:text-[10px] mt-0.5 uppercase font-bold tracking-wider ${
          disabled ? 'text-gray-600' : style.text
        }`}>
          {label}
        </span>
      </div>

      {/* Active pulse */}
      {isActive && !disabled && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`absolute inset-0 rounded-full border-2 ${style.border}`}
        />
      )}
    </motion.button>
  );
}

// Analysis messages by language
const getAnalysisMessages = (lang) => ({
  en: [
    { text: "Analyzing hand movements...", icon: "👋" },
    { text: "Detecting misdirection...", icon: "👁️" },
    { text: "Scanning for hidden objects...", icon: "🔍" },
    { text: "Evaluating thumb technique...", icon: "👍" },
    { text: "Computing final verdict...", icon: "✨" },
  ],
  zh: [
    { text: "正在分析手部动作...", icon: "👋" },
    { text: "检测误导技巧...", icon: "👁️" },
    { text: "扫描隐藏手法...", icon: "🔍" },
    { text: "评估拇指技巧...", icon: "👍" },
    { text: "计算最终结果...", icon: "✨" },
  ]
})[lang];

export default function ThumbTrickAnalyzer() {
  const { language } = useLanguage();
  const [appState, setAppState] = useState("idle");
  const [countdown, setCountdown] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [verdict, setVerdict] = useState(null);
  const [score, setScore] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisMessageIndex, setAnalysisMessageIndex] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'gold',
    confirmText: 'OK',
    onConfirm: null
  });

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const recordingVideoRef = useRef(null);

  // Analysis message cycling
  useEffect(() => {
    if (appState === "analyzing") {
      const interval = setInterval(() => {
        setAnalysisMessageIndex(prev => (prev + 1) % getAnalysisMessages(language).length);
      }, 1500);
      return () => clearInterval(interval);
    }
    setAnalysisMessageIndex(0);
  }, [appState, language]);

  // Camera initialization
  useEffect(() => {
    const initCamera = async () => {
      setCameraError(null);
      setIsCameraReady(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        streamRef.current = stream;
        setIsCameraReady(true);
        setCameraError(null);

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        setIsCameraReady(false);
        setCameraError(
          language === 'zh'
            ? '无法访问摄像头，请检查权限。'
            : 'Camera access denied. Please check permissions.'
        );
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isResetting, language]);

  const showAlert = useCallback((title, message, type = 'gold', confirmText = 'OK', onConfirm = null) => {
    setAlert({ isOpen: true, title, message, type, confirmText, onConfirm });
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      showAlert(
        language === 'zh' ? '摄像头未就绪' : 'Camera Not Ready',
        language === 'zh'
          ? '请等待摄像头初始化完成。'
          : 'Please wait for the camera to initialize.',
        'red',
        language === 'zh' ? '知道了' : 'Got it'
      );
      return;
    }

    chunksRef.current = [];

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        uploadAndAnalyze(blob);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setAppState("recording");
    } catch (err) {
      showAlert(
        language === 'zh' ? '录制失败' : 'Recording Failed',
        `${language === 'zh' ? '启动录制失败：' : 'Failed to start recording: '}${err.message}`,
        'red',
        language === 'zh' ? '知道了' : 'Got it'
      );
      setAppState("idle");
    }
  }, [language, showAlert]);

  const startCountdown = useCallback(() => {
    setAppState("countdown");
    setCountdown(3);
    soundEffects.playTick?.();
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      startRecording();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
      soundEffects.playTick?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, startRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const uploadAndAnalyze = useCallback(async (blob) => {
    setAppState("uploading");

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    setAppState("analyzing");
    setAnalysisProgress(0);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    const formData = new FormData();
    formData.append("video", blob, "thumb-trick.mp4");
    formData.append("language", language);
    formData.append("prompt", THUMB_TRICK_PROMPT[language]);

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-analyze-magic-trick",
        { body: formData }
      );

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (error) {
        throw error;
      }

      setVerdict(data.verdict);
      setScore(data.score || (data.verdict === 'fooled' ? 90 : 45));
      setTimestamps(data.timestamps || []);
      setAnalysisText(data.analysis || "");
    } catch (err) {
      clearInterval(progressInterval);
      setAppState("idle");
      showAlert(
        language === 'zh' ? '分析失败' : 'Analysis Failed',
        `${err.message || 'Unknown error'}`,
        'red',
        language === 'zh' ? '知道了' : 'Got it'
      );
    }
  }, [language, showAlert]);

  const handleFileSelect = useCallback((file) => {
    const blob = new Blob([file], { type: file.type });
    setVideoBlob(blob);
    uploadAndAnalyze(blob);
  }, [uploadAndAnalyze]);

  const handleRetry = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsResetting(true);
    setIsCameraReady(false);
    setAppState("idle");
    setVideoBlob(null);
    setVerdict(null);
    setScore(null);
    setTimestamps([]);
    setAnalysisText("");
    setAnalysisProgress(0);
    chunksRef.current = [];
    streamRef.current = null;
  }, []);

  const getInstructionText = () => {
    if (cameraError) return cameraError;
    if (!isCameraReady) {
      return language === 'zh' ? '正在初始化摄像头...' : 'Initializing camera...';
    }
    if (appState === "idle") {
      return language === 'zh'
        ? '录制或上传你的拇指技巧表演，看看能否骗过AI！'
        : 'Record or upload your thumb trick performance to see if you can fool the AI!';
    }
    if (appState === "recording") {
      return language === 'zh' ? '正在录制...' : 'Recording...';
    }
    if (appState === "analyzing") {
      const messages = getAnalysisMessages(language);
      return messages[analysisMessageIndex]?.text || '';
    }
    return '';
  };

  return (
    <div className="w-full max-w-md mx-auto p-1">
      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(45, 27, 105, 0.9) 0%, rgba(20, 10, 45, 0.95) 100%)',
          boxShadow: '0 0 60px rgba(124, 77, 255, 0.3), 0 0 100px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(212, 175, 55, 0.25)'
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
          className="absolute inset-0 opacity-30"
        >
          <div
            className="h-full w-1/3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
              filter: 'blur(8px)'
            }}
          />
        </motion.div>

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 text-center">
          {/* Logo */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center gap-2 mb-1"
          >
            <span className="text-2xl">🪄</span>
            <span className="font-display text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300">
              Vernond AI
            </span>
          </motion.div>
          <p className="text-xs text-purple-200/70 italic">
            {language === 'zh' ? '你能骗过这双AI之眼吗？' : 'Can you fool the artificial eye?'}
          </p>
        </div>

        {/* Video Stage */}
        <div className="relative px-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50">
            {/* Gradient border frame */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(212, 175, 55, 0.4) 100%)',
                padding: '2px'
              }}
            >
              <div className="w-full h-full rounded-xl bg-[#0a0a12]" />
            </div>

            {/* Video feed */}
            {videoBlob ? (
              <video
                src={URL.createObjectURL(videoBlob)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            )}

            {/* Analysis overlay */}
            {appState === "analyzing" && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mb-3 border-3 border-amber-500/30 border-t-amber-500 rounded-full"
                />
                <p className="text-amber-400 text-sm">{getAnalysisMessages(language)[analysisMessageIndex]?.text}</p>
                <div className="w-32 h-1 mt-3 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${analysisProgress}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Recording indicator */}
            {appState === "recording" && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/80 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white"
                />
                <span className="text-white text-[10px] font-bold">REC</span>
              </div>
            )}

            {/* Corner diamonds */}
            <DiamondCorner position="topLeft" />
            <DiamondCorner position="topRight" />
            <DiamondCorner position="bottomLeft" />
            <DiamondCorner position="bottomRight" />

            {/* Camera loading */}
            {!isCameraReady && !videoBlob && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="relative px-6 py-5">
          <div className="flex items-center justify-center gap-6">
            <PokerChipButton
              variant="gold"
              icon={Play}
              label={language === 'zh' ? '开始' : 'START'}
              disabled={appState === "recording" || appState === "uploading" || appState === "analyzing"}
              onClick={startCountdown}
            />
            <PokerChipButton
              variant="red"
              icon={Square}
              label={language === 'zh' ? '停止' : 'STOP'}
              disabled={appState !== "recording"}
              onClick={stopRecording}
              isActive={appState === "recording"}
            />
            <PokerChipButton
              variant="purple"
              icon={Upload}
              label={language === 'zh' ? '上传' : 'UPLOAD'}
              disabled={appState === "recording" || appState === "uploading" || appState === "analyzing"}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </div>

        {/* Instructions */}
        <div className="relative px-6 pb-5">
          <div className="text-center py-3 px-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
            <p className="text-sm text-gray-300 leading-relaxed">
              {getInstructionText()}
            </p>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-500/30 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-500/30 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-purple-500/30 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-purple-500/30 rounded-br-3xl" />
      </motion.div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="w-32 h-32 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(45, 27, 105, 0.9) 0%, rgba(20, 10, 45, 0.95) 100%)',
                boxShadow: '0 0 60px rgba(212, 175, 55, 0.4)',
                border: '2px solid rgba(212, 175, 55, 0.6)'
              }}
            >
              <span className="font-display text-7xl font-bold text-amber-400">{countdown}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verdict Modal - Compact Polished Design */}
      {verdict && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleRetry}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 10, 40, 0.98) 0%, rgba(10, 6, 20, 0.99) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(139, 92, 246, 0.15)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-white/10">
                <div className="flex items-center gap-4">
                  {/* Score Circle - Compact */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        stroke={score >= 70 ? '#fbbf24' : score >= 40 ? '#fb923c' : '#f87171'}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: score / 100 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        style={{ strokeDasharray: '176', strokeDashoffset: 176 - (176 * score / 100) }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${
                        score >= 70 ? 'text-amber-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {score}
                      </span>
                    </div>
                  </motion.div>

                  {/* Verdict Text */}
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`text-xl font-bold ${
                        score >= 70 ? 'text-amber-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'
                      }`}
                    >
                      {score >= 70
                        ? (language === 'zh' ? '太棒了！' : 'Excellent!')
                        : score >= 40
                          ? (language === 'zh' ? '不错！' : 'Good!')
                          : (language === 'zh' ? '继续练习' : 'Keep Practicing')
                      }
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-gray-400"
                    >
                      {verdict === 'fooled'
                        ? (language === 'zh' ? 'AI没看穿你的手法' : 'You fooled the AI!')
                        : (language === 'zh' ? 'AI发现了破绽' : 'AI detected your method')}
                    </motion.p>
                  </div>
                </div>

                <button
                  onClick={handleRetry}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* Your Recording - Main Video with Timestamps */}
                {videoBlob && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                      {language === 'zh' ? '你的表演 - 点击时间戳查看问题点' : 'Your Performance - Click timestamps to see issues'}
                    </p>
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                      <video
                        ref={recordingVideoRef}
                        src={URL.createObjectURL(videoBlob)}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                      />
                    </div>

                    {/* Timestamp Markers - Clickable to jump in YOUR video */}
                    {timestamps.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                          {language === 'zh' ? '问题时间点' : 'Problem Timestamps'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {timestamps.map((time, i) => {
                            const parts = time.split(':');
                            const seconds = parts.length === 2
                              ? parseInt(parts[0]) * 60 + parseFloat(parts[1])
                              : 0;
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (recordingVideoRef.current) {
                                    recordingVideoRef.current.currentTime = seconds;
                                    recordingVideoRef.current.play();
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-all border border-red-500/20"
                              >
                                📍 {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tutorial Video - Reference */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                    {language === 'zh' ? '教学参考视频' : 'Tutorial Reference'}
                  </p>
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-48">
                    <video
                      src="/videos/learn_compressed.mp4"
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                    />
                  </div>
                </div>

                {/* Full Analysis Text */}
                {analysisText && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                      {language === 'zh' ? 'AI 详细分析' : 'AI Analysis'}
                    </p>
                    <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {analysisText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all"
                >
                  {language === 'zh' ? '再试一次' : 'Try Again'}
                </button>
                <button
                  onClick={() => navigator.share?.({ title: 'Vernond AI', text: analysisText }).catch(() => {})}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                >
                  {language === 'zh' ? '分享' : 'Share'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Alert */}
      <AnimatePresence>
        {alert.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setAlert({ ...alert, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(145deg, rgba(45, 27, 105, 0.95) 0%, rgba(20, 10, 45, 0.98) 100%)',
                border: '2px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              <p className="text-lg font-semibold text-amber-400 mb-2">{alert.title}</p>
              <p className="text-gray-300 mb-4">{alert.message}</p>
              <button
                onClick={() => setAlert({ ...alert, isOpen: false })}
                className="px-6 py-2 rounded-lg bg-amber-600/30 text-amber-400 border border-amber-500/50 hover:bg-amber-600/50 transition-all"
              >
                {alert.confirmText}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
