import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import useMusicPlayer, { useProgress } from '../../../atoms/account.atom';
import { findLastIndex } from 'ramda';
import { formatYRC } from '../../../utils/lyric';

const SanLyric = () => {
  const { lyric, transLyric } = useMusicPlayer();
  const { currentTime } = useProgress();

  const rootRef = useRef<HTMLDivElement>(null);

  const currentLyrics = useMemo(
    () => formatYRC(lyric, transLyric),
    [lyric, transLyric]
  );

  const currentLine = useMemo(() => {
    return findLastIndex(
      (lyric) => lyric.timestamp <= currentTime,
      currentLyrics
    );
  }, [currentTime, currentLyrics]);

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

  const getClassName = useCallback(
    (
      children: {
        timestamp: number;
        text: string;
        duration: number;
        offset: number;
      },
      index: number
    ) => {
      if (index === currentLine && currentTime > children.timestamp) {
        return 'text load';
      }
      return 'text';
    },
    [currentTime, currentLine]
  );

  const getWordStyle = useCallback(
    (
      children: {
        timestamp: number;
        text: string;
        duration: number;
        offset: number;
      },
      index: number
    ) => {
      const duration = children.duration / 1000;

      if (index === currentLine && currentTime > children.timestamp) {
        return `background-size ${duration}s linear`;
      }
      return undefined;
    },
    [currentTime, currentLine]
  );

  return (
    <div className="lyric-container" ref={rootRef}>
      <div className="lyric-list">
        {currentLyrics.map((item, index) => (
          <div className="current-lyric" key={item.timestamp}>
            {item.children ? (
              <div>
                <div>
                  {item.children.map((children) => (
                    <span
                      key={children.timestamp}
                      data-timestamp={children.timestamp}
                      data-delay={children.duration}
                      className={getClassName(children, index)}
                      style={{
                        transition: getWordStyle(children, index),
                      }}
                    >
                      {children.text}
                    </span>
                  ))}
                </div>
                <div>
                  <span
                    className="trans-text"
                    style={{
                      fontSize: 14,
                      color:
                        currentLine === index
                          ? 'var(--primary-color)'
                          : undefined,
                    }}
                  >
                    {item.transText}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="trans-text"
                style={{
                  color:
                    currentLine === index ? 'var(--primary-color)' : undefined,
                }}
              >
                {item.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SanLyric;
