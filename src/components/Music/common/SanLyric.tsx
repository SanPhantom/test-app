import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react'
import {
  isString,
  toArray
} from 'lodash'
import useMusicPlayer, { useProgress } from '../../../atoms/account.atom'
import { findLastIndex } from 'ramda'
import { deleteLast } from '../../../utils/lyric'

const SanLyric = () => {
  const { lyric } = useMusicPlayer();
  const { currentTime } = useProgress();

  const rootRef = useRef<HTMLDivElement>(null)

  const lyrics = useMemo(() => {

    const lyricArr = deleteLast(lyric.split("\n"));
    return lyricArr.map((item) => {
      try {
        const toObject = JSON.parse(item);
        return {
          timestamp: toObject.t,
          str: toObject.c.map((d: {tx: string}) => d.tx).join(""),
        };
      } catch (err) {
        let pattern = /\[(.+)](.+)?/;
        let data = item.match(pattern);
        const dataArray = toArray(data).slice(1);

        let dataArray2 = dataArray[1].split("(");

        const lyric = dataArray2.slice(1).map((d) => {
          const x = d.split(")");
          return {
            timestamp: x[0],
            str: x[1],
          };
        });

        return { timestamp: dataArray[0].split(",")[0], str: lyric };

      }
    });
  }, [lyric]);

  const currentLine = useMemo(() => {
    return findLastIndex((lyric) => lyric.timestamp <= currentTime, lyrics);
  }, [currentTime, lyrics])

  useEffect(() => {
    if (rootRef.current && currentLine >= 0) {
      const nodes = rootRef.current.querySelectorAll(".current-lyric") as NodeListOf<HTMLDivElement>;

      const currentLineOffsetTop = nodes[currentLine].offsetTop;
      const firstLineOffsetTop = nodes[0].offsetTop;

      rootRef.current.scrollTo({
        top: currentLineOffsetTop - firstLineOffsetTop,
        behavior: 'smooth'
      })
    } else if (rootRef.current) {
      rootRef.current.scrollTop = 0;
    }

  }, [currentLine])

  const getClassName = useCallback(
    (timestamp: string, index: number) => {
      const startTimestamp = Number(timestamp.split(",")[0]);
      if (index === currentLine && currentTime > startTimestamp) {
        return "text load";
      }
      return "text";
    },
    [currentTime, currentLine]
  );

  const getWordStyle = useCallback(
    (timestamp: string, index: number) => {
      const startTimestamp = Number(timestamp.split(",")[0]);
      const duration = Number(timestamp.split(",")[1]) / 1000;

      if (index === currentLine && currentTime > startTimestamp) {
        return `background-size ${duration}s linear`;
      }
      return undefined;
    },
    [currentTime, currentLine]
  );

  return (
    <div className="lyric-container" ref={rootRef}>
      <div className="lyric-list">
        {lyrics.map((item, index) => (
          <div className="current-lyric" key={item.timestamp}>
            {isString(item.str) ? (
              <div className="text">{item.str}</div>
            ): (
              <div>
                {item.str.map((word: {str: string, timestamp: string}) => (
                  <span
                    key={word.timestamp}
                    data-timestamp={word.timestamp.split(",")[0]}
                    data-delay={word.timestamp.split(",")[1]}
                    className={getClassName(word.timestamp, index)}
                    style={{
                      transition: getWordStyle(word.timestamp, index),
                    }}
                  >
                  {word.str}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SanLyric