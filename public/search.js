const initArr = [
  [0, 0, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 1, 0],
];

let num = 0;

const search = (x, y) => {
  let top = 0,
    left = 0,
    bottom = 0,
    right = 0,
    num2 = 0;

  if (initArr[y][x]) {
    initArr[y][x] = 0;

    if (
      x >= 0 &&
      x <= initArr[y].length - 1 &&
      y >= 0 &&
      y <= initArr.length - 1
    ) {
      if (x !== 0) {
        left = search(x - 1, y);
      }
      if (y !== 0) {
        top = search(x, y - 1);
      }
      if (y !== initArr.length - 1) {
        bottom = search(x, y + 1);
      }
      if (x !== initArr[y].length - 1) {
        right = search(x + 1, y);
      }

      if ([top, bottom, right, left].every((x) => !x)) {
        return num2 + 1;
      }
      return num2 + 1;
    }
  }
  return 0;
};

const searchLand = () => {
  initArr.map((item, y) => {
    item.map((key, x) => {
      if (key) {
        num += search(x, y);
      }
    });
  });

  console.log({ num });
};

searchLand();
