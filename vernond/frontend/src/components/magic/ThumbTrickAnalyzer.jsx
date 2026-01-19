import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoStage from "./VideoStage";
import RecordingControls from "./RecordingControls";
import Countdown from "./Countdown";
import AnalysisOverlay from "./AnalysisOverlay";
import VerdictDisplay from "./VerdictDisplay";
import MagicAlert from "./MagicAlert";
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

Respond strictly in this JSON format (no other text):
{
  "verdict": "caught" or "fooled",
  "confidence": 0.75,
  "timestamps": ["0:02.34"],
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

请严格用以下JSON格式回复（不要有其他文字）：
{
  "verdict": "caught" 或 "fooled",
  "confidence": 0.75,
  "timestamps": ["0:02.34"],
  "analysis": "详细分析（至少100字）"
}`
};

/**
 * ThumbTrickAnalyzer - AI-powered analysis component for the thumb trick
 *
 * This component orchestrates the entire flow of recording or uploading a magic trick
 * video and having it analyzed by AI (Gemini).
 */
export default function ThumbTrickAnalyzer() {
  const { t, language } = useLanguage();
  const [appState, setAppState] = useState("idle"); // idle | countdown | recording | uploading | analyzing
  const [countdown, setCountdown] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [verdict, setVerdict] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [analysisText, setAnalysisText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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

  const handleStreamReady = useCallback((stream) => {
    streamRef.current = stream;
    setIsCameraReady(true);
    setIsResetting(false);
  }, []);

  const showAlert = useCallback((title, message, type = 'gold', confirmText = 'OK', onConfirm = null) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      onConfirm
    });
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      showAlert(
        language === 'zh' ? '摄像头未就绪' : 'Camera Not Ready',
        language === 'zh'
          ? '请等待摄像头初始化完成。'
          : 'Please wait for the camera to initialize.',
        'crimson',
        language === 'zh' ? '知道了' : 'Got it'
      );
      return;
    }

    chunksRef.current = [];

    try {
      // Check codec support
      let options = {};
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: "video/webm;codecs=vp9" };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = { mimeType: "video/webm;codecs=vp8" };
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = { mimeType: "video/webm" };
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options = { mimeType: "video/mp4" };
      } else if (MediaRecorder.isTypeSupported('video/webkit')) {
        options = { mimeType: "video/webkit" };
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = chunksRef.current[0]?.type || options.mimeType || "video/mp4";
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        setVideoBlob(blob);
        uploadAndAnalyze(blob);
      };

      mediaRecorder.onerror = () => {
        showAlert(
          language === 'zh' ? '录制错误' : 'Recording Error',
          language === 'zh'
            ? '录制时发生错误，请重试。'
            : 'Recording error occurred. Please try again.',
          'crimson',
          language === 'zh' ? '知道了' : 'Got it'
        );
        setAppState("idle");
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setAppState("recording");
    } catch (err) {
      showAlert(
        language === 'zh' ? '录制失败' : 'Recording Failed',
        `${language === 'zh' ? '启动录制失败：' : 'Failed to start recording: '}${err instanceof Error ? err.message : "Unknown error"}`,
        'crimson',
        language === 'zh' ? '知道了' : 'Got it'
      );
      setAppState("idle");
    }
  }, [language, showAlert]);

  const handleAlertConfirm = useCallback(() => {
    setAlert({ isOpen: false, title: '', message: '' });
  }, []);

  const startCountdown = useCallback(() => {
    showAlert(
      language === 'zh' ? '录制提示' : 'Recording Tip',
      language === 'zh'
        ? '请确保在30秒内完成你的拇指技巧表演！'
        : 'Please finish your thumb trick performance within 30 seconds!',
      'gold',
      language === 'zh' ? '开始录制' : 'Start Recording',
      () => {
        setAlert({ isOpen: false, title: '', message: '' });
        setAppState("countdown");
        setCountdown(3);
      }
    );
  }, [language, showAlert]);

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      startRecording();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, startRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      soundEffects.playShutter();
    }
  }, []);

  const uploadAndAnalyze = useCallback(async (blob) => {
    setAppState("uploading");
    setUploadProgress(0);

    try {
      // Upload progress simulation
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 800));
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Start analysis
      setAppState("analyzing");
      setAnalysisProgress(0);

      // Analysis progress simulation
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 8;
        });
      }, 200);

      // Prepare form data
      const formData = new FormData();
      formData.append("video", blob, "thumb-trick.mp4");
      formData.append("language", language);
      formData.append("prompt", THUMB_TRICK_PROMPT[language]);

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-analyze-magic-trick",
        {
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Wait a moment before showing verdict
      await new Promise(resolve => setTimeout(resolve, 500));

      if (error) {
        setAppState("idle");
        let errorDetails = error.message || String(error);
        if ('context' in error && typeof error.context === 'object') {
          errorDetails = error.context?.details || errorDetails;
        }
        console.error('[Analysis Error]', error);
        setVideoBlob(null);
        showAlert(
          language === 'zh' ? '分析失败' : 'Analysis Failed',
          `${language === 'zh' ? '分析失败：' : 'Analysis failed: '}${errorDetails}`,
          'crimson',
          language === 'zh' ? '知道了' : 'Got it'
        );
        return;
      }

      // Successfully received AI analysis
      setVerdict(data.verdict);
      setTimestamps(data.timestamps || []);
      setAnalysisText(data.analysis || "");

    } catch (err) {
      setAppState("idle");
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setVideoBlob(null);
      showAlert(
        language === 'zh' ? '上传或分析失败' : 'Upload/Analysis Failed',
        `${language === 'zh' ? '上传或分析失败：' : 'Upload or analysis failed: '}${errorMessage}`,
        'crimson',
        language === 'zh' ? '知道了' : 'Got it'
      );
    }
  }, [language, showAlert]);

  const handleRetry = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    setIsResetting(true);
    setIsCameraReady(false);

    setAppState("idle");
    setVideoBlob(null);
    setVerdict(null);
    setTimestamps([]);
    setAnalysisText("");
    setAnalysisProgress(0);
    setUploadProgress(0);
    chunksRef.current = [];
    streamRef.current = null;
  }, []);

  const handleFileSelect = useCallback((file) => {
    setVerdict(null);
    setTimestamps([]);
    setAnalysisText("");
    setAnalysisProgress(0);
    setUploadProgress(0);
    setAppState("idle");
    setVideoBlob(null);

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
    if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0] + '/'))) {
      showAlert(
        language === 'zh' ? '格式错误' : 'Invalid Format',
        language === 'zh'
          ? '无效的视频格式。请上传 MP4、WebM、MOV 或 AVI 文件。'
          : 'Invalid video format. Please upload MP4, WebM, MOV, or AVI files.',
        'crimson',
        language === 'zh' ? '知道了' : 'Got it'
      );
      return;
    }

    const blob = new Blob([file], { type: file.type });
    setVideoBlob(blob);
    uploadAndAnalyze(blob);
  }, [language, showAlert, uploadAndAnalyze]);

  return (
    <div className="relative w-full">
      {/* Stage area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl mx-auto relative"
      >
        <VideoStage
          isRecording={appState === "recording"}
          videoBlob={videoBlob}
          onStreamReady={handleStreamReady}
          shouldReinitialize={isResetting}
        />

        {/* Analysis overlay on the video */}
        <AnalysisOverlay
          isAnalyzing={appState === "analyzing"}
          progress={analysisProgress}
        />

        {/* Upload progress overlay */}
        <AnimatePresence>
          {appState === "uploading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 rounded-xl overflow-hidden flex items-center justify-center bg-black/60"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 border-4 border-magic-gold/30 border-t-magic-gold rounded-full"
                />
                <p className="text-magic-gold text-sm font-body">
                  {language === 'zh' ? '正在上传视频...' : 'Uploading video...'}
                </p>
                <div className="mt-3 w-32 mx-auto h-1 bg-magic-charcoal rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-magic-gold"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <RecordingControls
          isRecording={appState === "recording"}
          isUploading={appState === "uploading" || appState === "analyzing"}
          isCameraReady={isCameraReady}
          onStart={startCountdown}
          onStop={stopRecording}
          onFileSelect={handleFileSelect}
          countdown={countdown}
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-10 text-center max-w-md mx-auto"
      >
        <div className="relative px-7 py-5 rounded-2xl glass-effect group hover:border-magic-gold/20 transition-all duration-300">
          {/* Decorative card suit icons */}
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-3 left-4 text-magic-gold/25 text-sm"
          >
            ♠
          </motion.span>
          <motion.span
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-3 right-4 text-red-400/25 text-sm"
          >
            ♥
          </motion.span>

          <p className="text-gray-200 text-sm leading-relaxed font-body">
            {appState === "idle" && !isCameraReady && (
              <span className="inline-flex items-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-3.5 h-3.5 border-2 border-magic-gold/40 border-t-magic-gold rounded-full"
                />
                <span className="text-gray-300">
                  {language === 'zh' ? '正在初始化摄像头...' : 'Initializing camera...'}
                </span>
              </span>
            )}
            {appState === "idle" && isCameraReady && (
              <span className="text-amber-100/90">{t('instructions.idle')}</span>
            )}
            {appState === "countdown" && (
              <span className="text-amber-200">
                {language === 'zh' ? '准备好...即将开始录制！' : 'Get ready... recording starts soon!'}
              </span>
            )}
            {appState === "recording" && (
              <span className="text-red-300/90">{t('instructions.recording')}</span>
            )}
            {appState === "uploading" && (
              <span className="text-cyan-200/90">{t('instructions.uploading')}</span>
            )}
            {appState === "analyzing" && (
              <span className="text-purple-200/90">{t('instructions.analyzing')}</span>
            )}
          </p>

          {/* Subtle bottom accent */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-magic-gold/40 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Countdown overlay */}
      <Countdown count={countdown} />

      {/* Verdict display */}
      <VerdictDisplay
        verdict={verdict}
        timestamps={timestamps}
        analysis={analysisText}
        onRetry={handleRetry}
      />

      {/* Custom magic alert */}
      <MagicAlert
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        onConfirm={alert.onConfirm || handleAlertConfirm}
      />
    </div>
  );
}
