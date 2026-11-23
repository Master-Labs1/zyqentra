// Same flow using the pre-release SDK. Build sdk/javascript first, then run with tsx:
//   REALMAILPRO_API_KEY=... npx tsx examples/typescript/poll-otp.ts
import { RealMailPro, RateLimitError } from "../../sdk/javascript/src/index.js";

const client = new RealMailPro(); // reads REALMAILPRO_API_KEY, throws if missing

const inbox = await client.inboxes.create({ service: "gmail_alias" });
console.log(`Use this address: ${inbox.address}`);

const deadline = Date.now() + 5 * 60_000;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 10_000));
  try {
    const { data } = await client.inboxes.messages(inbox.id);
    const otp = data.find((m) => m.otp)?.otp;
    if (otp) {
      console.log(`OTP: ${otp}`);
      process.exit(0);
    }
  } catch (err) {
    if (!(err instanceof RateLimitError)) throw err;
  }
}
console.error("Timed out waiting for an OTP.");
process.exit(2);
