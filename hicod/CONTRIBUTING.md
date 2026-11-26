# Contributing a robotics concept

A concept contribution should describe a class of physical problems, not simply rename an individual error.

1. Provide the semantic definition, level, mathematical definition, domain and assumptions.
2. Specify required inputs, dependencies and the candidate space / sampling measure.
3. Implement an evaluator returning structured evidence, with units and reproducible settings.
4. Separate computed facts from interpretations and suggested interventions. State whether results are exact, bounded, sampled or learned.
5. Provide counterexamples and tests, including cases where local feasibility does not imply global feasibility.
6. Give drill-down handles to raw evidence and reference the underlying research. No path found must not be called proven infeasible absent a valid certificate.
7. Describe computational cost and limitations.

The dependency model should be a DAG; a report is a task-specific tree view over shared evidence. Keep LLM and simulator dependencies optional where possible. Do not include unpublished or third-party code without permission. Contributions to this project are intended to be MIT-licensed.
