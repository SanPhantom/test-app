import React from 'react'
import useMusicPlayer from '../../../atoms/account.atom'

const MusicLayoutHeader = () => {
  const { search, setSearch, searchMusic } = useMusicPlayer();

  return (
    <div className="layout-header box-shadow">
      <div className="search-box">
        <input
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
        <button
          className="search-button"
          onClick={searchMusic}
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default MusicLayoutHeader