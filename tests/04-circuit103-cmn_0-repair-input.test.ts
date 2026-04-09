import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialStateFromAsset } from "./fixtures/visualize-datasets"

test("visual snapshot: 04-circuit103-cmn_0 repair input", async () => {
  const graphics = await renderInitialStateFromAsset(
    "../assets/04-circuit103-cmn_0-repair-input.json",
  )
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
