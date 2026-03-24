import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { HighDensityRepairSolver } from "lib/high-density-repair-solver"
import { fullDatasetFixture, getDatasetSample } from "tests/fixtures/dataset"

const renderInitialState = (sampleName: string) => {
  const sample = getDatasetSample(sampleName)
  const solver = new HighDensityRepairSolver({ sample })
  return solver.visualize()
}

test("visual snapshot: sample0001 initial state", async () => {
  const graphics = renderInitialState("sample0001")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path, {
    svgName: "sample0001",
  })
})

test("visual snapshot: sample0042 initial state", async () => {
  const graphics = renderInitialState("sample0042")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path, {
    svgName: "sample0042",
  })
})

test("visual snapshot: sample7597 initial state", async () => {
  const graphics = renderInitialState("sample0024")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path, {
    svgName: "sample0024",
  })
})
