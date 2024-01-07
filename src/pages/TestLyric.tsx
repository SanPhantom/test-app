import './test-lyric.css';
import MusicLayoutHeader from '../components/Music/layout/MusicLayoutHeader';
import MusicLayoutSlider from '../components/Music/layout/MusicLayoutSlider';
import SanLyric from '../components/Music/common/SanLyric';
import {
  IoPauseCircleOutline,
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from 'react-icons/io5';
import Progress from '../components/Music/common/Progress';
import useMusicPlayer from '../atoms/account.atom';
import BaseLyric from '../components/BaseLyric';
import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const TestLyric = () => {
  const { isYRC, player } = useMusicPlayer();
  const [cookie] = useLocalStorage('music_cookie');

  useEffect(() => {
    if (cookie) {
      document.cookie = cookie;
    }
  }, [cookie]);

  return (
    <div className="layout">
      <MusicLayoutHeader />

      <div className="layout-content">
        <MusicLayoutSlider />

        <div className="layout-container">
          <div className="layout-new-lyric box-shadow">
            {isYRC ? <SanLyric /> : <BaseLyric />}
          </div>
          <div className="box-shadow layout-control">
            <div style={{ flex: 1 }}>
              <Progress />
            </div>
            <div className="control-box">
              <div className="control-btn">
                <IoPlaySkipBackOutline fontSize={24} fontWeight={600} />
              </div>
              <div
                className="control-btn"
                onClick={() => {
                  player.pause();
                }}
              >
                <IoPauseCircleOutline fontSize={48} fontWeight={600} />
              </div>
              <div className="control-btn">
                <IoPlaySkipForwardOutline fontSize={24} fontWeight={600} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLyric;
