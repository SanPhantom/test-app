import { useCallback, useMemo } from "react";
import { useProgress } from "../../../atoms/account.atom";

const Progress = () => {
  const { currentTime, duration } = useProgress();

  const addZero = useCallback((num: number) => {
    return num < 10 ? `0${num}` : num;
  }, []);

  const current = useMemo(() => {
    const time = Math.ceil(currentTime / 1000);
    const second = time % 60;
    const min = Math.floor(time / 60);
    return `${addZero(min)}:${addZero(second)}`;
  }, [currentTime]);

  const maxTime = useMemo(() => {
    const time = Math.ceil(duration / 1000);
    const second = time % 60;
    const min = Math.floor(time / 60);
    return `${addZero(min)}:${addZero(second)}`;
  }, [duration]);

  const thunkLeft = useMemo(() => {
    const radio = (currentTime / duration) * 100;
    return radio === 0 ? 0 : `${radio}%`;
  }, [currentTime, duration]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 16,
      }}
    >
      <label
        className="progress-text"
        style={{ fontSize: 12, fontWeight: 400 }}
      >
        {current}
      </label>
      <div style={{ position: "relative", flex: 1, display: "flex" }}>
        <progress
          max={duration}
          value={currentTime}
          style={{ flex: 1 }}
        ></progress>
        <div className="progress-thunk" style={{ left: thunkLeft }}></div>
      </div>

      <label
        className="progress-text"
        style={{ fontSize: 12, fontWeight: 400 }}
      >
        {maxTime}
      </label>
    </div>
  );
};

export default Progress;
