import type { BoundaryRect, HdRoute } from "../shared/types"

/**
 * Many input routes have points that are slightly outside the capacity-node
 * boundary (e.g. exit points that match ports in an adjacent cell whose
 * coordinate system drifts by a fraction of a millimetre). Those outside
 * points become permanent boundary violations because the downstream repair
 * logic is not allowed to move endpoints and sees the whole segment as
 * outside the boundary.
 *
 * This helper pulls every route point to the nearest position that is
 * on or inside the boundary rectangle. It is deliberately cheap and safe:
 * it only moves points strictly outside the boundary (by any amount) to
 * the nearest boundary edge, so the overall route topology is preserved.
 */
export const clampRoutePointsToBoundary = (
  routes: HdRoute[],
  boundary: BoundaryRect,
): HdRoute[] =>
  routes.map((route) => {
    const points = route.route ?? []
    let changed = false
    const nextPoints = points.map((point) => {
      let x = point.x
      let y = point.y
      if (x < boundary.minX) x = boundary.minX
      else if (x > boundary.maxX) x = boundary.maxX
      if (y < boundary.minY) y = boundary.minY
      else if (y > boundary.maxY) y = boundary.maxY
      if (x === point.x && y === point.y) return point
      changed = true
      return { ...point, x, y }
    })
    if (!changed) return route
    return { ...route, route: nextPoints }
  })
