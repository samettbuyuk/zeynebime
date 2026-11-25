import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Flower2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ShieldAlert,
  Smile,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface FloatingFlower {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export default function App() {
  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Giant Flower Click Game State
  const [giantFlowerClicks, setGiantFlowerClicks] = useState(0);
  const [isBurst, setIsBurst] = useState(false);

  // Interactive Lily Garden State
  const [bloomedLilies, setBloomedLilies] = useState<number[]>([]);
  const [selectedLilyNote, setSelectedLilyNote] = useState<string | null>(null);

  // Compliment / Love Notes State
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  // Hug counter & floating flower effects
  const [hugCount, setHugCount] = useState(21);
  const [floatingFlowers, setFloatingFlowers] = useState<FloatingFlower[]>([]);

  // Recovery checklist state
  const [tasks, setTasks] = useState([
    { id: 1, text: "İlaçları vaktinde içmek ve dinlenmek", done: true },
    { id: 2, text: "Bol bol ılık su ve ıhlamur tüketmek", done: true },
    { id: 3, text: "Battaniyeye sarılıp keyif yapmak", done: true },
    { id: 4, text: "Sevgiliden kesintisiz öpücük ve moral almak", done: true },
    { id: 5, text: "En kısa zamanda tahtına geri dönmek", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    triggerFlowerEffect();
  };

  const loveNotes = [
    "Sen dünyanın en güçlü ve en güzel kızısın, bu minik nezle sana asla boyun eğdiremez! ✨",
    "Gözlerindeki o parlak ışık benim en büyük enerji kaynağım. Hemen iyileş lütfen! 🤍",
    "En sevdiğin zambaklar senin için günde bin kez açıyor bu bahçede.",
    "Seninle geçen her gün bir mucize, bugün de tez zamanda sağlığına kavuşma günün.",
    "Seni her haliyle çok seven bir sevgilin var, bunu hiç unutma! 🥰",
    "Çorbani içtiniz mi prenses? Doktorun (ben) emir veriyor: Dinlenmek yok yok, sadece uyu ve iyileş."
  ];

  const nextLoveNote = () => {
    setCurrentNoteIndex((prev) => (prev + 1) % loveNotes.length);
    triggerFlowerEffect();
  };

  const lilyNotesData: { [key: number]: string } = {
    1: "Zambak 1: Senin o güzel gülüşün tüm hastalıkları yok etme gücüne sahip. Seni çok özledim Zeynep'im!",
    2: "Zambak 2: Bugün biraz yorgun olsan da yarın çok daha dinç olacaksın. Dualarım seninle.",
    3: "Zambak 3: En sevdiğin çiçekler mis gibi kokuyor, tıpkı senin varlığın gibi odayı güzelleştiriyorlar.",
    4: "Zambak 4: İyileşir iyileşmez ilk işimiz sahilde yürümek veya en sevdiğin tatlıyı yemek! 🌸",
    5: "Zambak 5: Dünyanın en tatlı hastası buradaymış. Seni çok seven ve iyileşmeni sabırsızlıkla bekleyen bir kalbim var.",
    6: "Zambak 6: Unutma ki bu geçici bir misafir, sen ise bu evin kraliçesisin. Tez zamanda şifalar dilerim!"
  };

  // Trigger floating lily flower animation anywhere on click
  const triggerFlowerEffect = (e?: React.MouseEvent) => {
    const clientX = e ? e.clientX : window.innerWidth / 2 + (Math.random() * 200 - 100);
    const clientY = e ? e.clientY : window.innerHeight / 2 + (Math.random() * 100 - 50);

    const newFlowers: FloatingFlower[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: clientX + (Math.random() * 120 - 60),
      y: clientY + (Math.random() * 60 - 30),
      size: Math.floor(Math.random() * 28) + 24,
      rotation: Math.random() * 360,
    }));

    setFloatingFlowers(prev => [...prev, ...newFlowers]);

    setTimeout(() => {
      setFloatingFlowers(prev => prev.filter(f => !newFlowers.some(nf => nf.id === f.id)));
    }, 2000);
  };

  // Giant flower click handler
  const handleGiantFlowerClick = (e: React.MouseEvent) => {
    triggerFlowerEffect(e);
    if (isBurst) return;

    const nextClicks = giantFlowerClicks + 1;
    if (nextClicks >= 5) {
      setIsBurst(true);
      // Trigger massive flower shower
      const massiveFlowers: FloatingFlower[] = Array.from({ length: 25 }).map((_, i) => ({
        id: Date.now() + 1000 + i,
        x: window.innerWidth / 2 + (Math.random() * 400 - 200),
        y: window.innerHeight / 2 + (Math.random() * 300 - 150),
        size: Math.floor(Math.random() * 36) + 28,
        rotation: Math.random() * 360,
      }));
      setFloatingFlowers(prev => [...prev, ...massiveFlowers]);
    } else {
      setGiantFlowerClicks(nextClicks);
    }
  };

  const resetGiantFlower = (e: React.MouseEvent) => {
    triggerFlowerEffect(e);
    setGiantFlowerClicks(0);
    setIsBurst(false);
  };

  const handleLilyClick = (id: number, e: React.MouseEvent) => {
    if (!bloomedLilies.includes(id)) {
      setBloomedLilies([...bloomedLilies, id]);
    }
    setSelectedLilyNote(lilyNotesData[id] || "Senin için açan özel bir zambak çiçeği!");
    triggerFlowerEffect(e);
  };

  const sendHug = (e: React.MouseEvent) => {
    setHugCount(prev => prev + 1);
    triggerFlowerEffect(e);
  };

  // Web Audio API ambient music synthesizer
  const toggleMusic = (e: React.MouseEvent) => {
    triggerFlowerEffect(e);
    if (isPlayingMusic) {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      if (intervalId) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsPlayingMusic(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioCtx(ctx);
        
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        
        const playTone = () => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 4.6);
        };

        playTone();
        const id = window.setInterval(playTone, 2500);
        setIntervalId(id);
        setIsPlayingMusic(true);
      } catch (err) {
        console.error("Audio error", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtx) audioCtx.close();
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 text-slate-800 font-sans selection:bg-pink-200 relative overflow-x-hidden">
      
      {/* Floating Animated Flowers generated on clicks */}
      {floatingFlowers.map(flower => (
        <div
          key={flower.id}
          className="fixed pointer-events-none z-50 animate-floatUpAndFade text-rose-500"
          style={{
            left: `${flower.x}px`,
            top: `${flower.y}px`,
            transform: `rotate(${flower.rotation}deg)`,
          }}
        >
          <Flower2 className="w-8 h-8 fill-pink-200 text-rose-500 animate-spin" style={{ width: `${flower.size}px`, height: `${flower.size}px`, animationDuration: '3s' }} />
        </div>
      ))}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200 shrink-0">
              <Flower2 className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Zeynep İçin Şifa Bahçesi
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500">En güzel zambaklar senin için açıyor 🤍</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all shadow-sm ${
                isPlayingMusic 
                  ? 'bg-rose-500 text-white shadow-rose-200' 
                  : 'bg-pink-100 text-rose-700 hover:bg-pink-200'
              }`}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingMusic ? "Huzur Melodisi Açık" : "Huzur Müziği"}</span>
            </button>

            <button
              onClick={sendHug}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow-md shadow-pink-200 hover:opacity-95 transition-all transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Sarıl ({hugCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-pink-200">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-rose-200 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Özel İyileşme Portalına Hoş Geldin Zeynep'çim</span>
              </div>
              <h2 className="text-2xl sm:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4 leading-tight">
                Geçmiş Olsun Sevgilim, <br />
                <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  En Güzel Zambaklar Senin İçin Açıyor
                </span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-6">
                Bugün biraz kırgın olduğunu biliyorum ama merak etme; bu minik rahatsızlık senin o güçlü ve parlayan enerjini asla söndüremez. Aşağıdaki dev zambak çiçeğine tıklayarak sürprizi başlatabilirsin!
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#giant-flower-section"
                  onClick={(e) => triggerFlowerEffect(e)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-rose-500/30 hover:opacity-95 transition-all inline-flex items-center gap-2"
                >
                  <span>Dev Çiçeğe Git</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <img
            src="/src/assets/images/zambak_hero_banner_1795616213994.jpg"
            alt="Zambak Bahçesi"
            referrerPolicy="no-referrer"
            className="w-full h-[380px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </section>

      {/* Single Page Content Sections */}
      <main className="max-w-7xl mx-auto px-4 space-y-16 pb-20">
        
        {/* NEW FEATURE: ORTADA KOCAMAN BİR ÇİÇEK (Growing & Bursting Giant Flower Game) */}
        <section id="giant-flower-section" className="scroll-mt-24 text-center max-w-2xl mx-auto py-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-200 relative overflow-hidden">
            
            <div className="absolute top-4 right-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-rose-600 border border-pink-200">
                Dokunma Oyunu
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Sihirli Şifa Zambağı</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-8">
              {!isBurst 
                ? "Çiçeğe her tıkladığında büyüyecek ve sonunda senin için patlayacak! (Tıkla: " + giantFlowerClicks + "/5)" 
                : "Sihir tamamlandı!"}
            </p>

            {/* Giant Flower Container */}
            <div className="flex flex-col items-center justify-center my-6 min-h-[220px]">
              {!isBurst ? (
                <button
                  onClick={handleGiantFlowerClick}
                  className="group relative focus:outline-none transform transition-transform duration-300 active:scale-90"
                  style={{
                    transform: `scale(${1 + giantFlowerClicks * 0.12})`,
                  }}
                  title="Tıkla ve Büyüt!"
                >
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-2xl group-hover:bg-pink-500/40 transition-colors animate-pulse"></div>
                  <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 p-1 shadow-2xl shadow-rose-400/50 flex items-center justify-center text-white">
                    <Flower2 className="w-16 h-16 sm:w-24 sm:h-24 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-rose-600 shadow-sm border border-pink-100">
                    Beni Büyüt 🌸 ({giantFlowerClicks}/5)
                  </div>
                </button>
              ) : (
                <div className="animate-fadeIn space-y-6">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-2xl shadow-rose-500/60 animate-bounce">
                    <Heart className="w-20 h-20 fill-white text-white animate-pulse" />
                  </div>
                  <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-50 p-6 rounded-3xl shadow-xl text-white">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                      GEÇMİŞ OLSUN BEBEĞİM 🤍🌸
                    </h2>
                    <p className="text-pink-100 text-sm">
                      Tüm zambaklar senin iyileşmen için açtı! Seni çok seviyorum.
                    </p>
                  </div>
                  <button
                    onClick={resetGiantFlower}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tekrar Oyna / Büyüt</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* SECTION 1: ZAMBAK BAHÇESİ (Interactive Flower Garden) */}
        <section id="garden" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-rose-700 uppercase tracking-wider mb-2 inline-block">
              1. Bölüm
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Zeynep'in Şifa Zambakları 🌸</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Aşağıdaki zambak çiçeklerine tıklayarak her bir yaprağın arkasındaki gizli moral notlarını açığa çıkarabilirsin!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((id) => {
              const isBloomed = bloomedLilies.includes(id);
              return (
                <div
                  key={id}
                  onClick={(e) => handleLilyClick(id, e)}
                  className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                    isBloomed
                      ? 'bg-white border-pink-300 shadow-xl shadow-pink-100 transform -translate-y-1'
                      : 'bg-white/70 hover:bg-white border-pink-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isBloomed ? 'bg-rose-500 text-white' : 'bg-pink-100 text-rose-500'
                    }`}>
                      <Flower2 className={`w-6 h-6 ${isBloomed ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-rose-600 border border-pink-200">
                      Zambak #{id}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 mb-2">
                    {isBloomed ? "Açtı ve Şifa Saçıyor! 🌸" : "Henüz Tıklanmadı"}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {isBloomed 
                      ? lilyNotesData[id] 
                      : "Bu çiçeği açtırmak ve içindeki sürprizi görmek için tıkla."}
                  </p>

                  {isBloomed && (
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-rose-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Okundu & Şifa Alındı</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedLilyNote && (
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-3xl shadow-xl flex items-start gap-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Sevgili Zeynep'e Özel Not:</h4>
                <p className="text-sm text-pink-50 leading-relaxed">{selectedLilyNote}</p>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: DOKTOR REÇETESİ (Prescription & Recovery Tracker) */}
        <section id="prescription" className="scroll-mt-24 max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-rose-700 uppercase tracking-wider mb-2 inline-block">
              2. Bölüm
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Resmi İyileşme Reçetesi 🩺</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Dr. Sevgilin tarafından onaylanan günlük şifa görevleri listesi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-xl font-bold text-slate-800">Tedavi Protokolü</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">Kesinlikle uyulması zorunludur :)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                Acil Şifalar 🤍
              </span>
            </div>

            <div className="space-y-3.5 mb-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={(e) => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border ${
                    task.done
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                      task.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                    }`}>
                      {task.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${task.done ? 'line-through opacity-75' : 'text-slate-800'}`}>
                      {task.text}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {task.done ? "Tamamlandı ✨" : "Yapılacak"}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100">
              <h5 className="font-bold text-rose-800 mb-1.5 flex items-center gap-2 text-sm">
                <Smile className="w-4 h-4 text-rose-600" />
                <span>Doktor Notu:</span>
              </h5>
              <p className="text-xs text-rose-900 leading-relaxed">
                Bu reçetenin yan etkileri arasında aşırı neşe, hızla iyileşme, sevgilisine sarılma isteği ve yüzünde kocaman bir gülümseme oluşması yer alır. Kesinlikle sakıncası yoktur, bolca uygulanmalıdır.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: GÜNÜN GÜLÜMSEME NOTU (Daily Sweet Note Generator) */}
        <section id="notes" className="scroll-mt-24 max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-rose-700 uppercase tracking-wider mb-2 inline-block">
              3. Bölüm
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Moral Deposu 🤍</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Butona bas ve sana özel günün moral notunu çek.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 text-center">
            <div className="bg-gradient-to-tr from-pink-50 to-rose-50 p-6 sm:p-8 rounded-2xl border border-pink-200 mb-6 min-h-[130px] flex items-center justify-center shadow-inner">
              <p className="text-slate-800 font-medium text-sm sm:text-lg leading-relaxed">
                "{loveNotes[currentNoteIndex]}"
              </p>
            </div>

            <button
              onClick={nextLoveNote}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-pink-200 hover:opacity-95 transition-all transform active:scale-95"
            >
              Başka Bir Sevgi Notu Çek 🌸
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-10 border-t border-pink-100 text-center text-xs text-slate-400">
        <p>Zeynep'in İyileşme Portalı · Sonsuz Sevgiyle Hazırlanmıştır 🤍</p>
      </footer>

    </div>
  );
}
