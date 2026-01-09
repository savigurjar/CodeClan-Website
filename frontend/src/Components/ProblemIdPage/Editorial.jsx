import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { MdReplay10, MdForward10 } from "react-icons/md";

const Editorial = ({ secureUrl, thumbnailUrl, duration, status }) => {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds -> mm:ss
  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Play / Pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Seek ± seconds
  const seekBy = (seconds) => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const newTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      duration
    );

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Sync current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Scrub
  const handleSeek = (e) => {
    const value = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const progressPercent =
    duration > 0 ? ((currentTime / duration) * 100).toFixed(1) : 0;

  return (
    <div
      className="
        relative max-w-3xl mx-auto rounded-2xl overflow-hidden
        bg-black/5 dark:bg-black/5
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

      {/* Status Badge */}
      {status && (
        <span
          className={`
            absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
            ${status === "pending" ? "bg-yellow-400 text-black" : ""}
            ${status === "approved" ? "bg-green-500 text-white" : ""}
            ${status === "rejected" ? "bg-red-500 text-white" : ""}
          `}
        >
          {status.toUpperCase()}
        </span>
      )}

      {/* Controls Overlay */}
      <div
        className={`
          absolute inset-x-0 bottom-0
          bg-gradient-to-t from-black/80 to-transparent
          p-4 transition-opacity
          ${isHovering || !isPlaying ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Back 10s */}
          <button
            onClick={() => seekBy(-10)}
            className="
              w-9 h-9 rounded-lg
              flex items-center justify-center
              bg-white/20 text-white
              hover:bg-white/30 hover:scale-105
              transition-all
            "
            aria-label="Back 10 seconds"
          >
            <MdReplay10 size={20} />
          </button>

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

          {/* Forward 10s */}
          <button
            onClick={() => seekBy(10)}
            className="
              w-9 h-9 rounded-lg
              flex items-center justify-center
              bg-white/20 text-white
              hover:bg-white/30 hover:scale-105
              transition-all
            "
            aria-label="Forward 10 seconds"
          >
            <MdForward10 size={20} />
          </button>

          {/* Current Time */}
          <span className="text-xs text-white/80 w-12">
            {formatTime(currentTime)}
          </span>

          {/* Progress */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="
              flex-1 h-1 rounded-full
              bg-white/20
              accent-emerald-400
              cursor-pointer
            "
          />

          {/* Total Time */}
          <span className="text-xs text-white/80 w-12 text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Progress % */}
        <div className="mt-1 text-xs text-white/70 text-right">
          {progressPercent}% watched
        </div>
      </div>
    </div>
  );
};

export default Editorial;
