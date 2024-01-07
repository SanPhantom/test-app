import { time2Timestamp } from './time';
import { splitEvery, tryCatch } from 'ramda';

/**
 * 判断是否跳过歌词数据
 * @param str
 * @returns
 */
export const judgeLyric = (str: string) => {
  if (str.startsWith('[ti:')) {
    return false;
  }
  if (str.startsWith('[ar:')) {
    return false;
  }
  if (str.startsWith('[al:')) {
    return false;
  }
  if (str.startsWith('[by:')) {
    return false;
  }
  return true;
};

/**
 * 生成歌词的数据
 * @param arr 带有时间的歌词字符串数据
 * @param lKey 返回的key
 * @returns 歌词数据
 */
export const getLyricData1 = (arr: Array<string>, lKey: string = 'lyric') => {
  let lData: { [x: string]: { [x: string]: string | number; time: number } } =
    {};
  arr.forEach((item) => {
    if (judgeLyric(item)) {
      let pattern = /\[(.+)](.+)?/;
      let data = item.match(pattern);
      if (data?.[1]) {
        const time = time2Timestamp(data?.[1]);
        lData[time] = {
          time: Number(time),
          [lKey]: data?.[2] ?? '',
        };
      }
    }
  });
  return lData;
};
/**
 * 数组最后一位开始删除
 * @param arr 字符串数组
 * @param num 删除位数
 * @returns 新数组
 */
export const deleteLast = (arr: Array<string>, num: number = 1) => {
  const new_arr = arr.concat();
  for (let i = 0; i < num; i++) {
    new_arr.pop();
  }
  return new_arr;
};

type YRCLyricType = {
  timestamp: number;
  text: string;
  duration: number;
  transText: string;
  children?: {
    timestamp: number;
    text: string;
    duration: number;
    offset: number;
  }[];
};

export const formatYRC = (
  lyric: string,
  transLyric: string = ''
): YRCLyricType[] => {
  const lyricArray = lyric.split('\n');
  const transLyricArray = transLyric.split('\n');
  lyricArray.splice(-1, 1);
  transLyricArray.splice(-1, 1);
  const lyricPattern = /\[(\d+),(\d+)]/;
  const transLyricPattern = /(\d+):(\d+)\.(\d+)]+(.*)/;
  console.log({ transLyricArray });
  const transTextArray = transLyricArray.map((item) => {
    const [_, m, s, d, text] = item.match(transLyricPattern)!;

    return {
      timestamp: (Number(m) * 60 + Number(s)) * 1000 + Number(d),
      text,
    };
  });
  return lyricArray.map((item) => {
    try {
      const [_, timestamp, duration] = item.match(lyricPattern)!;
      const text = item.replace(lyricPattern, '');
      const textPattern = /\((\d+),(\d+),(\d+)\)/g;
      const s = text.split(textPattern);
      s.splice(0, 1);
      const children = splitEvery(4, s).map((item) => {
        const [timestamp, duration, offset, text] = item;
        return {
          timestamp: Number(timestamp),
          duration: Number(duration),
          offset: Number(offset),
          text,
        };
      });

      return {
        timestamp: Number(timestamp),
        duration: Number(duration),
        text,
        transText:
          transTextArray.find((x) => x.timestamp === Number(timestamp))?.text ??
          '',
        children,
      };
    } catch {
      const itemObj = JSON.parse(item);
      return {
        timestamp: Number(itemObj.t),
        duration: 0,
        text: itemObj.c.map((i: Record<string, any>) => i.tx).join('') ?? '',
        transText: '',
      };
    }
  });
};
