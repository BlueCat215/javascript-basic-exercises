const orders = [
  {
    id: 1,
    customer: "An",
    total: 250000,
    date: "2026-06-01",
    status: "completed",
  },
  {
    id: 2,
    customer: "Bình",
    total: 120000,
    date: "2026-06-15",
    status: "cancelled",
  },
  {
    id: 3,
    customer: "Chi",
    total: 500000,
    date: "2026-07-02",
    status: "completed",
  },
  {
    id: 4,
    customer: "An",
    total: 75000,
    date: "2026-07-05",
    status: "completed",
  },
];

const dinhDangDate = (date) => {
  const [nam, thang, ngay] = date.split("-");
  return `${ngay}/${thang}/${nam}`;
};

const tongDoanhThu = orders
  .filter((s) => s.status === "completed")
  .reduce((tong, s) => tong + s.total, 0);
console.log("1. Tổng doanh thu:", tongDoanhThu.toLocaleString("vi-VN") + "đ");

const danhsach = orders.map((s) => {
  const dinhDangTien = s.total.toLocaleString("vi-VN") + "đ";
  return `Đơn #${s.id} - ${s.customer} - ${dinhDangTien} - ${dinhDangDate(s.date)}`;
});

console.log("2. Danh sách hiển thị:\n" + danhsach.join("\n"));

const nhomKhacHang = orders.reduce((ds, order) => {
  const key = order.customer;
  if (!ds[key]) {
    ds[key] = [];
  }
  ds[key].push(order);
  return ds;
}, {});

console.log("3. Nhóm theo khách hàng:", nhomKhacHang);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function xuLy(x) {
  await sleep(1000);
  return `Xử lý thành công Đơn #${x.id} của khách hàng ${x.customer}`;
}

async function chuongTrinhXuLy() {
  console.log("\n4. Bắt đầu xử lý đơn hàng tuần tự...");
  const ds = orders.filter((x) => x.status === "completed");
  for (const x of ds) {
    const logs = await xuLy(x);
    console.log(logs);
  }
  console.log("Hoàn thành xử lý toàn bộ đơn hàng.");
}

chuongTrinhXuLy();
