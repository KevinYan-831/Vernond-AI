import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'zh';

/**
 * All available translation keys in the application.
 */
const translations = {
  en: {
    // Header
    'app.title': 'Vernond AI',
    'app.tagline': 'Can you fool the artificial eye?',

    // Instructions
    'instructions.idle': 'Position yourself in frame and perform your best close-up magic trick. Let the AI be your judge...',
    'instructions.recording': 'Recording in progress. Perform your magic trick now!',
    'instructions.uploading': 'Preparing your performance for analysis...',
    'instructions.analyzing': 'The AI is studying your every move...',

    // Controls
    'controls.start': 'Start Recording',
    'controls.stop': 'Stop Recording',
    'controls.uploading': 'Uploading...',

    // Camera
    'camera.error.permission': 'Camera permission denied. Please allow camera access and refresh the page.',
    'camera.error.notfound': 'No camera found. Please connect a camera and try again.',
    'camera.error.unknown': 'Unable to access camera. Please check permissions and try again.',
    'camera.tryagain': 'Try Again',

    // Analysis
    'analysis.uploading': 'Uploading video...',
    'analysis.analyzing': 'Analyzing your performance...',

    // Verdict
    'verdict.caught': 'CAUGHT',
    'verdict.fooled': 'FOOLED',
    'verdict.caught.subtitle': 'AI detected your method',
    'verdict.fooled.subtitle': 'You fooled the AI!',
    'verdict.timestamps': 'Detected at:',
    'verdict.analysis': 'Analysis:',
    'verdict.tryagain': 'Try Again',
    'verdict.share': 'Share Result',
    'verdict.badge': 'MASTER ILLUSIONIST',

    // Thumb Trick Specific
    'thumbtrick.title': 'Thumb Trick Analysis',
    'thumbtrick.description': 'Practice the classic thumb trick and see if you can fool the AI!',

    // Social CTA
    'social.follow': 'Follow Us',
    'social.discord': 'Join our Discord',
    'social.instagram': 'Follow us on Instagram',

    // Footer
    'footer.copyright': '© 2025 Vernond AI • Close-up Magic Intelligence',
  },
  zh: {
    // Header
    'app.title': '大暴龙 AI',
    'app.tagline': '你的魔术，真的能骗过 AI 吗？',

    // Instructions
    'instructions.idle': '上传或录制你的魔术表演视频，看看 AI 是否能够成功破解其中的秘密。',
    'instructions.recording': '正在录制中，请表演你的魔术！',
    'instructions.uploading': '正在准备分析你的表演...',
    'instructions.analyzing': 'AI 正在破解你的魔术...',

    // Controls
    'controls.start': '开始录制',
    'controls.stop': '停止录制',
    'controls.uploading': '上传中...',

    // Camera
    'camera.error.permission': '摄像头权限被拒绝。请允许访问摄像头并刷新页面。',
    'camera.error.notfound': '未找到摄像头。请连接摄像头后重试。',
    'camera.error.unknown': '无法访问摄像头。请检查权限后重试。',
    'camera.tryagain': '重试',

    // Analysis
    'analysis.uploading': '正在上传视频...',
    'analysis.analyzing': '正在分析你的表演...',

    // Verdict
    'verdict.caught': '被识破了',
    'verdict.fooled': '成功骗过 AI',
    'verdict.caught.subtitle': 'AI 看穿了你的魔术',
    'verdict.fooled.subtitle': '你成功骗过了 AI！',
    'verdict.timestamps': '识破时间点：',
    'verdict.analysis': '分析结果：',
    'verdict.tryagain': '再试一次',
    'verdict.share': '分享结果',
    'verdict.badge': '魔术大师',

    // Thumb Trick Specific
    'thumbtrick.title': '大拇指技巧分析',
    'thumbtrick.description': '练习经典的大拇指技巧，看看你能否骗过 AI！',

    // Social CTA
    'social.follow': '关注我们',
    'social.discord': '加入 Discord',
    'social.instagram': '关注 Instagram',

    // Footer
    'footer.copyright': '© 2025 大暴龙 AI • 近景魔术智能分析',
  },
} as const;

/** Type representing all valid translation keys */
export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
