// 3.1. Callback cơ bản với setTimeout
const sayHelloLater = (callback) =>
  setTimeout(() => {
    callback();
    console.log("Hello sau 2 giây");
  }, 2000);

sayHelloLater(() => {
  console.log("Đây là callback");
});

// 3.2. Chuyển callback sang Promise
function getUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({
          id,
          name: "User " + id,
        });
      } else {
        reject("ID không hợp lệ");
      }
    }, 1000);
  });
}

getUserPromise(5)
  .then((user) => {
    console.log("Thông tin:", user);
  })
  .catch((error) => {
    console.log("Lỗi:", error);
  });

// 3.3. Async/Await với try/catch
async function showUser(id) {
  try {
    const user = await getUserPromise(id);
    console.log("Thông tin:", user);
  } catch (error) {
    console.log("Lỗi:", error);
  }
}

showUser(10);
showUser(-2);

// 3.4. Promise.all với nhiều nguồn dữ liệu
function fetchUser() {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      resolve("Thông tin User");
    }, delay);
  });
}

function fetchPosts() {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      resolve("Danh sách Posts");
    }, delay);
  });
}

function fetchComments() {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      resolve("Danh sách Comments");
    }, delay);
  });
}

Promise.all([fetchUser(), fetchPosts(), fetchComments()])
  .then((result) => {
    console.log("Kết quả tổng hợp:");
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

// 3.5: Retry logic với async/await
function callApi(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        resolve("Lấy dữ liệu thành công từ " + url);
      } else {
        reject("Lỗi kết nối");
      }
    }, 1000);
  });
}

async function fetchWithRetry(url, retries) {
  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`Đang thử lần ${i + 1}`);
      const data = await callApi(url);
      return data;
    } catch (error) {
      console.log("Thất bại");
      if (i === retries) {
        throw error;
      }
    }
  }
}

(async () => {
  try {
    const data = await fetchWithRetry("/users", 8);
    console.log(data);
  } catch (e) {
    console.log("Lỗi:", e);
  }
})();

// 3.6: Tuần tự vs Song song
function getProductById(id) {
  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      resolve({
        id,
        name: "Product " + id,
      });
    }, delay);
  });
}
const ids = [1, 2, 3, 4, 5];

async function sequential() {
  const start = Date.now();
  const result = [];
  for (const id of ids) {
    const product = await getProductById(id);
    result.push(product);
  }
  const end = Date.now();
  console.log(result);
  console.log("Thời gian:", end - start, "ms");
}

async function parallel() {
  const start = Date.now();
  const result = await Promise.all(ids.map((id) => getProductById(id)));
  const end = Date.now();
  console.log(result);
  console.log("Thời gian:", end - start, "ms");
}

(async () => {
  console.log("=== Sequential ===");
  await sequential();

  console.log("=== Parallel ===");
  await parallel();
})();
