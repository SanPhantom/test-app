import React from 'react'
import useMusicPlayer from '../../../atoms/account.atom'

const MusicLayoutSlider = () => {
 const {playlist: result, playMusic} = useMusicPlayer();

  return (
    <div className="layout-base-result box-shadow">
      <div className="result-list">
        {result.map((item) => {
          return (
            <div
              key={item.id}
              className="layout-result-item"
              onClick={() => playMusic(item)}
            >
              <div className="result-name">{item?.name}</div>
              <div
                className="result-singer"
                style={{ color: "#808e9b" }}
              >
                {(item?.artists ?? []).map((d: any) => d.name).join(" / ")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default MusicLayoutSlider