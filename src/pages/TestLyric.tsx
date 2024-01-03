import "./test-lyric.css";
import MusicLayoutHeader from '../components/Music/layout/MusicLayoutHeader'
import MusicLayoutSlider from '../components/Music/layout/MusicLayoutSlider'
import SanLyric from '../components/Music/common/SanLyric'

const TestLyric = () => {


  return (
    <div className="layout">
      <MusicLayoutHeader />

      <div className="layout-content">
        <MusicLayoutSlider />

        <div className="layout-container">
         <div className="layout-new-lyric box-shadow">
          <SanLyric />
        </div>
          <div className="box-shadow layout-control"></div>
        </div>


      </div>
    </div>
  );
};

export default TestLyric;
