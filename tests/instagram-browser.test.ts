import { describe, expect, it } from "vitest";
import {
  runInstagramFirstContact,
  type InstagramPage,
} from "../src/integrations/browser/instagram";
import { createSessionLock } from "../src/integrations/browser/session-lock";

function fakePage(challenge = false) {
  const calls: string[] = [];
  const page: InstagramPage = {
    openThread: async () => calls.push("open_thread"),
    fillComposer: async () => calls.push("fill_composer"),
    clickSend: async () => calls.push("click_send"),
    hasCheckpoint: async () => challenge,
  };
  return { page, calls };
}

describe("Instagram browser guard", () => {
  it("reaches the send boundary without clicking in dry-run", async () => {
    const { page, calls } = fakePage();

    await expect(
      runInstagramFirstContact(page, {
        profileUrl: "https://www.instagram.com/example/",
        message: "Olá",
        mode: "dry_run",
      }),
    ).resolves.toEqual({ status: "ready_to_send", sent: false });
    expect(calls).toEqual(["open_thread", "fill_composer"]);
  });

  it("pauses before interacting when Instagram shows a checkpoint", async () => {
    const { page, calls } = fakePage(true);

    await expect(
      runInstagramFirstContact(page, {
        profileUrl: "https://www.instagram.com/example/",
        message: "Olá",
        mode: "live",
      }),
    ).resolves.toEqual({ status: "paused_checkpoint", sent: false });
    expect(calls).toEqual([]);
  });

  it("clicks send only when live mode is explicitly selected", async () => {
    const { page, calls } = fakePage();

    await expect(
      runInstagramFirstContact(page, {
        profileUrl: "https://www.instagram.com/example/",
        message: "Olá",
        mode: "live",
      }),
    ).resolves.toEqual({ status: "sent", sent: true });
    expect(calls).toEqual(["open_thread", "fill_composer", "click_send"]);
  });

  it("allows only one browser worker at a time", () => {
    const lock = createSessionLock();
    const release = lock.acquire();

    expect(() => lock.acquire()).toThrow("Instagram session is already in use");
    release();
    expect(() => lock.acquire()).not.toThrow();
  });
});
