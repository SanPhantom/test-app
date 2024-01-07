import useMusicPlayer from '../atoms/account.atom';
import { useEffect, useMemo, useRef } from 'react';
import { formatLRC } from '../utils/lyric';
import useCurrentLine from '../hooks/useCurrentLine';

const BaseLyric = () => {
  const { lyric, transLyric } = useMusicPlayer();

  const rootRef = useRef<HTMLDivElement>(null);

  const currentLyrics = useMemo(
    () => formatLRC(lyric, transLyric),
    [lyric, transLyric]
  );

  const currentLine = useCurrentLine(currentLyrics);

  useEffect(() => {
    if (rootRef.current && currentLine >= 0) {
      const nodes = rootRef.current.querySelectorAll(
        '.current-lyric'
      ) as NodeListOf<HTMLDivElement>;

      const currentLineOffsetTop = nodes[currentLine].offsetTop;
      const firstLineOffsetTop = nodes[0].offsetTop;

      rootRef.current.scrollTo({
        top: currentLineOffsetTop - firstLineOffsetTop,
        behavior: 'smooth',
      });
    } else if (rootRef.current) {
      rootRef.current.scrollTop = 0;
    }
  }, [currentLine]);

  return (
    <div className="lyric-container" ref={rootRef}>
      <div className="lyric-list">
        {currentLyrics.map((lyric, index) => (
          <div key={lyric.timestamp} className="current-lyric">
            <div
              className="trans-text"
              style={{
                color:
                  currentLine === index ? 'var(--primary-color)' : undefined,
              }}
            >
              {lyric.text}
            </div>
            <div
              className="trans-text"
              style={{
                fontSize: 14,
                color:
                  currentLine === index ? 'var(--primary-color)' : undefined,
              }}
            >
              {lyric.transText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseLyric;
