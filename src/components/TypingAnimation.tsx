
import React, { useState, useEffect } from "react";

// Collection of made-up language snippets related to glass and ruins
const codeSnippets = [
  "ᚾᛁᚢᛆᛦᛁᚬ ᚴᚢᛏᛦᛁᛆᛚ",
  "ᚠᛆᚿᛋ᛬ᛏᛆᛦᛏ᛬ᚠᛁᚴᛆᚱᛋᛁᛆ",
  "ᛋᚴᛆᛚᚮ᛬ᛏᛁᛚᛆᛦᛋᚴᚢᛦ᛬ᚢᛏᛆᛚᚠ",
  "ᛒᛁᛋᛁᛏᛁ᛬ᚠᛆᚿᚴᚢᛦ᛬ᚠᛆᛚᚴ",
  "ᚴᛚᛁᛆᛏᛁ᛬ᚿᛁᛆᛚᛆᚱᚠᛁᚴᛋ",
  "ᛆᛦᛏᛆᚿᛏᛁᛆ᛬ᛒᛁᛚᛆᛋᚴᛁᛦᛋᛏᛁᛆ",
  "ᚢᚿᛁᛋᚴᛁᚢ᛬ᚴᛚᛆᛋᛋ᛬ᛏᛁᛚᚢ",
  "ᛋᛁᚿᛏᚱᛆ᛬ᛏᛁᛦᛁᛆᛚ᛬ᛆᚿᛆᛚᛆᚱᚢ", 
  "ᚴᛁᚠᛆᛚᚾᛁᛦ᛬ᚠᛁᚱᚾᛁᚴᛏᛁ",
  "ᚠᛁᛦᛆᚱᚴᛚᛁᚿ᛬ᚠᛁᚱᛆᛒᛁᛚᛆᛦ",
  "ᚴᛁᛋᛁᛆᛚ᛬ᚢᚴᚴᛁᛋᚴᛁᚱᚾᛆᚱᛆᛚ",
  "ᚠᛁᛦᚴᚢᚾᛦᛆᚱᛋᛁᛆ᛬ᚾᛁᛋᛁᛏᛆ",
  "ᛒᛚᛁᚿᛋᛏᚿᛁᛆᛚ᛬ᚴᚱᚢᚿᚴᛁᛦ",
  "ᚿᛁᚠᛆᚱᚾᛆᛚᚢᚴ᛬ᚴᚱᚢᚠᚠᛁᛚᚾᛁ"
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
        }, 120 + Math.random() * 180); // Irregular typing speed for unsettling effect
      } else {
        // Finished typing current snippet, pause before erasing
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        // Erasing animation
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 50);
      } else {
        // Move to next code snippet
        setCurrentSnippet((currentSnippet + 1) % codeSnippets.length);
        setCharIndex(0);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isTyping, currentSnippet, charIndex]);

  // Create vertical display of text
  const displayText = text.split('').map((char, index) => (
    <div key={index} className="mb-1">{char}</div>
  ));

  return (
    <div className="fixed top-4 left-4 font-mono text-[#A0C1A3] text-lg z-50 flex flex-col writing-tb">
      {displayText}
      <div className="blink-text">▮</div>
    </div>
  );
};

export default TypingAnimation;
