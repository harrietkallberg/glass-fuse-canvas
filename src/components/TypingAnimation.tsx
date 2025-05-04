
import React, { useState, useEffect } from "react";

// Collection of retro code snippets that will be typed out
const codeSnippets = [
  "LOAD DATA: PHASE 1",
  "10 PRINT \"HELLO WORLD\"",
  "20 GOTO 10",
  "RUN PROGRAM >",
  "CALCULATING COEFFICIENTS...",
  "DATA TRANSFER: SECTOR 7",
  "int main() { return 0; }",
  "SYS 64738",
  "POKE 53280,0",
  "LET X = 42",
  "IF TEMP > 500 THEN GOTO 230",
  "[SYSTEM INITIALIZED]",
];

const TypingAnimation: React.FC = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTyping) {
      if (charIndex < codeSnippets[currentSnippet].length) {
        // Typing animation
        timer = setTimeout(() => {
          setText(text + codeSnippets[currentSnippet][charIndex]);
          setCharIndex(charIndex + 1);
        }, 50 + Math.random() * 100); // Random typing speed for realistic effect
      } else {
        // Finished typing current snippet, pause before erasing
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      if (text.length > 0) {
        // Erasing animation
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 30);
      } else {
        // Move to next code snippet
        setCurrentSnippet((currentSnippet + 1) % codeSnippets.length);
        setCharIndex(0);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isTyping, currentSnippet, charIndex]);

  return (
    <div className="fixed top-4 left-4 font-mono text-red-500 text-lg z-50">
      <span>{text}</span>
      <span className="blink-text">█</span>
    </div>
  );
};

export default TypingAnimation;
