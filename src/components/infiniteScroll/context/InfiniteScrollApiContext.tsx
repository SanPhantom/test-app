import { AxiosPromise, AxiosRequestConfig } from "axios";
import { createContext, createRef } from "react";
import type { ForwardedRef } from "react";
import { InfiniteScrollApiType } from "../types";

const defaultRef = createRef<HTMLDivElement>();

const defaultInfiniteScrollValue: InfiniteScrollApiType = {
  containerRef: defaultRef,
};

const InfiniteScrollApiContext = createContext(defaultInfiniteScrollValue);

export default InfiniteScrollApiContext;
