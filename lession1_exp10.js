console.log("   Nguyễn Văn A   ".trim().length);
console.log("JavaScript, HTML, CSS, ReactJS".split(", "));
console.log("student@school.edu.vn".includes("@"));

const phone = "0987654321";
console.log(phone.slice(0, 3), phone.slice(-4));

const text = "Tôi yêu JavaScript, JavaScript rất thú vị";
console.log(text.replace("JavaScript", "ReactJS"));
console.log(text.replaceAll("JavaScript", "ReactJS"));

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
console.log(capitalize("hELLo"));

const renderStudentCard = ({ name, score, major }) =>
  `<div>Sinh viên: ${name} - Ngành: ${major} - Điểm: ${score}</div>`;

const student = {
  name: "An",
  score: 9,
  major: "CNTT",
};

console.log(renderStudentCard(student));

const slugify = (title) =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .join("-");

console.log(slugify("Học Lập Trình JavaScript!"));
