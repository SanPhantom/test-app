import { memo } from "react";
import { useRequest, useAsyncEffect } from "ahooks";
import request from "../configs/axios.config";
import { useLyricData } from "san-lyric";
import "san-lyric/dist/main.css";
import Lyric from "./Lyric";

interface IBaseLyricProps {
  id: string;
  currentTime: number;
  duration: number;
  player: HTMLAudioElement;
}

const getLyricData = async (id: string) => {
  return request.get<any, any>("/lyric", {
    params: {
      id,
    },
  });
};

const BaseLyric = memo(
  ({ id, currentTime, duration, player }: IBaseLyricProps) => {
    const { data, runAsync } = useRequest(getLyricData, {
      manual: true,
    });

    const lyricData = useLyricData(
      data?.lrc.lyric ?? "",
      (data?.tlyric ?? { lyric: "" }).lyric
    );

    useAsyncEffect(async () => {
      if (id !== "") {
        await runAsync(id);
      }
    }, [id]);

    return <Lyric lyrics={lyricData} player={player} />;
  }
);

export default BaseLyric;
