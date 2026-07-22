import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Movie, VideoPlayerState } from '../../../types'

interface VideoPlayerProps {
  movie: Movie
  onClose?: () => void
  onProgress?: (progress: number, duration: number) => void
  onComplete?: () => void
}

export function VideoPlayer({
  movie,
  onClose,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | undefined>()

  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    quality: '1080p',
    subtitle: 'English',
    isFullscreen: false,
    playbackRate: 1,
  })

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const timeout = setTimeout(() => {
      if (playerState.isPlaying) {
        setShowControls(false)
      }
    }, 3000)
    setControlsTimeout(timeout)
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playerState.isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = volume
      setPlayerState((prev) => ({
        ...prev,
        volume,
        isMuted: volume === 0,
      }))
    }
  }

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMuted = !playerState.isMuted
      videoRef.current.muted = newMuted
      setPlayerState((prev) => ({
        ...prev,
        isMuted: newMuted,
        volume: newMuted ? 0 : prev.volume,
      }))
    }
  }

  const handlePlaybackRateChange = (rate: VideoPlayerState['playbackRate']) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlayerState((prev) => ({ ...prev, playbackRate: rate }))
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!playerState.isFullscreen) {
        containerRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setPlayerState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }))
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current
      setPlayerState((prev) => ({ ...prev, currentTime }))
      onProgress?.(currentTime, duration)
    }
  }

  const handleEnded = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }))
    onComplete?.()
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setPlayerState((prev) => ({
        ...prev,
        duration: videoRef.current?.duration || 0,
      }))
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={showControlsTemporarily}
      className="relative w-full h-full bg-surface-primary"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={movie.posterPath}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        {/* Placeholder - in production, use real streaming source */}
        <source src="" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Big Play Button (before playback starts) */}
      <AnimatePresence>
        {!playerState.isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="w-24 h-24 rounded-full bg-brand-gold text-surface-primary flex items-center justify-center shadow-2xl"
            >
              <svg className="w-10 h-10 fill-current ml-1" viewBox="0 0 20 20">
                <polygon points="6,2 18,11 6,20" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-primary via-surface-primary/70 to-transparent p-4 md:p-6"
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={playerState.duration || 0}
                value={playerState.currentTime}
                onChange={(e) => {
                  if (videoRef.current) {
                    const time = parseFloat(e.target.value)
                    videoRef.current.currentTime = time
                    setPlayerState((prev) => ({ ...prev, currentTime: time }))
                  }
                }}
                className="w-full h-1 bg-brand-gold/30 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-brand-gold/20 rounded transition-colors"
                >
                  {playerState.isPlaying ? (
                    <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="6" y="4" width="2" height="12" />
                      <rect x="12" y="4" width="2" height="12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="6,2 18,11 6,20" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={handleToggleMute}
                    className="p-2 hover:bg-brand-gold/20 rounded transition-colors"
                  >
                    {playerState.isMuted || playerState.volume === 0 ? (
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 1.5a1 1 0 00-1.6.78v15.44a1 1 0 001.6.78l5.59-5.59H17a2 2 0 002-2V9a2 2 0 00-2-2h-1.91l-5.59-5.5zM17.71 13.71l1.42-1.42a1 1 0 00-1.42-1.42l-1.42 1.42-1.41-1.42a1 1 0 00-1.42 1.42l1.42 1.42-1.42 1.41a1 1 0 101.42 1.42l1.41-1.41 1.42 1.41a1 1 0 001.42-1.42z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4a1 1 0 00-1.6-.78L3.59 7H2a2 2 0 00-2 2v2a2 2 0 002 2h1.59l3.81 3.78A1 1 0 009 16V4z" />
                        <path d="M15.54 5.14a1 1 0 00-1.42 1.42c1.33 1.33 2.14 3.15 2.14 5.14 0 1.99-.81 3.81-2.14 5.14a1 1 0 001.42 1.42c1.76-1.76 2.86-4.19 2.86-6.56 0-2.37-1.1-4.8-2.86-6.56z" />
                      </svg>
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={playerState.isMuted ? 0 : playerState.volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover:w-20 transition-all h-1 bg-brand-gold/30 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                  />
                </div>

                {/* Time */}
                <span className="text-xs text-brand-cream/70">
                  {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <select
                  value={playerState.playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value) as any)}
                  className="px-2 py-1 text-xs rounded bg-surface-primary border border-brand-gold/30 text-brand-cream hover:border-brand-gold transition-colors"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Quality */}
                <select
                  value={playerState.quality}
                  onChange={(e) =>
                    setPlayerState((prev) => ({
                      ...prev,
                      quality: e.target.value as any,
                    }))
                  }
                  className="px-2 py-1 text-xs rounded bg-surface-primary border border-brand-gold/30 text-brand-cream hover:border-brand-gold transition-colors"
                >
                  <option value="360p">360p</option>
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 hover:bg-brand-gold/20 rounded transition-colors"
                >
                  {playerState.isFullscreen ? (
                    <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm12 2a1 1 0 011.414-1.414L14 5.586V4a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586L15 6.414zM5 14.414l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4a1 1 0 112 0v1.586zm10-2.293a1 1 0 111.414-1.414L15 14.586V13a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm12 2a1 1 0 011.414-1.414L14 5.586V4a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586L15 6.414zM5 14.414l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4a1 1 0 112 0v1.586zm10-2.293a1 1 0 111.414-1.414L15 14.586V13a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293z" />
                    </svg>
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-brand-gold/20 rounded transition-colors ml-2"
                >
                  <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Movie Title Overlay */}
      {!playerState.isPlaying && (
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-brand-cream">
            {movie.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-gold/20 rounded transition-colors"
          >
            <svg className="w-6 h-6 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
