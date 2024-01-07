import { useMemo } from 'react';
import { findLastIndex } from 'ramda';
import { useProgress } from '../atoms/account.atom';

const useCurrentLine = (currentLyrics: Record<string, any>[]) => {
  const { currentTime } = useProgress();
  return useMemo(() => {
    return findLastIndex(
      (lyric) => lyric.timestamp <= currentTime,
      currentLyrics
    );
  }, [currentTime, currentLyrics]);
};

export default useCurrentLine;
