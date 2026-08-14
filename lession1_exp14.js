const fetchWeather = (city) => {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 1500) + 500;

    setTimeout(() => {
      const isError = Math.random() < 0.2;
      if (isError) {
        reject(`Lỗi: Không thể kết nối với trạm thời tiết tại ${city}`);
      } else {
        const mockTemp = Math.floor(Math.random() * 15) + 20;
        let statusStr =
          mockTemp > 30 ? "Nắng to" : mockTemp >= 27 ? "Nắng nhẹ" : "Mát";
        resolve({ city, temp: `${mockTemp}°C`, status: statusStr });
      }
    }, delay);
  });
};

async function duBaoThoiTiet(cities) {
  const startTime = Date.now();
  console.log(`\nĐang lấy dữ liệu thời tiết cho: ${cities.join(", ")}...`);
  const weatherPromises = cities.map((city) => fetchWeather(city));
  const results = await Promise.allSettled(weatherPromises);
  const endTime = Date.now();
  const totalExecutionTime = ((endTime - startTime) / 1000).toFixed(2);
  console.log(
    `\n=== KẾT QUẢ TỔNG HỢP (Hoàn thành sau ${totalExecutionTime} giây) ===`,
  );
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const data = result.value;
      console.log(`[Thành công] ${data.city}: ${data.temp} - ${data.status}`);
    } else {
      console.log(`[Thất bại] ${result.reason}`);
    }
  });
}

const citiesToFetch = [
  "Hà Nội",
  "Bắc Ninh",
  "Hưng Yên",
  "TP. Hồ Chí Minh",
  "Quy Nhơn",
];
duBaoThoiTiet(citiesToFetch);
