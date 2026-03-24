import * as dataset from "dataset-hd08"
import type { DatasetSample } from "../../lib/high-density-repair-solver"

const datasetRecord: Record<string, unknown> = dataset

const entries = Object.entries(datasetRecord)
  .filter(([name]) => /^sample\d{4}$/.test(name))
  .sort(([a], [b]) => a.localeCompare(b))

export interface DatasetProblem {
  sampleName: string
  sample: unknown
}

export const datasetProblems: DatasetProblem[] = entries.map(
  ([sampleName, sample]) => ({
    sampleName,
    sample,
  }),
)

export const fullDatasetFixture = {
  sampleCount: entries.length,
  sampleNames: entries.map(([name]) => name),
  problems: datasetProblems,
}

export const getDatasetSample = (sampleName: string): DatasetSample =>
  datasetRecord[sampleName]
