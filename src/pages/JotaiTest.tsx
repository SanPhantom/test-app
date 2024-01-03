import { atom, useAtom, type PrimitiveAtom, Provider } from "jotai";
import { splitAtom } from "jotai/utils";
import { faker } from "@faker-js/faker";
import { Button, Stack, Typography } from "@mui/material";

interface JotaiTestProps {}

const defaultList = [
  {
    title: faker.string.sample(),
    id: faker.string.uuid(),
  },
];

export type DefaultItemType = (typeof defaultList)[number];

const paginationAtom = atom({ list: defaultList });

const listAtom = atom(
  (get) => get(paginationAtom).list,
  (get, set, action: { type: "remove" | "insert"; value: DefaultItemType }) => {
    const list = get(paginationAtom).list;
    switch (action.type) {
      case "remove": {
        const index = list.findIndex((item) => item.id === action.value.id);

        if (index !== -1) {
          const updateList = list.splice(index, 1);
          set(paginationAtom, { list: updateList });
        }
        break;
      }
      case "insert": {
        set(paginationAtom, { list: [...list, action.value] });
        break;
      }
    }
  }
);

const listAtomsAtom = splitAtom(listAtom);

const ItemRender = ({
  item,
  remove,
}: {
  item: PrimitiveAtom<DefaultItemType>;
  remove: () => void;
}) => {
  const [itemData, setItemData] = useAtom(item);

  return (
    <Stack
      key={itemData.id}
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        boxShadow: (theme) => theme.shadows[2],
        px: 2,
        py: 1,
      }}
    >
      <Typography sx={{ flexGrow: 1 }}>{itemData.title}</Typography>

      <Button variant="contained" onClick={remove}>
        Remove
      </Button>
    </Stack>
  );
};

const JotaiTest = (props: JotaiTestProps) => {
  const {} = props;

  const [listAtoms, dispatch] = useAtom(listAtomsAtom);

  return (
    <Stack sx={{ p: 2, gap: 1.5 }}>
      {listAtoms.map((itemAtom) => {
        return (
          <ItemRender
            item={itemAtom}
            remove={() => dispatch({ type: "remove", atom: itemAtom })}
          />
        );
      })}

      <Button
        variant="outlined"
        sx={{ textTransform: "unset" }}
        onClick={() =>
          dispatch({
            type: "insert",
            value: {
              title: faker.string.sample(),
              id: faker.string.uuid(),
            },
          })
        }
      >
        Add item
      </Button>
    </Stack>
  );
};

const App = () => {
  return (
    <Provider>
      <JotaiTest />
    </Provider>
  );
};

export default App;
