import React from "react";
import ReactDOM from "react-dom/client";
import "./base.css";
import "./index.css";
import TestLyric from "./pages/TestLyric";
import "default-passive-events";
import InfiniteScroll from "./pages/InfiniteScroll";
import WaterfallPage from "./pages/WaterfallPage";
import App from "./App";
import NewMasonry from "./pages/NewMasonry";
import JotaiTest from "./pages/JotaiTest";
import IOSClick from "./pages/IOSClick";
import VirtualMasonry from "./pages/VirtualMasonry";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  // <App />
  // <IOSClick />
  <TestLyric />
  //   <CodeInput />
  //   <InfiniteScroll />
  // <WaterfallPage />
  // </React.StrictMode>
  // <InfiniteScroll />
  // <NewMasonry />
  // <JotaiTest />
  // <VirtualMasonry />
);
