# Comparable team websites and service tradeoffs

## Sources and comparable workflows

[TeamSnap ONE websites](https://www.teamsnap.com/sports-organizations/websites) and [TeamSnap schedule module documentation](https://helpme.teamsnap.com/article/1767-configuring-the-schedule-module-in-website-builder) are service-backed website references. They are not direct comparisons to this portable zero-build starter.

## How this project should earn its place

Aim for excellent mobile schedule discovery, editorial identity, accessible navigation and simple approved-content updates. Evaluate page weight, loading, keyboard use, reduced motion and missing-data fallbacks. Do not import a registration backend or paid service merely for parity. No private youth/player information belongs in these comparisons.

## Evidence and maintenance

Source review: 2026-11-12. Scope: documented capabilities and proposed evaluation criteria, not installed comparative tests or a latest-version certification. Unknown is not unsupported. No measured superiority is claimed.

For each meaningful upstream change, record the source URL, publication/version date, review date, affected workflow, licensing/access constraints, opportunity and reproducible acceptance test. Preserve last-good findings and failed tests. Recheck primary sources before implementation decisions; do not copy proprietary code/assets or change the product scope merely to match another tool. Proposed features remain proposals until authorized. Daily review should record no change honestly rather than invent updates.

## Next comparison pass

- [ ] Pin exact compared versions and representative workloads.
- [ ] Capture source evidence and verify applicable licenses.
- [ ] Measure current implementation before a replacement or optimization.
- [ ] Record correctness, usability, resource cost and recovery results together.
- [ ] Link only proven improvements to implementation milestones; retain unproven candidates as research.

## Reuse foundations and concrete parts to evaluate

Keep the existing framework-free site and site.config.js as the reusable foundation. TeamSnap is a service/UI reference, not a code base to copy or a subscription to add.

## Integration with our projects

Reuse accessible static-page patterns with the public project-information site only where content and licensing allow. Share layout/test patterns, never private player datasets. Centralize team facts in site.config.js.

## Target improvement and acceptance boundary

Beat generic templates through clear mobile schedules and excellent editability without heavier runtime. Test missing optional data, keyboard flow, reduced motion and slow-network loading.

## License, access and adoption gate

Status: research candidate, not integrated or benchmark-proven. Before copying code, pin the exact upstream revision and record its LICENSE, dependency licenses, notices and distribution obligations. Missing/ambiguous terms block reuse; behavioral study or a permitted interoperable adapter may remain possible. Service documentation is not a source-code license or API grant. Preserve existing user permissions, private/public boundaries and creator/game asset rights.

Choose reuse, adapter, fork or independent implementation only after a target-workload comparison. Retain raw failures and rollback; share no credentials, private fixtures or account details. Adoption remains blocked until licensing, correctness, performance and maintenance cost are reviewed together. Review delta dated 2026-11-12.
