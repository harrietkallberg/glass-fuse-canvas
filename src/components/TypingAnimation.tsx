
import React, { useState, useEffect } from "react";

// Collection of weird, alien-sounding code snippets
const codeSnippets = [
  "ENTITY SCANNING: NEGATIVE",
  "INITIATING DRAAG TELEPATHY SEQUENCE",
  "OM CONSCIOUSNESS TRANSFER: 38%",
  "MORPHING TISSUE ANALYSIS COMPLETE",
  "SYMBIOSIS PROBABILITY: UNSTABLE",
  "PLANET SAVAGE: ATMOSPHERE BREATHABLE",
  "VOID SIGNAL DETECTED FROM SECTOR 7",
  "TERRAIN FLORA: INCOMPATIBLE WITH HUMANOIDS",
  "DRAAG MEDITATION CYCLE: ACTIVE",
  "WARNING: TERR RESISTANCE INCREASING",
  "PSYCHOSPHERE STABILITY: CRITICAL",
  "INITIATING COLLECTIVE DREAMSCAPE",
  "DIMENSIONAL SEPARATION COLLAPSING",
  "COSMIC AWARENESS MATRIX INITIALIZED",
  "function void() { return paradox.initialize(); }",
  "class Om extends DraagConsciousness { }",
  "const psychicMatrix = new Array(dimension.length);",
  "await terr.sleep(4000); // force dreaming state",
  "if (savage.detected && !draag.isAwake()) {",
  "export const VOID_PROTOCOL = Object.freeze({ })",
  "for (let i = 0; i < dimensions.length; i++) {",
  "while (consciousness > threshold) {",
  "try { planet.connect() } catch(void) { }",
  "function telepathy(target) { return mind.link(target); }",
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
        }, 100 + Math.random() * 150); // Slightly irregular typing speed for unsettling effect
      } else {
        // Finished typing current snippet, pause before erasing
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (text.length > 0) {
        // Erasing animation
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 40);
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
    <div className="fixed top-4 left-4 font-mono text-[#5B81B1] text-lg z-50">
      <span>{text}</span>
      <span className="blink-text">█</span>
    </div>
  );
};

export default TypingAnimation;
