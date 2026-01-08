import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div
      className="
        relative max-w-3xl mx-auto rounded-2xl overflow-hidden
        bg-white/5 dark:bg-white/5
        border border-black/10 dark:border-white/10
        backdrop-blur shadow-xl
        hover:scale-[1.01] transition-all
      "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Overlay Controls */}
      <div
        className={`
          absolute inset-x-0 bottom-0
          bg-gradient-to-t from-black/80 to-transparent
          p-4 transition-opacity
          ${isHovering || !isPlaying ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Play / Pause */}
          <button
            onClick={togglePlayPause}
            className="
              w-10 h-10 rounded-lg
              flex items-center justify-center
              bg-emerald-500/90 text-black
              hover:bg-emerald-400 hover:scale-105
              transition-all
            "
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Time */}
          <span className="text-xs text-white/80 w-12">
            {formatTime(currentTime)}
          </span>

          {/* Progress */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="
              flex-1 h-1 rounded-full
              bg-white/20
              accent-emerald-400
              cursor-pointer
            "
          />

          <span className="text-xs text-white/80 w-12 text-right">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
