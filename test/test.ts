const now = new Date();

const year = now.getFullYear();
const month = (now.getMonth() + 1).toString(); //.padStart(2, "0");
const day = now.getDate().toString(); //.padStart(2, "0");
const hours = now.getHours().toString();
const offsetMs = now.getTimezoneOffset() * 60 * 1000;
const localString = now.toLocaleString("zh-CN", {
  hour12: false,
  timeZone: "Asia/Shanghai",
});

function getCurrentDate(): Date {
  // 获取当前日期偏移
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const localISOTime = new Date(now.getTime() - offsetMs);
  return localISOTime;
}

console.log(now);
console.log(getCurrentDate());
