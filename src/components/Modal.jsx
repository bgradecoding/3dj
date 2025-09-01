import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, children, stageType }) => {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoUrls = [
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/da5bf03d-006a-4bbf-b2b5-3fbbe5a143c2/0_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/da5bf03d-006a-4bbf-b2b5-3fbbe5a143c2/1_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/da5bf03d-006a-4bbf-b2b5-3fbbe5a143c2/2_video_subtitled.mp4",
  ];

  const stage4VideoUrls = [
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/0_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/1_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/2_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/3_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/4_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/d8bcb1c5-fd0d-488b-b9c3-cc85b0610756/5_video_subtitled.mp4",
  ];

  const stage5VideoUrls = [
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/0_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/1_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/2_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/3_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/4_video_subtitled.mp4",
    "https://pub-812f5cf66efc4c7cbb3d0158299c9d17.r2.dev/output/conference/ec79d571-2815-4266-9a36-9b7a28fcf2c4/5_video_subtitled.mp4",
  ];
  // stageType에 따라 사용할 영상 URL 배열 선택
  const currentVideoUrls =
    stageType === "stage4"
      ? stage4VideoUrls
      : stageType === "stage5"
      ? stage5VideoUrls
      : videoUrls;

  // 디버깅을 위한 로그
  console.log("Modal - isOpen:", isOpen);
  console.log("Modal - stageType:", stageType);
  console.log("Modal - currentVideoUrls:", currentVideoUrls);
  console.log("Modal - currentVideoIndex:", currentVideoIndex);

  // 모달이 처음 열릴 때만 인덱스를 0으로 설정
  useEffect(() => {
    if (isOpen) {
      setCurrentVideoIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      console.log("Video playback starting for index:", currentVideoIndex);
      setIsLoading(true);
      setError(null);

      const currentVideo = videoRef.current;
      
      // 비디오 로딩 완료 후 재생 시작
      const handleCanPlay = () => {
        console.log("Video can play, starting playback");
        setIsLoading(false);
        setIsPlaying(true);

        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playbook started successfully");
            })
            .catch((err) => {
              console.error("Failed to play video:", err);
              if (err.name === "NotAllowedError") {
                setError(
                  "자동 재생이 차단되었습니다. 재생 버튼을 클릭해주세요."
                );
              } else {
                setError("비디오 재생에 실패했습니다.");
              }
            });
        }
      };

      const handleError = (e) => {
        console.error("Video error:", e);
        setError("비디오를 로드할 수 없습니다.");
        setIsLoading(false);
      };

      currentVideo.addEventListener("canplay", handleCanPlay);
      currentVideo.addEventListener("error", handleError);

      return () => {
        currentVideo.removeEventListener("canplay", handleCanPlay);
        currentVideo.removeEventListener("error", handleError);
      };
    } else if (!isOpen) {
      // 모달이 닫힐 때 안전하게 정리
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);

      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        } catch (error) {
          console.log("Video cleanup error (safe to ignore):", error);
        }
      }
    }
  }, [isOpen, currentVideoIndex]);

  const handleVideoEnded = () => {
    console.log("Video ended, moving to next");
    if (currentVideoIndex < currentVideoUrls.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    } else {
      // 마지막 비디오면 처음부터 시작
      setCurrentVideoIndex(0);
    }
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Manual play failed:", err);
        setError("비디오 재생에 실패했습니다.");
      });
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (error) {
        console.log(
          "Video cleanup error during close (safe to ignore):",
          error
        );
      }
    }
    setIsPlaying(false);
    setIsLoading(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>

          <div className="modal-header"></div>

          <div className="video-container">
            {isLoading && (
              <div className="loading-indicator">
                <p>비디오 로딩 중...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleManualPlay}>재생 시도</button>
                  <button
                    onClick={() =>
                      window.open(currentVideoUrls[currentVideoIndex], "_blank")
                    }
                  >
                    새 탭에서 열기
                  </button>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              src={currentVideoUrls[currentVideoIndex]}
              onEnded={handleVideoEnded}
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onLoadedData={() => setIsLoading(false)}
              onError={(e) => {
                console.error("Video element error:", e);
                setError("비디오를 로드할 수 없습니다.");
                setIsLoading(false);
              }}
              onPlay={() => {
                console.log("Video started playing");
                setIsPlaying(true);
              }}
              onPause={() => {
                console.log("Video paused");
                setIsPlaying(false);
              }}
              controls
              className="modal-video"
              preload="auto"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="video-controls">
            <button
              onClick={() => {
                if (currentVideoIndex > 0) {
                  setCurrentVideoIndex((prev) => prev - 1);
                }
              }}
              disabled={currentVideoIndex === 0}
              className="control-btn"
              title="이전 영상"
            >
              ←
            </button>
            <button
              onClick={() => {
                if (currentVideoIndex < currentVideoUrls.length - 1) {
                  setCurrentVideoIndex((prev) => prev + 1);
                }
              }}
              disabled={currentVideoIndex === currentVideoUrls.length - 1}
              className="control-btn"
              title="다음 영상"
            >
              →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;