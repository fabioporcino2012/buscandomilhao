export type InstagramPage = {
  openThread(profileUrl: string): Promise<unknown>;
  fillComposer(message: string): Promise<unknown>;
  clickSend(): Promise<unknown>;
  hasCheckpoint(): Promise<boolean>;
};

type FirstContactInput = {
  profileUrl: string;
  message: string;
  mode: "dry_run" | "live";
};

export async function runInstagramFirstContact(
  page: InstagramPage,
  input: FirstContactInput,
) {
  if (await page.hasCheckpoint()) {
    return { status: "paused_checkpoint", sent: false } as const;
  }

  await page.openThread(input.profileUrl);
  await page.fillComposer(input.message);

  if (input.mode === "dry_run") {
    return { status: "ready_to_send", sent: false } as const;
  }

  await page.clickSend();
  return { status: "sent", sent: true } as const;
}
