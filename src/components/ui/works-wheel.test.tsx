import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { WorksWheel, GEORGE_PROJECTS } from "./works-wheel";

afterEach(() => cleanup());

describe("WorksWheel", () => {
  it("lists the real projects with owners", () => {
    expect(GEORGE_PROJECTS.map((p) => p.title)).toEqual([
      "arena.ai-desktop", "Quilore", "StudyPomo", "Ponderanda", "Herewise", "PlayzAnime", "Zykof",
    ]);
    const owner = Object.fromEntries(GEORGE_PROJECTS.map((p) => [p.title, p.owner]));
    expect(owner.PlayzAnime).toBe("Open source");
    expect(owner.Zykof).toBe("Personal");
    expect(owner.StudyPomo).toBe("Emberfig");
  });

  it("stage allows native vertical panning", () => {
    render(<WorksWheel />);
    expect(screen.getByRole("listbox").className).toContain("touch-pan-y");
  });

  it("renders stepper and one dot per project; controls do not throw", () => {
    render(<WorksWheel />);
    fireEvent.click(screen.getByLabelText("Next project"));
    fireEvent.click(screen.getByLabelText("Previous project"));
    GEORGE_PROJECTS.forEach((_, i) => expect(screen.getByLabelText(`Jump to project ${i + 1}`)).toBeDefined());
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });
  });
});
