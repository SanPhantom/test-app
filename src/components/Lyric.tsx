import { useMemoizedFn } from "ahooks";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LyricItemType } from "san-lyric/dist/types/components/Lyric";

interface ILyricProps {
  lyrics: LyricItemType[];
  selectedColor?: string;
  color?: string;
  selectBgColor?: string;
  player: HTMLAudioElement;
}

const sports = {
  linear: (t: number, b: number, c: number, d: number) => {
    return (c * t) / d + b;
  },
};

const Lyric = ({
  player,
  lyrics,
  selectedColor = "red",
  color = "black",
  selectBgColor = "transparent",
}: ILyricProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const afterContainerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  const [current, setCurrent] = useState(-1);
  const currentRef = useRef(current);
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

    const currentTime = Math.floor(player.currentTime * 1000);

    const playCurrent = lyricsRef.current.findLastIndex(
      (item) => currentTime >= item.time
    );
    if (rootRef.current && beforeContainerRef.current && containerRef.current) {
      const offsetTop =
        (rootRef.current.children[playCurrent] as HTMLDivElement)?.offsetTop ??
        0;
      const beforeHeight =
        beforeContainerRef.current.getBoundingClientRect().height;
      const beforeOffsetTop = containerRef.current.getBoundingClientRect().top;
      if (!isLock.current) {
        if (playCurrent !== currentRef.current) {
          scrollHeightRef.current = offsetTop - beforeOffsetTop - beforeHeight;
          scrollAnimationRef.current = requestAnimationFrame(scrollLyric);
        }
        // containerRef.current.scrollTop =
        //   offsetTop - beforeOffsetTop - beforeHeight;
      }
    }

    setCurrent(playCurrent);
  }, [player, lyrics, setCurrent, current]);

  useEffect(() => {
    if (lyrics.length) {
      currentRef.current = current;
      lyricsRef.current = lyrics;
    }
  }, [current, lyrics]);

  useEffect(() => {
    if (player) {
      player.onplaying = () => {
        animationRef.current = window.requestAnimationFrame(render);
      };
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player]);

  useEffect(() => {
    containerRef.current?.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (timer) {
        clearTimeout(timer);
      }
      isLock.current = true;
    });
    containerRef.current?.addEventListener("touchend", (e) => {
      e.preventDefault();
      timer = setTimeout(() => {
        isLock.current = false;
      }, 2000);
    });
    containerRef.current?.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      timer = setTimeout(() => {
        isLock.current = false;
      }, 2000);
    });
    return () => {
      containerRef.current?.removeEventListener("touchstart", () => {});
      containerRef.current?.removeEventListener("touchend", () => {});
      containerRef.current?.removeEventListener("touchcancel", () => {});
    };
  }, []);

  return (
    <div
      className="lyric-root-container"
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "auto" }}
    >
      <div ref={beforeContainerRef} style={{ width: "100%", height: "40%" }} />
      <div ref={rootRef}>
        {lyrics.map((item, index) => (
          <div
            className={`lyric ${current === index && "active"}`}
            style={{
              color: current === index ? selectedColor : color,
              backgroundColor: current === index ? selectBgColor : undefined,
              padding: "5px 0",
            }}
            key={item.time}
          >
            <p className="lyric-item">{item.lyric}</p>
            <p className="t-lyric-item">{item.t_lyric}</p>
          </div>
        ))}
      </div>

      <div ref={afterContainerRef} style={{ width: "100%", height: "40%" }} />
    </div>
  );
};

export default Lyric;
