import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import Webcam from "react-webcam";
import './OcrReader.css';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 360;

export default function OcrReader() {
  const [imageSrc, setImageSrc] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageSrc(URL.createObjectURL(e.target.files[0]));
      setOcrText("");
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setOcrText("");
  };

  const handleOcr = async () => {
    setLoading(true);
    setOcrText("");
    const { data: { text } } = await Tesseract.recognize(
      imageSrc,
      "eng",
      { logger: (m) => console.log(m) }
    );
    setOcrText(text);
    setLoading(false);
  };

  const speakText = () => {
    if ('speechSynthesis' in window && ocrText.trim() !== "") {
      const utterance = new window.SpeechSynthesisUtterance(ocrText);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="ocr-container">
      <div className="ocr-title">📝 OCR Text Reader</div>
      <div className="ocr-desc">Extract text from images and convert to speech</div>

      <div className="ocr-section-title"><span className="icon">📤</span>Upload Image</div>
      <input type="file" accept="image/*" onChange={handleFileChange} className="ocr-btn" />

      <div className="ocr-section-title"><span className="icon">📷</span>Camera Capture</div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        videoConstraints={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      />
      <button onClick={capture} className="ocr-btn" style={{ marginLeft: 10 }}>
        Capture from Camera
      </button>

      {imageSrc && (
        <img
          src={imageSrc}
          alt="To process"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="ocr-image-preview"
        />
      )}

      {imageSrc && (
        <button onClick={handleOcr} disabled={loading} className="ocr-btn">
          {loading ? "Extracting..." : "Extract Text"}
        </button>
      )}

      <div className="ocr-section-title" style={{ marginTop: 24 }}><span className="icon">📄</span>Extracted Text</div>
      <div className="ocr-result">
        {ocrText}
        {ocrText.trim() !== "" && (
          <button onClick={speakText} className="ocr-speak-btn">
            🔊 Speak
          </button>
        )}
      </div>
    </div>
  );
}
