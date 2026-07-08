const now = new Date();
console.log(now.getDate(), now.getMonth(), now.getFullYear());
const myBday = new Date(2005, 12, 5);
console.log(
  `${myBday.getDate()}/${myBday.getMonth() + 1}/${myBday.getFullYear()}`,
);

const formatDate = (date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

const addDays = (date, days) => new Date(date.getTime() + days * 86400000);
const diffInDays = (date1, date2) => Math.abs(date2 - date1) / 86400000;

const enrollDate = new Date(2027, 6, 10);
const gradDate = new Date(enrollDate);
gradDate.setFullYear(gradDate.getFullYear() + 4);
console.log(`Số ngày còn lại: ${diffInDays(new Date(), gradDate)}`);

const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;
console.log(isWeekend(enrollDate));

const countWeekendsInRange = (startDate, endDate) => {
  let count = 0,
    curr = new Date(startDate);
  while (curr <= endDate) {
    if (isWeekend(curr)) count++;
    curr = addDays(curr, 1);
  }
  return count;
};
console.log(countWeekendsInRange(myBday, enrollDate));
