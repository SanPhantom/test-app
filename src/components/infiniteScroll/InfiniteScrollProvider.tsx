import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { DependencyList, LegacyRef, Ref, RefObject } from "react";
import InfiniteScrollApiContext from "./context/InfiniteScrollApiContext";
import { Data, Service } from "./types";
import { isFunction } from "lodash";

interface InfiniteScrollProps {
  containerRef: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  reloadDeps?: DependencyList;
  request?: Service<Data>;
  params: Data;
  threshold?: number;
}

const InfiniteScrollProvider = (props: InfiniteScrollProps) => {
  const {
    containerRef,
    children,
    reloadDeps = [],
    request,
    params,
    threshold = 20,
  } = props;

  const lockRef = useRef<boolean>(false);

  const loadMore = useCallback(() => {
    if (lockRef.current) return;
    request?.(params);
  }, []);

  const scrollMethod = useCallback(() => {
    const dom = containerRef.current;
    if (dom) {
      const clientHeight = dom.clientHeight;

      const scrollHeight = dom.scrollHeight;
      const scrollTop = dom.scrollTop;

      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        console.log({ clientHeight, scrollTop, scrollHeight });
        loadMore();
      }
    }
    return;
  }, []);

  useEffect(() => {
    console.log(containerRef.current);
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", scrollMethod);
    }
  }, []);

  return (
    <InfiniteScrollApiContext.Provider
      value={{
        containerRef: containerRef,
        request,
      }}
    >
      <div>{children}</div>
    </InfiniteScrollApiContext.Provider>
  );
};
export default InfiniteScrollProvider;
