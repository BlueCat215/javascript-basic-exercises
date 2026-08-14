class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    const id = setInterval(() => {
      this.seconds++;
      console.log(this.seconds);

      if (this.seconds === 10) {
        clearInterval(id);
        console.log("Đã dừng!");
      }
    }, 1000);
  }
}

const a = new Timer();
a.start();
