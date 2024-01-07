import React, { useCallback, useState } from 'react';
import useMusicPlayer from '../../../atoms/account.atom';
import LoginModal from '../LoginModal';
import useUser from '../../../atoms/user.atom';

const MusicLayoutHeader = () => {
  const { search, setSearch, searchMusic } = useMusicPlayer();

  const { account } = useUser();

  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);

  const handleToLogin = useCallback(() => {
    setLoginDrawerOpen((prev) => !prev);
  }, [setLoginDrawerOpen]);

  return (
    <div className="layout-header box-shadow">
      <div className="search-box">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button" onClick={searchMusic}>
          Search
        </button>
      </div>
      <div className="login-container">
        {account ? (
          <div className="account-info">
            <img className="avatar" src={account.avatarUrl} alt="" />
            <span className="nickname">{account.nickname}</span>
          </div>
        ) : (
          <div className="login-btn" onClick={handleToLogin}>
            登录
          </div>
        )}
      </div>
      <LoginModal open={loginDrawerOpen} onClose={handleToLogin} />
    </div>
  );
};

export default MusicLayoutHeader;
