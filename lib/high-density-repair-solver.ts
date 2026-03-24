import { BaseSolver } from "@tscircuit/solver-utils"
import type { GraphicsObject } from "graphics-debug"

type XY = { x: number; y: number }
type PortPoint = XY & { connectionName?: string; portPointId?: string }
type HdRoute = {
  connectionName?: string
  route?: XY[]
  traceThickness?: number
  vias?: Array<{ x: number; y: number; diameter?: number }>
  viaDiameter?: number
}
type Obstacle = {
  type?: string
  center?: XY
  width?: number
  height?: number
}
export type DatasetSample = {
  nodeWithPortPoints?: {
    capacityMeshNodeId?: string
    center?: XY
    width?: number
    height?: number
    portPoints?: PortPoint[]
  }
  nodeHdRoutes?: HdRoute[]
  adjacentObstacles?: Obstacle[]
}

export interface HighDensityRepairSolverParams {
  sample?: DatasetSample
}

export class HighDensityRepairSolver extends BaseSolver {
  constructor(public readonly params: HighDensityRepairSolverParams = {}) {
    super()
  }

  override _step(): void {
    this.solved = true
  }

  override visualize(): GraphicsObject {
    const sample = this.params.sample
    const node = sample?.nodeWithPortPoints
    const routes = sample?.nodeHdRoutes ?? []
    const obstacles = sample?.adjacentObstacles ?? []

    const nodeRect =
      node?.center && node.width && node.height
        ? [
            {
              center: node.center,
              width: node.width,
              height: node.height,
              stroke: "#1d4ed8",
              fill: "rgba(29, 78, 216, 0.1)",
              label: node.capacityMeshNodeId ?? "capacity-node",
            },
          ]
        : []

    const obstacleRects = obstacles
      .filter(
        (obstacle) => obstacle.center && obstacle.width && obstacle.height,
      )
      .map((obstacle, idx) => ({
        center: obstacle.center as XY,
        width: obstacle.width as number,
        height: obstacle.height as number,
        stroke: obstacle.type === "oval" ? "#a855f7" : "#dc2626",
        fill:
          obstacle.type === "oval"
            ? "rgba(168, 85, 247, 0.15)"
            : "rgba(220, 38, 38, 0.12)",
        label: obstacle.type
          ? `obstacle:${obstacle.type}:${idx}`
          : `obstacle:${idx}`,
      }))

    const points = [
      ...(node?.portPoints ?? []).map((portPoint) => ({
        x: portPoint.x,
        y: portPoint.y,
        color: "#0f766e",
        label:
          portPoint.connectionName ?? portPoint.portPointId ?? "port-point",
      })),
      ...routes
        .flatMap((route) => route.route ?? [])
        .map((routePoint) => ({
          x: routePoint.x,
          y: routePoint.y,
          color: "#0ea5e9",
        })),
    ]

    const lines = routes
      .filter((route) => (route.route?.length ?? 0) >= 2)
      .map((route) => ({
        points: route.route as XY[],
        strokeColor: "#0284c7",
        strokeWidth: route.traceThickness ?? 0.15,
        label: route.connectionName ?? "route",
      }))

    const circles = routes.flatMap((route) =>
      (route.vias ?? []).map((via) => ({
        center: { x: via.x, y: via.y },
        radius: (via.diameter ?? route.viaDiameter ?? 0.3) / 2,
        stroke: "#7c3aed",
        fill: "rgba(124, 58, 237, 0.2)",
        label: route.connectionName ? `via:${route.connectionName}` : "via",
      })),
    )

    return {
      coordinateSystem: "cartesian",
      title: "HighDensityRepair02 Initial State",
      rects: [...nodeRect, ...obstacleRects],
      points,
      lines,
      circles,
    }
  }
}
