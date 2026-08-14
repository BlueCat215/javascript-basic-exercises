const user = {
  id: 1,
  info: {
    username: "an123",
    address: { city: "Hà Nội", district: "Cầu Giấy" },
  },
};
const {
  info: {
    username,
    address: { city, district },
  },
} = user;

console.log(`${username} + ${city} + ${district}`);
