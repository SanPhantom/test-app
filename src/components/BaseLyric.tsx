import { memo } from 'react';
import { useLyricData } from 'san-lyric';
import 'san-lyric/dist/main.css';
import Lyric from './Lyric';
import useMusicPlayer from '../atoms/account.atom';

const BaseLyric = () => {
  const { lyric, transLyric, player } = useMusicPlayer();

  const lyricData = useLyricData(lyric, transLyric);

  return <Lyric lyrics={lyricData} />;
};

export default BaseLyric;
