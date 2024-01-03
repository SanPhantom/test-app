import type { ForwardedRef } from "react";

export type Data = { list: any[]; [key: string]: any };

export type Service<TData extends Data> = (
  currentData?: TData
) => Promise<TData>;

export type InfiniteScrollDataType = {
  loading?: boolean;
  list: any[];
  total: number;
};

export type InfiniteScrollApiType = {
  containerRef: ForwardedRef<HTMLDivElement>;
  request?: Service<Data>;
  reload?: () => void;
};
