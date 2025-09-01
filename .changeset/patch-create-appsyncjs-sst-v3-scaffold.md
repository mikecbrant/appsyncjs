---
'@mikecbrant/create-appsyncjs': patch
---

Release patch to ship scaffold updates aligning with SST v3 template conventions.

This includes moving schema/resolvers/tests under `packages/core`, introducing a `packages/scripts` workspace, adopting JSON `tsconfig` files, and wiring pnpm workspaces in the scaffold. No runtime behavior in the generator changed—this publish propagates the updated scaffold layout.
