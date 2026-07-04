/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  主题色                                                             */
/* ------------------------------------------------------------------ */
const C = {
  orange: "#FF6B35",
  green: "#2DCC70",
};

/* ------------------------------------------------------------------ */
/*  背景音乐                                                           */
/* ------------------------------------------------------------------ */
function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.12;
    audio.loop = true;
    audio.muted = true;

    audio
      .play()
      .then(() => {
        setTimeout(() => {
          if (audio) {
            audio.muted = false;
            setIsPlaying(true);
          }
        }, 500);
      })
      .catch(() => {
        const events = ["click", "touchstart", "keydown"];
        const handler = () => {
          if (audio && !isPlaying) {
            audio.muted = false;
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
          events.forEach((e) => document.removeEventListener(e, handler));
        };
        events.forEach((e) =>
          document.addEventListener(e, handler, { once: true }),
        );
      });
    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/Into%20The%20Sun.mp3" preload="auto" />
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[100] flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-lg transition-all duration-300"
        style={{
          borderColor: `${C.orange}60`,
          background: "rgba(255,255,255,0.85)",
          boxShadow: `0 0 20px ${C.orange}30, inset 0 1px 0 rgba(255,255,255,0.5)`,
        }}
        title={isPlaying ? "暂停音乐" : "播放音乐"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" style={{ color: C.orange }} />
        ) : (
          <VolumeX className="h-5 w-5 text-gray-400" />
        )}
      </motion.button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  科技粒子背景                                                       */
/* ------------------------------------------------------------------ */
function TechParticles() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];

    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);

    const N = Math.min(40, Math.floor(innerWidth / 32));
    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 粒子本体
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? C.orange : C.green;
        ctx.globalAlpha = 0.45;
        ctx.fill();

        // 光晕
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        g.addColorStop(
          0,
          i % 2 === 0 ? `rgba(255,107,53,0.18)` : `rgba(45,204,112,0.18)`,
        );
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.globalAlpha = 1;
        ctx.fill();

        // 连线
        for (let j = i + 1; j < pts.length; j++) {
          const o = pts[j];
          const dx = p.x - o.x,
            dy = p.y - o.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            const a = ((1 - d / 130) * 18).toString(16).padStart(2, "0");
            ctx.strokeStyle = `#FF6B35${a}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      removeEventListener("resize", resize);
    };
  }, [reduce]);

  if (reduce) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  主组件                                                              */
/* ------------------------------------------------------------------ */
export function Welcome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  /* ---- 卡片样式：白色底 + 橙/绿边框，确保文字清晰可读 ---- */
  const card = `
    relative overflow-hidden rounded-2xl border-[1.3px]
    bg-white/80 backdrop-blur-md shadow-xl
    transition-all duration-400 hover:shadow-2xl
    hover:-translate-y-0.5
  `;

  return (
    <div className="relative min-h-screen overflow-x-hidden font-['Inter','Noto_Sans_SC',system-ui,sans-serif] antialiased">
      {/* ===== 底层：浅橙色渐变背景 ===== */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            linear-gradient(165deg, #FFF7F2 0%, #FFE8D8 25%, #FFDDBF 50%, #E8FFE8 75%, #F0FFF4 100%)
          `,
        }}
      />

      {/* ===== 中层：网格（橙色微弱） ===== */}
      <div
        className="fixed inset-0 -z-15 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(${C.orange}22 1px, transparent 1px),linear-gradient(90deg,${C.orange}22 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ===== 光晕层 ===== */}
      <>
        {/* 橙色大光晕 - 右上角 */}
        <motion.div
          className="fixed right-0 top-0 -z-15 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,.18) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 绿色副光晕 - 左下角 */}
        <motion.div
          className="fixed left-0 bottom-0 -z-15 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(45,204,112,.14) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 角落装饰线框 */}
        <div className="fixed left-5 top-5 z-0 hidden h-20 w-20 lg:block">
          <div
            className="absolute left-0 top-0 h-full w-[1.5px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${C.orange}, transparent)`,
            }}
          />
          <div
            className="absolute left-0 top-0 h-[1.5px] w-full"
            style={{
              background: `linear-gradient(to right, transparent, ${C.green}, transparent)`,
            }}
          />
        </div>
        <div className="fixed right-5 bottom-5 z-0 hidden h-20 w-20 lg:block">
          <div
            className="absolute right-0 bottom-0 h-full w-[1.5px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${C.green}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 bottom-0 h-[1.5px] w-full"
            style={{
              background: `linear-gradient(to left, transparent, ${C.orange}, transparent)`,
            }}
          />
        </div>

        {/* 水平扫描线 - 橙绿渐变 */}
        <motion.div
          className="fixed inset-x-0 -z-15 h-[1.5px]"
          style={{
            background: `linear-gradient(90deg, transparent 10%, ${C.orange}55 40%, ${C.green}44 60%, transparent 90%)`,
            boxShadow: `0 0 14px ${C.orange}33`,
          }}
          animate={{ y: ["-15vh", "115vh"] }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        />

        <TechParticles />
      </>

      <BackgroundMusic />

      {/* ============================================================ */}
      {/*  内容                                                        */}
      {/* ============================================================ */}
      <main className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        {/* ---------- HERO ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center lg:mb-28"
        >
          {/* 顶部装饰线 */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mb-10 h-[2px] w-24 origin-center"
            style={{
              background: `linear-gradient(90deg, transparent, ${C.orange}, ${C.green}, transparent)`,
              boxShadow: `0 0 14px ${C.orange}44`,
            }}
          />

          {/* 主题 — 完整一行 */}
          <h1
            className="mb-6 text-4xl font-black leading-[1.2] tracking-[0.04em] sm:text-5xl md:text-5xl"
            style={{
              fontFamily: "'Inter','Noto Sans SC',system-ui,sans-serif",
            }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${C.orange} 0%, #E85A20 50%, ${C.green} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              理解 AI，传递价值：做 AI 时代的燧人氏
            </span>
          </h1>

          {/* 副标题 - 灰色小字 */}
          <h2
            className="mb-10 text-lg font-medium tracking-wide sm:text-xl md:text-[2.1rem]"
            style={{ color: "#888" }}
          >
            — 全球 AI 大模型一站式路由与价值分发平台
          </h2>
        </motion.section>

        {/* ---------- 关于我们 ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25 }}
          className={`${card} mb-6`}
          style={{
            borderColor: `${C.orange}25`,
            boxShadow: `0 8px 32px rgba(255,107,53,.08), 0 2px 8px rgba(0,0,0,.04)`,
          }}
        >
          <div className="p-7 sm:p-9">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="h-[2.5px] w-10 rounded-full"
                style={{
                  background: `linear-gradient(90deg,${C.orange},${C.green})`,
                }}
              />
              <h3
                className="text-lg font-black tracking-[0.28em] sm:text-xl" style={{ fontSize: "1.6rem" }}
                style={{ color: C.orange, textTransform: "uppercase" }}
              >
                关于我们
              </h3>
            </div>
            <p
              className="leading-relaxed sm:text-base"
              style={{ color: "#1a1a1a" }}
            >
              我们诞生于创新涌动的大湾区，由来自
              <span className="font-semibold" style={{ color: "#1a1a1a" }}>
                腾讯、字节跳动、美团
              </span>
              等一线科技企业的实战派， 与
              <span className="font-semibold" style={{ color: "#1a1a1a" }}>
                剑桥大学、上海财经大学
              </span>
              等顶尖学府的学术精英共同创立。 依托深厚的产业积淀与前沿的 AI
              认知，我们构建了全栈式的 AI 服务能力。
            </p>
          </div>
        </motion.section>

        {/* ---------- 使命 ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.38 }}
          className={`${card} mb-6`}
          style={{
            borderColor: `${C.green}25`,
            boxShadow: `0 8px 32px rgba(45,204,112,.08), 0 2px 8px rgba(0,0,0,.04)`,
          }}
        >
          <div className="p-7 sm:p-9">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="h-[2.5px] w-10 rounded-full"
                style={{
                  background: `linear-gradient(90deg,${C.green},${C.orange})`,
                }}
              />
              <h3
                className="text-lg font-black tracking-[0.28em] sm:text-xl" style={{ fontSize: "1.6rem" }}
                style={{ color: C.green, textTransform: "uppercase" }}
              >
                使命
              </h3>
            </div>
            <p
              className="leading-relaxed sm:text-base"
              style={{ color: "#1a1a1a" }}
            >
              在 AI 重塑世界的当下，我们致力于成为
              <span className="font-bold" style={{ color: "#1a1a1a" }}>
                全球 AI 价值传递与应用的开拓者
              </span>
              。
              正如上古燧人氏教人取火，我们通过深度的理解与挖掘，向中小企业、超级个体及内容创作者
              <span className="font-bold" style={{ color: "#1a1a1a" }}>
                推荐、鉴别并分发
              </span>
              最可靠的 AI 能力与算力（Token）。
            </p>
          </div>
        </motion.section>

        {/* ---------- 能力覆盖 ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.52 }}
          className={`${card} mb-6`}
          style={{
            borderColor: `${C.orange}20`,
            boxShadow: `0 8px 32px rgba(255,107,53,.07), 0 2px 8px rgba(0,0,0,.03)`,
          }}
        >
          <div className="p-7 sm:p-9">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="h-[2.5px] w-10 rounded-full"
                style={{
                  background: `linear-gradient(90deg,${C.orange},${C.green})`,
                }}
              />
              <h3
                className="text-lg font-black tracking-[0.28em] sm:text-xl" style={{ fontSize: "1.6rem" }}
                style={{ color: C.orange, textTransform: "uppercase" }}
              >
                能力覆盖
              </h3>
            </div>

            <p
              className="mb-6 leading-relaxed sm:text-base"
              style={{ color: "#1a1a1a" }}
            >
              我们已全面覆盖
              <span className="font-semibold" style={{ color: "#1a1a1a" }}>
                文本、对话、语音、图像及多模态
              </span>
              等
              <span className="mx-1 font-black" style={{ color: "#1a1a1a" }}>
                100+
              </span>
              主流大模型，并即将推出自研的路由与推荐引擎。
              在这里，用户无需耗费精力在繁杂的信息中筛选，即可获得最公正、最优化的
              AI 消费路径，一站式完成从资讯、评测到应用的全链路 AI 旅程。
            </p>
          </div>
        </motion.section>

        {/* ---------- 核心价值观 · 分块 ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.68 }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="h-[2.5px] w-10 rounded-full"
              style={{
                background: `linear-gradient(90deg,${C.orange},${C.green})`,
              }}
            />
            <h3
              className="text-lg font-black tracking-[0.28em] sm:text-xl" style={{ fontSize: "1.6rem" }}
              style={{ color: C.orange, textTransform: "uppercase" }}
            >
              核心价值观
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {["信任", "公平", "利他", "向上", "激情"].map((v, idx) => (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.82 + idx * 0.09 }}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  transition: { duration: 0.22 },
                }}
                className={`group relative overflow-hidden rounded-2xl border-[1.3px] bg-white/85 backdrop-blur-sm p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl`}
                style={{
                  borderColor: idx % 2 === 0 ? `${C.orange}30` : `${C.green}30`,
                  boxShadow:
                    idx % 2 === 0
                      ? `0 6px 24px rgba(255,107,53,.1)`
                      : `0 6px 24px rgba(45,204,112,.1)`,
                }}
              >
                {/* hover 底部光条 */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[3px] origin-center"
                  style={{
                    background:
                      idx % 2 === 0
                        ? `linear-gradient(90deg,${C.orange},${C.green})`
                        : `linear-gradient(90deg,${C.green},${C.orange})`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* 顶部装饰点 */}
                <div
                  className="mx-auto mb-3 h-1.5 w-8 rounded-full"
                  style={{
                    background:
                      idx % 2 === 0
                        ? `linear-gradient(90deg,${C.orange},transparent)`
                        : `linear-gradient(90deg,${C.green},transparent)`,
                  }}
                />

                <h4
                  className="text-2xl font-black tracking-wider sm:text-3xl"
                  style={{ color: "#1a1a1a" }}
                >
                  {v}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ---------- FOOTER ---------- */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="pb-8 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(90deg,transparent,${C.orange}40)`,
              }}
            />
            <p
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: "#999" }}
            >
              Powered by{" "}
              <span
                className="font-black"
                style={{
                  background: `linear-gradient(90deg,${C.orange},${C.green})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                燧人氏 API
              </span>
            </p>
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(90deg,${C.green}40,transparent)`,
              }}
            />
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
