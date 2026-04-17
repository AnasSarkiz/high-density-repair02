import {
  findClearanceConflicts,
  type ClearanceConflict,
} from "./findClearanceConflicts"
import { TRACE_CLEARANCE_REGRESSION_MAX } from "../shared/constants"
import type { HdRoute, RouteGeometryCache } from "../shared/types"

const getRouteNetNames = (route: HdRoute | undefined): string[] => {
  if (!route) return []

  return Array.from(
    new Set(
      [route.connectionName, route.rootConnectionName].filter(
        (name): name is string => Boolean(name),
      ),
    ),
  )
}

export const areRoutesSameNet = (
  firstRoute: HdRoute | undefined,
  secondRoute: HdRoute | undefined,
): boolean => {
  const firstNames = getRouteNetNames(firstRoute)
  const secondNames = getRouteNetNames(secondRoute)
  if (firstNames.length === 0 || secondNames.length === 0) return false

  return firstNames.some((name) => secondNames.includes(name))
}

const conflictTouchesEndpoint = (
  routes: HdRoute[],
  conflict: ClearanceConflict,
) =>
  conflict.routePointIndexes.some((pointIndexes, sideIndex) => {
    const route = routes[conflict.routeIndexes[sideIndex]]
    const lastPointIndex = (route?.route?.length ?? 0) - 1
    return pointIndexes.some(
      (pointIndex) => pointIndex === 0 || pointIndex === lastPointIndex,
    )
  })

export const findTraceViolations = (
  routes: HdRoute[],
  movedRouteIndexes = new Set(routes.map((_, routeIndex) => routeIndex)),
  geometryCache?: RouteGeometryCache,
): ClearanceConflict[] =>
  findClearanceConflicts(
    routes,
    movedRouteIndexes,
    TRACE_CLEARANCE_REGRESSION_MAX,
    geometryCache,
  ).filter(
    (conflict) =>
      !(conflict.layers[0] === "via" && conflict.layers[1] === "via") &&
      !conflictTouchesEndpoint(routes, conflict) &&
      !areRoutesSameNet(
        routes[conflict.routeIndexes[0]],
        routes[conflict.routeIndexes[1]],
      ),
  )

export const getTraceViolationTraceCount = (
  violations: ClearanceConflict[],
): number =>
  new Set(violations.flatMap((violation) => violation.routeIndexes)).size
