import { useState, useRef, useEffect } from "react";
import {
  Pause, Play, Volume2, VolumeX, Maximize2, Minimize2,
  Settings, RotateCw, Clock, Download, Share2, Zap,
  SkipBack, SkipForward, Film, Check, AlertCircle
} from "lucide-react";
import { MdReplay10, MdForward10 } from "react-icons/md";

const Editorial = ({ secureUrl, thumbnailUrl, duration, status, title, description }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlaybackRates, setShowPlaybackRates] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  // Format seconds -> mm:ss
  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Format to hh:mm:ss for longer videos
  const formatTimeLong = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
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

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);

    // If unmuting and volume is 0, set to 50%
    if (isMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Change playback rate
  const changePlaybackRate = (rate) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowPlaybackRates(false);
  };

  // Change video quality
  const changeVideoQuality = (quality) => {
    setVideoQuality(quality);
    setShowSettings(false);
  };

  // Sync current time and buffer progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setBufferProgress((bufferedEnd / duration) * 100);
        }
      }
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case '>':
        case '.':
          e.preventDefault();
          changePlaybackRate(Math.min(playbackRate + 0.25, 2));
          break;
        case '<':
        case ',':
          e.preventDefault();
          changePlaybackRate(Math.max(playbackRate - 0.25, 0.25));
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playbackRate, isFullscreen]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Scrub
  const handleSeek = (e) => {
    const value = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const progressPercent = duration > 0 ? ((currentTime / duration) * 100).toFixed(1) : 0;

  // Download video
  const handleDownload = () => {
    if (secureUrl) {
      const link = document.createElement('a');
      link.href = secureUrl;
      link.download = `editorial-${title || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share video
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Editorial Video',
          text: description || 'Check out this editorial video',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Replay video
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Skip intro (first 30 seconds)
  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 30;
      setCurrentTime(30);
      setShowSkipIntro(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="
        relative rounded-2xl overflow-hidden
        bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10
        border-2 border-emerald-200 dark:border-emerald-700/50
        backdrop-blur-xl shadow-2xl
        transition-all duration-300
      "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Header */}
      <div className="px-6 py-4 border-b border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-600">
                {title || "Editorial Solution"}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-500 truncate max-w-md">
                {description || "Video explanation for the problem"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            {status && (
              <span
                className={`
                  px-3 py-1.5 rounded-full text-xs font-bold
                  ${status === "pending" ? "bg-yellow-500/20 text-yellow-900 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700" : ""}
                  ${status === "approved" ? "bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700" : ""}
                  ${status === "rejected" ? "bg-red-500/20 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-700" : ""}
                `}
              >
                {status.toUpperCase()}
              </span>
            )}

            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
              title="Download video"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
              title="Share video"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative">
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          className="w-full aspect-video bg-black cursor-pointer"
        />

        {/* Loading Overlay */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 text-sm">Loading video...</p>
          </div>
        )}

        {/* Skip Intro Button */}
        {currentTime < 30 && !showSkipIntro && (
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setShowSkipIntro(true)}
              className="px-4 py-2 rounded-lg bg-black/70 text-white text-sm hover:bg-black/90 transition-colors"
            >
              Skip Intro
            </button>
          </div>
        )}

        {showSkipIntro && (
          <div className="absolute top-4 left-4 bg-black/90 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-white text-sm">Skip the first 30 seconds?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSkipIntro}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                Skip
              </button>
              <button
                onClick={() => setShowSkipIntro(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar Buffer */}
        {/* <div className="absolute bottom-20 left-0 right-0 h-1 px-4">
          <div className="relative h-1 w-full bg-emerald-900/20 dark:bg-emerald-600/20 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-900/40 dark:bg-emerald-600/40 rounded-full"
              style={{ width: `${bufferProgress}%` }}
            />
          </div>
        </div> */}

        {/* Play/Pause Overlay */}
        {/* {!isPlaying && videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        )} */}

        {/* Settings Menu */}
        {showSettings && (
          <div className="absolute bottom-24 right-4 bg-black/90 backdrop-blur rounded-xl p-4 min-w-[220px]">
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm block mb-2 font-medium">Playback Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackRate(speed)}
                      className={`px-3 py-2 rounded-lg text-sm ${playbackRate === speed
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-800 text-white"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2 font-medium">Video Quality</label>
                <div className="space-y-1">
                  {['auto', '1080p', '720p', '480p'].map(quality => (
                    <button
                      key={quality}
                      onClick={() => changeVideoQuality(quality)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${videoQuality === quality
                        ? "bg-emerald-600/20 text-emerald-300"
                        : "text-white/80 hover:bg-white/10"
                        }`}
                    >
                      <span>{quality === 'auto' ? 'Auto' : quality}</span>
                      {videoQuality === quality && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2 font-medium">Subtitles</label>
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${showSubtitles
                    ? "bg-emerald-600/20 text-emerald-300"
                    : "text-white/80 hover:bg-white/10"
                    }`}
                >
                  <span>{showSubtitles ? 'On' : 'Off'}</span>
                  {showSubtitles && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Playback Rate Display */}
        {playbackRate !== 1 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-sm font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {playbackRate}x
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={`
            absolute inset-x-0 bottom-0
            bg-gradient-to-t from-black/90 via-black/70 to-transparent
            p-6 transition-all duration-300
            ${isHovering || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-white/80 mb-1">
              <span>{formatTimeLong(currentTime)}</span>
              <span>{formatTimeLong(duration)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="
                  w-full h-2 rounded-full cursor-pointer
                  bg-white/20
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-emerald-500
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-emerald-500
                  [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
                  [&::-moz-range-thumb]:shadow-lg
                "
              />
              <div className="absolute top-0 left-0 h-2 rounded-full bg-emerald-500/50 pointer-events-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between mb-10">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Back 10s */}
              <button
                onClick={() => seekBy(-10)}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                  hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 hover:scale-105
                  transition-all
                "
                aria-label="Back 10 seconds"
              >
                <MdReplay10 size={22} />
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlayPause}
                className="
                  w-12 h-12 rounded-xl
                  flex items-center justify-center
                  bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white
                  hover:from-emerald-700 hover:to-emerald-900 dark:hover:from-emerald-700 dark:hover:to-emerald-800 hover:scale-105
                  transition-all shadow-lg
                "
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Forward 10s */}
              <button
                onClick={() => seekBy(10)}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                  hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 hover:scale-105
                  transition-all
                "
                aria-label="Forward 10 seconds"
              >
                <MdForward10 size={22} />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                    hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50
                    transition-all
                  "
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div className="w-12">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="
                      w-full h-1.5 rounded-full cursor-pointer
                      bg-white/20
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-emerald-500
                      [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
                    "
                  />
                </div>
              </div>

              {/* Current Time */}
              <div className="px-3 rounded-lg bg-emerald-900/30 dark:bg-emerald-600/30">
                <span className="text-[13px] font-medium text-white">
                  {formatTimeLong(currentTime)} / {formatTimeLong(duration)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 ml-3">
              {/* Playback Rate */}
              <div className="relative">
                <button
                  onClick={() => setShowPlaybackRates(!showPlaybackRates)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-900/30 dark:bg-emerald-600/30 text-white hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">{playbackRate}x</span>
                </button>

                {showPlaybackRates && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur rounded-xl p-3 min-w-[120px]">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => changePlaybackRate(speed)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${playbackRate === speed
                          ? "bg-emerald-600 text-white"
                          : "text-white/80 hover:bg-white/10"
                          }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Replay */}
              <button
                onClick={handleReplay}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                  hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 hover:scale-105
                  transition-all
                "
                aria-label="Replay"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                  hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 hover:scale-105
                  transition-all
                "
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-emerald-900/30 dark:bg-emerald-600/30 text-white
                  hover:bg-emerald-900/50 dark:hover:bg-emerald-600/50 hover:scale-105
                  transition-all
                "
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="mt-3 flex items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-4">
              <span>{progressPercent}% watched</span>
              <span>{bufferProgress.toFixed(0)}% buffered</span>
              <span>Speed: {playbackRate}x</span>
              <span>Quality: {videoQuality}</span>
            </div>
            <div className="text-xs">
              <span>Space: Play/Pause • F: Fullscreen • M: Mute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Footer */}
      <div className="px-6 py-4 border-t border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-500">
            <Clock className="w-4 h-4" />
            <span>Duration: {formatTimeLong(duration)}</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-500">
            Editorial Video • Powered by AI Learning
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;