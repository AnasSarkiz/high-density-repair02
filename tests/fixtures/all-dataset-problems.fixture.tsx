import { GenericSolverDebugger } from "@tscircuit/solver-utils/react"
import { HighDensityRepairSolver } from "lib/high-density-repair-solver"
import { useState } from "react"
import { datasetProblems } from "tests/fixtures/dataset"

export default function AllDatasetProblemsFixture() {
  const [sampleNumberInput, setSampleNumberInput] = useState("1")

  const maxSampleNumber = datasetProblems.length
  const parsedSampleNumber = Number.parseInt(sampleNumberInput, 10)
  const safeSampleNumber = Number.isFinite(parsedSampleNumber)
    ? Math.min(Math.max(parsedSampleNumber, 1), maxSampleNumber)
    : 1
  const selectedProblem =
    datasetProblems[safeSampleNumber - 1] ?? datasetProblems[0]

  if (!selectedProblem) {
    return <div>Dataset is empty.</div>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label htmlFor="dataset-problem-number">Dataset problem #</label>
        <input
          id="dataset-problem-number"
          type="number"
          min={1}
          max={maxSampleNumber}
          value={sampleNumberInput}
          onChange={(event) => setSampleNumberInput(event.currentTarget.value)}
          style={{ width: 96 }}
        />
        <button
          type="button"
          onClick={() =>
            setSampleNumberInput(String(Math.max(1, safeSampleNumber - 1)))
          }
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() =>
            setSampleNumberInput(
              String(Math.min(maxSampleNumber, safeSampleNumber + 1)),
            )
          }
        >
          Next
        </button>
        <span>
          Showing {selectedProblem.sampleName} ({safeSampleNumber} /{" "}
          {maxSampleNumber})
        </span>
      </div>

      <GenericSolverDebugger
        key={selectedProblem.sampleName}
        createSolver={() =>
          new HighDensityRepairSolver({ sample: selectedProblem.sample })
        }
      />
    </div>
  )
}
