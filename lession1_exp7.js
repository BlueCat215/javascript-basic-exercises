// 2.1: Gộp mảng
console.log(`2.1: gộp mảng`);

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const arr3 = [...arr1, ...arr2];
console.log(arr3);

// 2.2: Gộp object
console.log(`\n2.2: Gộp object`);
const defaultConfig = { theme: "light", fontSize: 14 };
const userConfig = { ...defaultConfig, theme: "dark" };
console.log(userConfig);

// 2.3: Rest operator trong hàm
console.log(`\n2.3: Rest operator trong hàm`);
const sum = (...numbers) => numbers.reduce((tong, so) => tong + so, 0);
console.log(`tong day arr3: ${sum(...arr3)}`);

// 2.4: Kết hợp destructuring + rest trên mảng
console.log(`\n2.4: Kết hợp destructuring + rest trên mảng`);
const scores = [90, 85, 77, 92, 60];
const [first, ...rest] = scores;
console.log(`first: ${first} | rest: ${rest}`);

// 2.5: Gộp nhiều object
console.log(`\n2.5: Gộp nhiều object`);
const obj1 = {
  name: "A",
  age: 20,
};

const obj2 = {
  age: 21,
  city: "Ha Noi",
};

const obj3 = {
  country: "Viet Nam",
};

function mergeObjects(...objects) {
  return objects.reduce(
    (result, obj) => ({
      ...result,
      ...obj,
    }),
    {},
  );
}
console.log(mergeObjects(obj1, obj2, obj3));

// 2.6: làm phẳng mảng lồng nhau
console.log(`\n2.6: làm phẳng mảng lồng nhau`);
const matrix = [
  [1, 2],
  [3, 4],
  [5, 6],
];
function flatValue(matrix) {
  return matrix.reduce((result, value) => [...result, ...value], []);
}

console.log(flatValue(matrix));
