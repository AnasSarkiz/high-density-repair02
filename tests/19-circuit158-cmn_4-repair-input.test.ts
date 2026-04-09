import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialStateFromAsset } from "./fixtures/visualize-datasets"

test("visual snapshot: 19-circuit158-cmn_4 repair input", async () => {
  const graphics = await renderInitialStateFromAsset(
    "../assets/19-circuit158-cmn_4-repair-input.json",
  )
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
