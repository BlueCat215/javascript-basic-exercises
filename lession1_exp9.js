const students = [
  { name: "Anh", score: 8.5, pass: true },
  { name: "Bắc", score: 4.0, pass: false },
  { name: "Chi", score: 9.2, pass: true },
  { name: "Dũng", score: 5.5, pass: true },
  { name: "Nam", score: 3.0, pass: false },
];

const names = students.map((s) => s.name.toUpperCase());
console.log(names);

const passed = students.filter((s) => s.pass === true);
console.log(passed);

const avgScore =
  students.reduce((sum, s) => sum + s.score, 0) / students.length;
console.log(avgScore);

const topStudent = students.find((s) => s.score > 9);
console.log(topStudent);

const hasFail = students.some((s) => s.score < 4);
console.log(hasFail);

const allPassed = students.every((s) => s.pass);
console.log(allPassed);

const sumPassedScores = students
  .filter((s) => s.pass)
  .map((s) => s.score)
  .reduce((a, b) => a + b, 0);
console.log(sumPassedScores);

const groupStudent = students.reduce(
  (acc, s) => {
    s.pass ? acc.pass.push(s) : acc.fail.push(s);
    return acc;
  },
  {
    pass: [],
    fail: [],
  },
);

console.log(groupStudent);
