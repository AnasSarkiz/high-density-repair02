import { expect, test } from "bun:test"
import {
  findTraceViolations,
  getTraceViolationTraceCount,
} from "../lib/high-density-repair-solver/functions/findTraceViolations"
import type { HdRoute } from "../lib/high-density-repair-solver"

const createParallelRoutes = (overrides: Partial<HdRoute> = {}): HdRoute[] => [
  {
    connectionName: "net-a",
    traceThickness: 0.15,
    route: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
    ],
    ...overrides,
  },
  {
    connectionName: "net-b",
    traceThickness: 0.15,
    route: [
      { x: 0, y: 0.2, z: 0 },
      { x: 1, y: 0.2, z: 0 },
    ],
  },
]

test("findTraceViolations detects same-layer trace clearance conflicts", () => {
  const violations = findTraceViolations(createParallelRoutes())

  expect(violations).toHaveLength(1)
  expect(violations[0]?.routeIndexes).toEqual([0, 1])
  expect(getTraceViolationTraceCount(violations)).toBe(2)
})

test("findTraceViolations ignores same-net trace clearance conflicts", () => {
  const routes = createParallelRoutes({ connectionName: "shared-net" })
  routes[1] = { ...routes[1], connectionName: "shared-net" }

  expect(findTraceViolations(routes)).toHaveLength(0)
})

test("findTraceViolations ignores via-to-via conflicts", () => {
  const routes: HdRoute[] = [
    {
      connectionName: "net-a",
      vias: [{ x: 0, y: 0, diameter: 0.3 }],
    },
    {
      connectionName: "net-b",
      vias: [{ x: 0.1, y: 0, diameter: 0.3 }],
    },
  ]

  expect(findTraceViolations(routes)).toHaveLength(0)
})

test("findTraceViolations can scope checks to moved route indexes", () => {
  const routes = createParallelRoutes()

  expect(findTraceViolations(routes, new Set([0]))).toHaveLength(1)
  expect(findTraceViolations(routes, new Set([1]))).toHaveLength(1)
  expect(findTraceViolations(routes, new Set())).toHaveLength(0)
})
