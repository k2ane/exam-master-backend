import * as z from "zod";

const zLoginInput = z.object({
  email: z.email(),
  passcode: z.string(),
});

export { zLoginInput };
