# Branch Strategy

## Branch Types
| Branch | Source | Target | Description |
|--------|--------|--------|-------------|
| main | — | — | Production |
| develop | main | main | Integration |
| feature/* | main | main | New feature |
| fix/* | main | main | Bug fix |
| refactor/* | main | main | Refactoring |
| docs/* | main | main | Documentation |

## Workflow
`
main ────────────────●────────────────●──
                      \              /
feature/add-booking   ●──●──●──●──●─
`

1. Branch dari main
2. Commit dengan format konvensional
3. Push dan buka PR
4. PR title mengikuti commit convention
5. Squash merge ke main
6. Hapus branch setelah merge
