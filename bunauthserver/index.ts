import { authorizer } from "@openauthjs/openauth";
import { PasswordAdapter } from "@openauthjs/openauth/adapter/password";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { subjects } from "./subjects";

const authServer = authorizer({
  providers: {
    password: PasswordAdapter(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(`${email} : ${code}`);
        },
      })
    )
  },
  subjects,
  async success(ctx, value) {
    console.log(value.provider);
    if (value.provider === "password") {
      console.log(JSON.stringify(ctx.subject("user", { userId: crypto.randomUUID(), role: "user" })));
      return ctx.subject("user", { userId: crypto.randomUUID(), role: "user" })
    }
    throw new Error("Invalid provider")
  },
  storage: MemoryStorage({
    persist: "./persist.json"
  })
})

export default authServer