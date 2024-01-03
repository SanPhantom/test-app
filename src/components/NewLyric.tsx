import { useAsyncEffect, useCreation, useRequest } from "ahooks";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import request from "../configs/axios.config";
import { deleteLast } from "../utils/lyric";
import { toArray, isString } from "lodash";
import { isEmpty, isNil } from "ramda";
import BaseLyric from "./BaseLyric";

interface INewLyricProps {
  id: string;
  currentTime: number;
  duration: number;
  player: HTMLAudioElement;
}

const getLyricData = async (id: string) => {
  return request.get<any, any>("/lyric/new", {
    params: {
      id,
    },
  });
};

const NewLyric = memo(
  ({ id, currentTime, duration, player }: INewLyricProps) => {
    const [className, setClass] = useState("text");

    const rootRef = useRef<HTMLDivElement>(null);

    const { data: lrcData, runAsync } = useRequest(getLyricData, {
      manual: true,
    });

    const isYRC = useMemo(
      () => !(isEmpty(lrcData?.yrc) || isNil(lrcData?.yrc)),
      [lrcData]
    );

    const lyrics = useCreation(() => {
      const lyricArr = deleteLast((lrcData?.yrc?.lyric ?? "").split("\n"));
      return lyricArr.map((item) => {
        try {
          const toObject = JSON.parse(item);
          return {
            timestamp: toObject.t,
            str: toObject.c.map((d: any) => d.tx).join(""),
          };
          // console.log({
          //   timestamp: toObject.t,
          //   str: toObject.c.map((d: any) => d.tx).join(""),
          // });
        } catch (err) {
          let pattern = /\[(.+)\](.+)?/;
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

          // if (dataArray[1]) {
          //   const pattern1 = /\((.+)\)(.+)?/;
          //   let data1 = dataArray[1].match(pattern1);
          //   dataArray2 = toArray(data1);
          // }
          return { timestamp: dataArray[0].split(",")[0], str: lyric };

          // console.log({ timestamp: dataArray[0].split(",")[0], str: lyric });
        }
      });
    }, [lrcData]);

    useAsyncEffect(async () => {
      if (id !== "") {
        await runAsync(id);
      }
    }, [id]);

    const currentLine = useMemo(() => {
      const x = lyrics.findLastIndex((lyric) => {
        return lyric.timestamp <= currentTime;
      });
      return x;
    }, [currentTime, lyrics]);

    useEffect(() => {
      // console.log({ currentLine });
      if (rootRef.current && currentLine >= 0) {
        const nodes = rootRef.current?.querySelectorAll(
          ".current-lyric"
        ) as NodeListOf<HTMLDivElement>;
        rootRef.current.scrollTo({
          top: nodes[currentLine].offsetTop - nodes[0].offsetTop,
          behavior: "smooth",
        });
      } else if (rootRef.current) {
        rootRef.current.scrollTop = 0;
      }
    }, [currentLine]);

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

    return isYRC ? (
      <div
        className="lyric-container"
        ref={rootRef}
        style={{ paddingTop: 400, paddingBottom: 500 }}
      >
        <div className="text-bg">
          {lyrics.map((item, index) => (
            <div
              className="current-lyric"
              key={item.timestamp}
              style={{ padding: "8px 0" }}
            >
              {isString(item.str) ? (
                <p className="text">{item.str}</p>
              ) : (
                <div>
                  {item.str.map((x: { str: string; timestamp: string }) => (
                    <span
                      key={x.timestamp}
                      data-timestamp={x.timestamp.split(",")[0]}
                      data-delay={x.timestamp.split(",")[1]}
                      className={getClassName(x.timestamp, index)}
                      style={{
                        transition: getWordStyle(x.timestamp, index),
                      }}
                    >
                      {`${x.str}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <BaseLyric
        player={player}
        id={id}
        currentTime={currentTime}
        duration={duration}
      />
    );
  }
);

export default NewLyric;
