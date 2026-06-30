# Graph Report - .  (2026-06-30)

## Corpus Check
- Corpus is ~11,942 words - fits in a single context window. You may not need a graph.

## Summary
- 183 nodes · 268 edges · 18 communities (12 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_App Shell & Routing|App Shell & Routing]]
- [[_COMMUNITY_Nutricost Daily Analytics|Nutricost Daily Analytics]]
- [[_COMMUNITY_Dashboard & Status UI|Dashboard & Status UI]]
- [[_COMMUNITY_TS App Compiler Config|TS App Compiler Config]]
- [[_COMMUNITY_Mock Data & Generators|Mock Data & Generators]]
- [[_COMMUNITY_TS Node Compiler Config|TS Node Compiler Config]]
- [[_COMMUNITY_Project Tooling & Assets|Project Tooling & Assets]]
- [[_COMMUNITY_Oxlint Rules|Oxlint Rules]]
- [[_COMMUNITY_Data Table Component|Data Table Component]]
- [[_COMMUNITY_Empty State Component|Empty State Component]]
- [[_COMMUNITY_Metric Card Component|Metric Card Component]]
- [[_COMMUNITY_TS Root Config|TS Root Config]]
- [[_COMMUNITY_Icon Sprite Sheet|Icon Sprite Sheet]]
- [[_COMMUNITY_Hero Image Asset|Hero Image Asset]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 15 edges
3. `TopBar()` - 7 edges
4. `formatNumber()` - 7 edges
5. `formatCurrency()` - 6 edges
6. `formatPercent()` - 6 edges
7. `scripts` - 5 edges
8. `mockProjects` - 5 edges
9. `formatChangePct()` - 5 edges
10. `trendBg()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Favicon SVG - Purple Lightning Bolt App Icon` --semantically_similar_to--> `Vite Logo SVG`  [INFERRED] [semantically similar]
  public/favicon.svg → src/assets/vite.svg
- `React Logo SVG` --conceptually_related_to--> `React + TypeScript + Vite Technology Stack`  [INFERRED]
  src/assets/react.svg → README.md
- `Vite Logo SVG` --conceptually_related_to--> `React + TypeScript + Vite Technology Stack`  [INFERRED]
  src/assets/vite.svg → README.md
- `index.html - App Entry Point` --references--> `Favicon SVG - Purple Lightning Bolt App Icon`  [EXTRACTED]
  index.html → public/favicon.svg
- `Delta()` --calls--> `formatChangePct()`  [EXTRACTED]
  src/pages/Dashboard.tsx → src/utils/formatters.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **App Bootstrap Assets - Entry Point and Core Icons** — index_html, public_favicon_svg, public_icons_svg [INFERRED 0.85]
- **Technology Stack Logo Assets** — src_assets_react_svg, src_assets_vite_svg, react_typescript_vite_stack [INFERRED 0.85]

## Communities (18 total, 6 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, date-fns, lucide-react, react, react-dom, react-router-dom, recharts, devDependencies (+19 more)

### Community 1 - "App Shell & Routing"
Cohesion: 0.12
Nodes (15): Layout(), navItems, TopBar(), TopBarProps, mockPageAnalytics, mockProjectData, mockProjects, PageAnalytics() (+7 more)

### Community 2 - "Nutricost Daily Analytics"
Cohesion: 0.12
Nodes (12): mockNutricostDaily, StorewideKpis(), COMPARISON_METRICS, DAILY_GROUPS, GROUP_COLORS, MetricDef, METRICS, formatCurrency() (+4 more)

### Community 3 - "Dashboard & Status UI"
Cohesion: 0.11
Nodes (13): StatusBadgeProps, statusColors, mockNutricostSummary, activeProjects, baselineCR, BenchmarkRow, Delta(), latestPageSnapshot (+5 more)

### Community 4 - "TS App Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 5 - "Mock Data & Generators"
Cohesion: 0.19
Nodes (12): addDays(), makePageAnalyticsRows(), makeProjectDataRows(), mockNutricostMonthly, mockNutricostWeekly, mockSettings, seededRand(), AppSettings (+4 more)

### Community 6 - "TS Node Compiler Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Project Tooling & Assets"
Cohesion: 0.29
Nodes (7): index.html - App Entry Point, Oxlint Linting Configuration, Favicon SVG - Purple Lightning Bolt App Icon, React + TypeScript + Vite Technology Stack, README - React + TypeScript + Vite Project Setup, React Logo SVG, Vite Logo SVG

### Community 8 - "Oxlint Rules"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **86 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `App Shell & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Nutricost Daily Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Should `Dashboard & Status UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `TS App Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `TS Node Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._