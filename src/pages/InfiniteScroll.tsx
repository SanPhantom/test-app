import { useRef } from "react";
import InfiniteScrollProvider from "../components/infiniteScroll/InfiniteScrollProvider";

const InfiniteScrollPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      style={{
        width: "60%",
        height: 500,
        border: "1px solid #000",
        margin: "0 auto",
        overflow: "auto",
        padding: 12,
      }}
    >
      <InfiniteScrollProvider containerRef={containerRef}>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>

        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
        <div>Component</div>
      </InfiniteScrollProvider>
    </div>
  );
};

export default InfiniteScrollPage;
