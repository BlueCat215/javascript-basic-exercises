const point = [10, 20, 30];
const [x, y, z] = point;
const khoangcach = (x, y) => Math.sqrt(x ** 2 + y ** 2);

console.log(point);
console.log(khoangcach(x, y));