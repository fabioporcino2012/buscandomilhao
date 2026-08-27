import { pathToFileURL } from "node:url";

export function describeWorkerMode(allowExternalWrites: string | undefined) {
  return allowExternalWrites === "true"
    ? "external_writes_enabled"
    : "dry_run";
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const mode = describeWorkerMode(process.env.ALLOW_EXTERNAL_WRITES);
  console.log(`[Florida Ecosystem] worker iniciado em ${mode}`);
  setInterval(() => undefined, 60_000);
}
