import "./test-lyric.css";
import { useCreation, useInterval, useMemoizedFn, useSetState } from "ahooks";
import request from "../configs/axios.config";
import NewLyric from "../components/NewLyric";

const TestLyric = () => {
  const [state, setState] = useSetState({
    search: "",
    result: [] as any[],
    player: new Audio(),
    currentTime: 0,
    duration: 0,
    interval: 1,
    playId: "",
  });

  const searchMusic = useMemoizedFn(async () => {
    const { result } = await request.get<any, any>("/search", {
      params: {
        keywords: state.search,
      },
    });
    const requestSong = result.songs;
    setState({
      result: requestSong,
    });
  });

  const playMusic = useMemoizedFn(async (item: any) => {
    const { data } = await request.get<any, any>("/song/url", {
      params: { id: item.id },
    });
    const url = data[0].url;
    setState({
      currentTime: 0,
      interval: 1,
      playId: item.id,
    });
    state.player.src = url;
    state.player.load();
    state.player.play();
  });

  const clear = useInterval(() => {
    if (state.player.played.length) {
      const currentTime = state.player.currentTime * 1000;
      const duration = state.player.duration * 1000;
      setState({
        currentTime,
        duration,
      });
    }
  }, state.interval);

  useCreation(() => {
    state.player.addEventListener("pause", () => {
      console.log("clear interval");
      setState({ interval: 0 });
      clear();
    });

    state.player.addEventListener("ended", () => {
      state.player.currentTime = 0;
      console.log("clear interval");
      setState({ interval: 0, currentTime: 0 });
      clear();
    });
  }, []);

  return (
    <div className="layout">
      <div className="layout-header box-shadow">
        <div className="search-box">
          <input
            className="search-input"
            value={state.search}
            onChange={(e) =>
              setState({
                search: e.target.value,
              })
            }
          />
          <button className="search-button" onClick={searchMusic}>
            Search
          </button>
        </div>
      </div>

      <div className="layout-content">
        <div className="layout-base-result box-shadow">
          <div className="result-list">
            {state.result.map((item) => {
              return (
                <div
                  key={item.id}
                  className="layout-result-item"
                  onClick={() => playMusic(item)}
                >
                  <div className="result-name">{item?.name}</div>
                  <div className="result-singer" style={{ color: "#808e9b" }}>
                    {(item?.artists ?? []).map((d: any) => d.name).join(" / ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="layout-new-lyric box-shadow">
          <NewLyric
            id={state.playId}
            currentTime={state.currentTime}
            duration={state.duration}
            player={state.player}
          />
        </div>
      </div>
    </div>
  );
};

export default TestLyric;
