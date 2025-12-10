import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  lessonTitle: string;
  lessonId: string;
  courseId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  seekToTime?: number;
}

const VideoPlayer = ({
  lessonTitle,
  lessonId,
  courseId,
  onProgress,
  onComplete,
  onTimeUpdate,
  seekToTime,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Simulate video duration (in reality, this would come from actual video metadata)
  useEffect(() => {
    setDuration(1800); // 30 minutes as example
    
    // Load saved progress
    const savedProgress = localStorage.getItem(`video-${courseId}-${lessonId}`);
    if (savedProgress) {
      setCurrentTime(parseFloat(savedProgress));
    }
  }, [courseId, lessonId]);

  // Save progress periodically and report time updates
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            setIsPlaying(false);
            onComplete?.();
            return duration;
          }
          
          // Save progress
          localStorage.setItem(`video-${courseId}-${lessonId}`, newTime.toString());
          
          // Report progress
          const progress = (newTime / duration) * 100;
          onProgress?.(progress);
          
          // Report current time for notes
          onTimeUpdate?.(newTime);
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration, courseId, lessonId, onProgress, onComplete, onTimeUpdate]);

  // Handle external seek requests
  useEffect(() => {
    if (seekToTime !== undefined && seekToTime !== currentTime) {
      setCurrentTime(seekToTime);
    }
  }, [seekToTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    setCurrentTime(newTime);
    localStorage.setItem(`video-${courseId}-${lessonId}`, newTime.toString());
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(prev + 10, duration));
  };

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(prev - 10, 0));
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          ref={videoRef}
          className="relative bg-black aspect-video group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          {/* Video Placeholder - In real implementation, this would be a <video> element */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center">
              <Play className="h-20 w-20 text-primary-foreground/50 mx-auto mb-4" />
              <p className="text-primary-foreground/70 text-sm">
                {lessonTitle}
              </p>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div
              className={cn(
                "transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
              )}
            >
              {!isPlaying && (
                <div className="bg-primary/90 backdrop-blur-sm rounded-full p-6 hover:scale-110 transition-transform">
                  <Play className="h-12 w-12 text-primary-foreground" fill="currentColor" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[progressPercentage]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-primary-foreground/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={changePlaybackSpeed}
                  className="text-primary-foreground hover:bg-primary-foreground/20 text-xs font-semibold min-w-[3rem]"
                >
                  {playbackSpeed}x
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4 bg-card border-t border-border">
          <h3 className="font-semibold text-lg mb-2">{lessonTitle}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress: {Math.round(progressPercentage)}%
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Playback Speed:</span>
              <Badge variant="secondary">{playbackSpeed}x</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;