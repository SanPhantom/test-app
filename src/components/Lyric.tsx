import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LyricItemType } from 'san-lyric/dist/types/components/Lyric';
import { findLastIndex } from 'ramda';
import useMusicPlayer from '../atoms/account.atom';

interface ILyricProps {
  lyrics: LyricItemType[];
  selectedColor?: string;
  color?: string;
  selectBgColor?: string;
}

const sports = {
  linear: (t: number, b: number, c: number, d: number) => {
    return (c * t) / d + b;
  },
};

const Lyric = ({
  lyrics,
  selectedColor = 'red',
  color = 'black',
  selectBgColor = 'transparent',
}: ILyricProps) => {
  const { player } = useMusicPlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const afterContainerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [currentLine, setCurrentLine] = useState(-1);

  const animationRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  const currentRef = useRef(-1);
  const lyricsRef = useRef(lyrics);

  const currentScrollHeightRef = useRef<number>(0);
  const scrollHeightRef = useRef<number>(0);
  const isLock = useRef<boolean>(false);
  const startRef = useRef<number>(0);

  let timer: number;

  const scrollLyric = useCallback(() => {
    if (containerRef.current) {
      isLock.current = true;
      startRef.current++;

      const top = sports.linear(
        startRef.current,
        currentScrollHeightRef.current,
        scrollHeightRef.current - currentScrollHeightRef.current,
        10
      );

      containerRef.current.scrollTop = top;
      if (startRef.current <= 10) {
        scrollAnimationRef.current = requestAnimationFrame(scrollLyric);
      } else {
        currentScrollHeightRef.current = top;
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
          scrollHeightRef.current = 0;
          animationRef.current = null;
          startRef.current = 0;
          isLock.current = false;
        }
      }
    }
  }, []);

  const render = useCallback(() => {
    animationRef.current = window.requestAnimationFrame(render);

    const currentLine = findLastIndex(
      (item: { time: number }) => player.currentTime * 1000 >= item.time,
      lyricsRef.current
    );

    if (rootRef.current && beforeContainerRef.current && containerRef.current) {
      const offsetTop =
        (rootRef.current.children[currentLine] as HTMLDivElement)?.offsetTop ??
        0;
      const beforeHeight =
        beforeContainerRef.current.getBoundingClientRect().height;
      const beforeOffsetTop = containerRef.current.getBoundingClientRect().top;
      if (!isLock.current) {
        if (currentLine !== currentRef.current) {
          scrollHeightRef.current = offsetTop - beforeOffsetTop - beforeHeight;
          scrollAnimationRef.current = requestAnimationFrame(scrollLyric);
          currentRef.current = currentLine;
          setCurrentLine(currentLine);
        }
      }
    }
  }, [lyrics]);

  useEffect(() => {
    if (lyrics.length) {
      lyricsRef.current = lyrics;
    }
  }, [lyrics]);

  useEffect(() => {
    if (player) {
      player.addEventListener('playing', () => {
        animationRef.current = window.requestAnimationFrame(render);
      });
    }
    return () => {
      player.removeEventListener('playing', () => {});
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player]);

  useEffect(() => {
    containerRef.current?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (timer) {
        clearTimeout(timer);
      }
      isLock.current = true;
    });
    containerRef.current?.addEventListener('touchend', (e) => {
      e.preventDefault();
      timer = setTimeout(() => {
        isLock.current = false;
      }, 2000);
    });
    containerRef.current?.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      timer = setTimeout(() => {
        isLock.current = false;
      }, 2000);
    });
    return () => {
      containerRef.current?.removeEventListener('touchstart', () => {});
      containerRef.current?.removeEventListener('touchend', () => {});
      containerRef.current?.removeEventListener('touchcancel', () => {});
    };
  }, []);

  return (
    <div
      className="lyric-root-container"
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    >
      <div ref={beforeContainerRef} style={{ width: '100%', height: '40%' }} />
      <div ref={rootRef}>
        {lyrics.map((item, index) => (
          <div
            className={`lyric ${currentLine === index && 'active'}`}
            style={{
              color: currentLine === index ? selectedColor : color,
              backgroundColor:
                currentLine === index ? selectBgColor : undefined,
              padding: '5px 0',
            }}
            key={item.time}
          >
            <p className="lyric-item">{item.lyric}</p>
            <p className="t-lyric-item">{item.t_lyric}</p>
          </div>
        ))}
      </div>

      <div ref={afterContainerRef} style={{ width: '100%', height: '40%' }} />
    </div>
  );
};

export default Lyric;
