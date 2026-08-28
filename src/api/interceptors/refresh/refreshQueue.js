let isRefreshingFlag = false;
let failedQueue = [];

export const isRefreshing = () => isRefreshingFlag;

export const setIsRefreshing = (value) => {
  isRefreshingFlag = value;
};

export const enqueueFailedRequest = () => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

export const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
