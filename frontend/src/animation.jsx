import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* 🌑 RADIAL BASE */}
      <div className="absolute inset-0 animate-radial" />

      {/* 🌀 CONIC ROTATION */}
      <div className="absolute inset-0 animate-conic opacity-35 mix-blend-screen" />

      {/* ⭐ STARS */}
      {[...Array(120)].map((_, i) => (
        <span
          key={i}
          className="absolute bg-green-400 rounded-full animate-star"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* ☄️ SHOOTING STARS */}
      {[...Array(5)].map((_, i) => (
        <span
          key={`shoot-${i}`}
          className="absolute w-[200px] h-[1px] bg-gradient-to-r from-green-400 to-transparent animate-shoot"
          style={{
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 4}s`,
          }}
        />
      ))}

      {/* ✨ MOUSE GLOW */}
      <div
        className="absolute w-[320px] h-[320px] bg-green-500/15 rounded-full blur-3xl transition-transform duration-300"
        style={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 🌘 VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.95)_100%)]" />

      {/* 🎞 KEYFRAMES */}
      <style>{`
        /* 🌑 RADIAL BACKGROUND */
        .animate-radial {
          background: radial-gradient(
            circle,
            #000000 0%,
            #021b0d 40%,
            #053d1f 100%
          );
          animation: radialShift 25s ease-in-out infinite alternate;
        }

        @keyframes radialShift {
          0% { filter: brightness(0.9); }
          100% { filter: brightness(1.1); }
        }

        /* 🌀 CONIC LAYER */
        .animate-conic {
          background: conic-gradient(
            from 0deg,
            #000000,
            #022b14,
            #0f6b3a,
            #022b14,
            #000000
          );
          animation: conicSpin 50s linear infinite;
        }

        @keyframes conicSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ⭐ STARS */
        @keyframes star {
          0%,100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-6px); }
        }

        .animate-star {
          animation: star 3s infinite ease-in-out;
        }

        /* ☄️ SHOOTING */
        @keyframes shoot {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(-600px,300px); opacity: 0; }
        }

        .animate-shoot {
          animation: shoot 7s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
