import { createContext } from "react";
import { InfiniteScrollDataType } from "../types";

const defaultInfiniteScrollData: InfiniteScrollDataType = {
  list: [],
  total: 0,
  loading: false,
};

const InfiniteScrollDataContext = createContext(defaultInfiniteScrollData);

export default InfiniteScrollDataContext;
