import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import { describeWorkerMode } from "../src/worker/main";

describe("operator shell", () => {
  it("shows the approved journey and simulation state", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Florida Pay");
    expect(html).toContain("Florida Club");
    expect(html).toContain("Florida Black");
    expect(html).toContain("Modo de simulação");
  });

  it("keeps the worker safe by default", () => {
    expect(describeWorkerMode(undefined)).toBe("dry_run");
    expect(describeWorkerMode("false")).toBe("dry_run");
    expect(describeWorkerMode("true")).toBe("external_writes_enabled");
  });
});
