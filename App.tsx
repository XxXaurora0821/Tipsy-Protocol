import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, CocktailRecommendation, Locale } from './types';
import { QUESTIONS_BY_LOCALE } from './constants';
import { getCocktailRecommendation, getUnknownErrorLabel } from './claudeService';
import { Layout } from './components/Layout';

const UI_TEXT: Record<
  Locale,
  {
    title: string;
    subtitleLine1: string;
    subtitleLine2: string;
    startButton: string;
    progress: string;
    loadingTitle: string;
    loadingSubtitle: string;
    reportTitle: string;
    reveal: string;
    classicRecipe: string;
    origin: string;
    sealed: string;
    flavorNotes: string;
    customRecipe: string;
    garnish: string;
    reset: string;
    alertPrefix: string;
    barAlt: string;
    finalReport: string;
  }
> = {
  en: {
    title: 'Soul Spirits',
    subtitleLine1: 'In this quiet corner, let the algorithm become your bartender,',
    subtitleLine2: 'and mix a glass of liquid self-portrait for you.',
    startButton: 'Start Deep Test',
    progress: 'Progress',
    loadingTitle: 'Blending your spirit dimensions...',
    loadingSubtitle: 'Calculating the balance across 10 dimensions',
    reportTitle: 'Soul Portrait',
    reveal: 'Tap to reveal',
    classicRecipe: 'Recipe Notes',
    origin: 'Origin',
    sealed: 'Sealed',
    flavorNotes: 'Flavor notes',
    customRecipe: 'Alchemy List',
    garnish: 'Garnish',
    reset: '/ RESET JOURNEY /',
    alertPrefix: 'The bartender got lost in the back room: ',
    barAlt: 'Bar',
    finalReport: 'Final Spirit Report'
  },
  zh: {
    title: '灵魂特调',
    subtitleLine1: '在这个宁静的角落，让算法化身为调酒师，',
    subtitleLine2: '为你调配一杯名为“自我”的液体艺术。',
    startButton: '开启深度测试',
    progress: '探索度',
    loadingTitle: '正在融合你的精神维度...',
    loadingSubtitle: '正在计算 10 个维度的平衡比例',
    reportTitle: '灵魂画像',
    reveal: '点击揭秘',
    classicRecipe: '配方秘籍',
    origin: '起源',
    sealed: '封存中',
    flavorNotes: '风味笔记',
    customRecipe: '炼金清单',
    garnish: '装饰',
    reset: '/ RESET JOURNEY /',
    alertPrefix: '调酒师在密室迷路了：',
    barAlt: '酒吧',
    finalReport: '灵魂档案'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Locale>('en');
  const [step, setStep] = useState<AppState>(AppState.WELCOME);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<CocktailRecommendation | null>(null);
  const [revealedType, setRevealedType] = useState<'classic' | 'custom' | null>(null);

  const ui = UI_TEXT[lang];
  const questions = QUESTIONS_BY_LOCALE[lang];

  const resetToWelcome = () => {
    setStep(AppState.WELCOME);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setRecommendation(null);
    setRevealedType(null);
  };

  const switchLanguage = (nextLang: Locale) => {
    if (nextLang === lang) return;
    setLang(nextLang);
    resetToWelcome();
  };

  const handleStart = () => {
    setStep(AppState.QUIZ);
    setCurrentQuestionIdx(0);
    setAnswers({});
  };

  const handleAnswer = async (questionId: string, trait: string) => {
    const newAnswers = { ...answers, [questionId]: trait };
    setAnswers(newAnswers);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      return;
    }

    setStep(AppState.LOADING);
    try {
      const result = await getCocktailRecommendation(newAnswers, lang);
      setRecommendation(result);
      setStep(AppState.RESULT);
    } catch (error) {
      console.error('Mixology error:', error);
      const message = error instanceof Error ? error.message : getUnknownErrorLabel(lang);
      alert(`${ui.alertPrefix}${message}`);
      resetToWelcome();
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4 } }
  };

  return (
    <Layout>
      <div className="fixed top-6 right-6 z-30 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
        <button
          onClick={() => switchLanguage('en')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition ${
            lang === 'en' ? 'bg-emerald-400 text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLanguage('zh')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition ${
            lang === 'zh' ? 'bg-emerald-400 text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          中文
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === AppState.WELCOME && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center"
          >
            <div className="mb-10 relative inline-block group">
              <div className="absolute -inset-8 bg-amber-500/20 blur-[60px] rounded-full group-hover:bg-rose-500/30 transition-all duration-1000"></div>
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600"
                alt={ui.barAlt}
                className="w-56 h-56 object-cover rounded-full border border-white/10 shadow-2xl relative z-10 brightness-75 hover:brightness-100 transition-all duration-700"
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter gradient-text">{ui.title}</h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-16 font-light leading-relaxed">
              {ui.subtitleLine1}
              <br />
              {ui.subtitleLine2}
            </p>
            <button
              onClick={handleStart}
              className="group relative px-12 py-5 overflow-hidden rounded-full bg-white/5 border border-white/20 transition-all hover:border-amber-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-sm tracking-[0.4em] text-amber-200 font-bold uppercase">{ui.startButton}</span>
            </button>
          </motion.div>
        )}

        {step === AppState.QUIZ && (
          <motion.div
            key="quiz"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <div className="mb-16">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] text-amber-500 tracking-[0.5em] font-black uppercase">
                  {ui.progress} {currentQuestionIdx + 1} / {questions.length}
                </span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight leading-tight">
              {questions[currentQuestionIdx].text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestionIdx].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(questions[currentQuestionIdx].id, opt.trait)}
                  className="glass-card text-left p-6 md:p-8 rounded-2xl hover:bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-lg md:text-xl text-gray-400 group-hover:text-white transition-colors">{opt.label}</span>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-amber-500 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === AppState.LOADING && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute inset-0 border-t-2 border-amber-500 rounded-full"
              ></motion.div>
              <div className="absolute inset-4 border border-rose-500/10 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-light tracking-[0.5em] gradient-text animate-pulse">{ui.loadingTitle}</h2>
            <p className="mt-4 text-gray-600 text-sm italic font-light">{ui.loadingSubtitle}</p>
          </motion.div>
        )}

        {step === AppState.RESULT && recommendation && (
          <motion.div
            key="result"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full space-y-16 pb-20"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] text-amber-500 tracking-[0.8em] font-black uppercase">{ui.finalReport}</span>
              <h2 className="text-4xl md:text-6xl font-bold gradient-text">{ui.reportTitle}</h2>
              <p className="text-gray-400 max-w-xl mx-auto italic leading-relaxed text-sm">"{recommendation.rationale}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                onClick={() => setRevealedType(revealedType === 'classic' ? null : 'classic')}
                className={`glass-card rounded-3xl p-1 transition-all duration-700 cursor-pointer overflow-hidden relative ${
                  revealedType === 'classic' ? 'ring-2 ring-amber-500/30' : 'hover:scale-[1.01]'
                }`}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] text-amber-500 font-bold tracking-widest border border-amber-500/30 px-2 py-1 rounded">CLASSIC</span>
                    {!revealedType && <div className="text-[10px] text-gray-500 animate-pulse">{ui.reveal}</div>}
                  </div>
                  <h3 className="text-4xl font-bold mb-4">{recommendation.classic.name}</h3>

                  <AnimatePresence>
                    {revealedType === 'classic' ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <p className="text-gray-400 text-sm leading-relaxed">{recommendation.classic.description}</p>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-amber-500/50 tracking-widest uppercase">{ui.classicRecipe}</h4>
                          <ul className="space-y-1">
                            {recommendation.classic.ingredients.map((ing, i) => (
                              <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-500 rounded-full" /> {ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-white/5 text-[10px] text-gray-600">
                          {ui.origin}: {recommendation.classic.origin}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="mt-auto h-32 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                        <span className="text-xs text-gray-600 tracking-widest">{ui.sealed}</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div
                onClick={() => setRevealedType(revealedType === 'custom' ? null : 'custom')}
                className={`glass-card rounded-3xl p-1 transition-all duration-700 cursor-pointer overflow-hidden relative ${
                  revealedType === 'custom' ? 'ring-2 ring-rose-500/30' : 'hover:scale-[1.01]'
                }`}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] text-rose-500 font-bold tracking-widest border border-rose-500/30 px-2 py-1 rounded">SIGNATURE</span>
                    {!revealedType && <div className="text-[10px] text-gray-500 animate-pulse">{ui.reveal}</div>}
                  </div>
                  <h3 className="text-4xl font-bold mb-4">{recommendation.custom.name}</h3>

                  <AnimatePresence>
                    {revealedType === 'custom' ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 italic text-rose-200/80 text-xs">
                          "{ui.flavorNotes}: {recommendation.custom.flavorNotes}"
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-rose-500/50 tracking-widest uppercase">{ui.customRecipe}</h4>
                          <ul className="space-y-1">
                            {recommendation.custom.ingredients.map((ing, i) => (
                              <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-1 h-1 bg-rose-500 rounded-full" /> {ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <div className="text-[10px] text-gray-600">
                            <span className="text-rose-500/50">{ui.garnish}:</span> {recommendation.custom.garnish}
                          </div>
                          <div className="text-xs text-gray-400 leading-relaxed font-light">{recommendation.custom.instructions}</div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="mt-auto h-32 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                        <span className="text-xs text-gray-600 tracking-widest">{ui.sealed}</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="text-center pt-10">
              <button onClick={resetToWelcome} className="text-[10px] text-gray-600 hover:text-amber-500 tracking-[0.5em] uppercase transition-all">
                {ui.reset}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
