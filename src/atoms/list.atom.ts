import {
  Getter,
  PrimitiveAtom,
  Setter,
  atom,
  useAtom,
  useSetAtom,
} from "jotai";
import { ItemType, createNewList } from "../utils/item";
import { splitAtom, useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

const listAtom = atom<ItemType[]>([]);
const splitListAtom = splitAtom(listAtom);

listAtom.onMount = (set) => {
  set(createNewList(10));
};

const useAtomProxy = (): [Getter, Setter] => {
  return useAtomCallback(
    useCallback((get, set) => {
      return [get, set] as [Getter, Setter];
    }, [])
  )();
};

const useListAtom = () => {
  const [listAtoms, dispatch] = useAtom(splitListAtom);
  const [getAtom] = useAtomProxy();

  const updateItem = useCallback((itemId: string, newItem: ItemType) => {
    const index = listAtoms.findIndex((atom) => {
      const currentAtomValue = getAtom(atom);
      return currentAtomValue.id === itemId;
    });
    dispatch({ type: "remove", atom: listAtoms[index] });
    dispatch({
      type: "insert",
      value: newItem,
      before: index >= listAtoms.length - 1 ? undefined : listAtoms[index],
    });
  }, []);

  const deleteItem = useCallback((deleteAtom: PrimitiveAtom<ItemType>) => {
    dispatch({ type: "remove", atom: deleteAtom });
  }, []);

  return {
    list: listAtoms,
    updateItem,
    deleteItem,
  };
};

export default useListAtom;
