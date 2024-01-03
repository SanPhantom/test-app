import { faker } from "@faker-js/faker";
import request from "../configs/axios.config";

export type ItemType = {
  id: string;
  height: number;
  image: {
    imageUrl: string;
    height: number;
    width: number;
  };
  title: string;
};

export const createNewList = (size: number) => {
  return new Array(size).fill(0).map((d) => {
    const imgHeight = faker.number.int({ min: 50, max: 150 });
    const imgWidth = faker.number.int({ min: 100, max: 120 });
    return {
      id: faker.string.uuid(),
      height: faker.number.int({ min: 70, max: 180 }),
      image: {
        imageUrl: faker.image.url({
          height: imgHeight,
          width: imgWidth,
        }),
        width: imgWidth,
        height: imgHeight,
      },

      title: faker.word.words({ count: { min: 3, max: 5 } }),
    };
  });
};

export const updateListItem = () => {
  const imgHeight = faker.number.int({ min: 50, max: 150 });
  const imgWidth = faker.number.int({ min: 100, max: 120 });
  return {
    height: faker.number.int({ min: 70, max: 180 }),
    image: {
      imageUrl: faker.image.url({
        height: imgHeight,
        width: imgWidth,
      }),
      width: imgWidth,
      height: imgHeight,
    },

    title: faker.word.words({ count: { min: 3, max: 5 } }),
  };
};

export const generateList = async () => {
  return new Promise<ItemType[]>((resolve) => {
    const timer = setTimeout(() => {
      const currentList = createNewList(10);
      // setList((prevList) => [...prevList, ...currentList]);
      resolve(currentList);
      clearTimeout(timer);
    }, 5000);
  });
};

export const delay = async () => {
  return await request.get("/banner");
};
