import { atom } from 'jotai/index';
import { useCallback, useEffect, useMemo } from 'react';
import request from '../configs/axios.config';
import { useCookies } from 'react-cookie';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAtom } from 'jotai';
import { pick, pickAll } from 'ramda';

export type PhoneLoginType = {
  phone: string;
  password: string;
};

type UserType = {
  avatarUrl: string;
  userId: string;
  nickname: string;
};

export const accountAtom = atom<UserType | null>(null);

export const useUserService = () => {
  const [, setMusicCookie] = useLocalStorage('music_cookie');

  const phoneLogin = useCallback(async (formData: PhoneLoginType) => {
    const data: Record<string, any> = await request.post(
      '/login/cellphone',
      formData
    );
    if (data.code === 200) {
      console.log(data.cookie.split(';'));
      document.cookie = data.cookie;
      setMusicCookie(data.cookie);
    }
  }, []);

  return useMemo(() => ({ phoneLogin }), [phoneLogin]);
};

const useUser = () => {
  const [cookie] = useLocalStorage('music_cookie');

  const [account, setAccount] = useAtom(accountAtom);

  useEffect(() => {
    (async () => {
      if (cookie) {
        const data: Record<string, any> = await request.post('/user/account');

        setAccount(pickAll(['userId', 'avatarUrl', 'nickname'], data.profile));
      }
    })();
  }, [cookie]);
  return useMemo(
    () => ({
      account,
    }),
    [account]
  );
};

export default useUser;
