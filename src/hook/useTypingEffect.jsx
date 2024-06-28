import { useState, useEffect, useRef } from 'react';

export const useTypingEffect = (text, delay = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const typeText = () => {
      if (displayedText.length < text.length) {
        setDisplayedText((prevText) => prevText + text[displayedText.length]);
        timerRef.current = setTimeout(typeText, delay);
      } else {
        clearTimeout(timerRef.current);
      }
    };

    if (text) {
      typeText();
    }

    return () => clearTimeout(timerRef.current);
  }, [text, delay]);

  return displayedText;
};
