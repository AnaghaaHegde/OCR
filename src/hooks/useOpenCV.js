import { useEffect, useState } from "react";

export default function useOpenCV() {
  const [opencvReady, setOpencvReady] = useState(false);

  useEffect(() => {
    if (window.cv && window.cv.Mat) {
      setOpencvReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.cv['onRuntimeInitialized'] = () => setOpencvReady(true);
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return opencvReady;
}
