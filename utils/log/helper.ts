import colors from "yoctocolors";

class Log {
  info(log_message: string) {
    console.log(
      `${colors.bgGreenBright("消息:")} ${colors.white(`${log_message}`)}`
    );
  }

  error(err_message: string) {
    console.log(
      `${colors.bgRedBright("错误:")} ${colors.red(`${err_message}`)}`
    );
  }

  debug(debug_message: string) {
    if (process.env.LOG === "DEBUG") {
      console.log(
        `${colors.bgBlueBright("调试:")} ${colors.blue(`${debug_message}`)}`
      );
    }
  }
}

export { Log };
