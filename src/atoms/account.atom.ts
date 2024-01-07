import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import request from '../configs/axios.config';
import { useInterval } from 'ahooks';
import { isEmpty, isNil } from 'ramda';

export const player = new Audio();

export const playlistAtom = atom<any[]>([]);

export const searchAtom = atom('');

export const durationAtom = atom(0);

export const lyricAtom = atom('');

export const transLyricAtom = atom('');

export const isYRCAtom = atom(false);

export const useProgress = (interval?: number) => {
  const duration = useAtomValue(durationAtom);

  const [currentTime, setCurrentTime] = useState(0);

  const [refreshTime, setRefreshTime] = useState(interval ?? 1);

  const clear = useInterval(() => {
    if (player.played.length) {
      const currentTime = player.currentTime * 1000;
      setCurrentTime(currentTime);
    }
  }, refreshTime);

  useEffect(() => {
    player.addEventListener('playing', () => {
      setRefreshTime(interval ?? 1);
    });

    player.addEventListener('pause', () => {
      setRefreshTime(0);
      clear();
    });

    player.addEventListener('ended', () => {
      player.currentTime = 0;
      setCurrentTime(0);
      setRefreshTime(0);
      clear();
    });
  }, [interval]);

  return useMemo(
    () => ({
      currentTime,
      duration,
    }),
    [currentTime, duration]
  );
};

const useMusicPlayer = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const [playlist, setPlaylist] = useAtom(playlistAtom);

  const updateDuration = useSetAtom(durationAtom);

  const [currentPlayId, setCurrentPlayId] = useState('');

  const [isYRC, setIsYRC] = useAtom(isYRCAtom);
  const [lyric, setLyric] = useAtom(lyricAtom);
  const [transLyric, setTransLyric] = useAtom(transLyricAtom);

  const searchMusic = useCallback(async () => {
    const { result } = await request.get<any, any>('/search', {
      params: {
        keywords: search,
      },
    });
    const requestSong = result.songs;
    setPlaylist(requestSong);
  }, [search, setPlaylist]);

  const playMusic = useCallback(async (item: any) => {
    const { data } = await request.get<any, any>('/song/url', {
      params: { id: item.id },
    });
    player.src = data[0].url;
    player.load();
    updateDuration(data[0].time);
    setCurrentPlayId(item.id);
    await player.play();
  }, []);

  useEffect(() => {
    (async () => {
      if (!(isEmpty(currentPlayId) || isNil(currentPlayId))) {
        const lrcData = await request.get<any, any>('/lyric/new', {
          params: {
            id: currentPlayId,
          },
        });
        const is = !(isEmpty(lrcData?.yrc) || isNil(lrcData?.yrc));
        setIsYRC(is);
        setLyric(is ? lrcData.yrc?.lyric ?? '' : lrcData.lrc?.lyric ?? '');
        setTransLyric(
          is ? lrcData.ytlrc?.lyric ?? '' : lrcData?.tlyric?.lyric ?? ''
        );
      }
    })();
  }, [currentPlayId]);

  return useMemo(
    () => ({
      player,
      search,
      playlist,
      currentPlayId,
      setSearch,
      searchMusic,
      playMusic,
      isYRC,
      lyric,
      transLyric,
    }),
    [
      player,
      search,
      playlist,
      currentPlayId,
      setSearch,
      searchMusic,
      playMusic,
      isYRC,
      lyric,
      transLyric,
    ]
  );
};

export default useMusicPlayer;
