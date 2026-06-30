import type {
  Project, ProjectDataRow, PageAnalyticsRow,
  NutricostDailyRow, NutricostPeriodRow, NutricostComparisonRow, AppSettings,
} from '../types'

// ---------------------------------------------------------------------------
// Projects — matches real spreadsheet project IDs
// ---------------------------------------------------------------------------
export const mockProjects: Project[] = [
  {
    id: 'fd-26',
    name: 'Fathers Day Sale 2026',
    status: 'Active',
    projectType: 'New Sale Page',
    pageUrl: 'https://nutricost.com/pages/fathers-day-sale',
    launchDate: '2026-06-19',
    endDate: '2026-06-21',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'Pre-Launch Store Period',
    pageBenchmarkSource: 'Same-Period Store CR',
    baselineCalculated: 'Yes',
    notes: 'Pre-launch baseline Jun 11–18',
  },
  {
    id: 'cfw-g',
    name: 'Creatine Women - Gym',
    status: 'Active',
    projectType: 'Evergreen / Ongoing Page',
    pageUrl: 'https://nutricost.com/pages/creatine-women-gym',
    launchDate: '2026-05-18',
    projectDataTracking: 'No',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'No Project Data Benchmark',
    pageBenchmarkSource: 'First Valid Tracking Days',
    baselineCalculated: 'Not Required',
    notes: 'Evergreen gym-audience creatine page',
  },
  {
    id: 'skoff',
    name: 'Summer Kickoff',
    status: 'Completed',
    projectType: 'New Sale Page',
    pageUrl: 'https://nutricost.com/pages/summer-kickoff',
    launchDate: '2026-05-19',
    endDate: '2026-05-26',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'No Project Data Benchmark',
    pageBenchmarkSource: 'Same-Period Store CR',
    baselineCalculated: 'Not Required',
    notes: 'Summer sale event',
  },
  {
    id: 'md-26',
    name: 'Mothers Day Sale 2026',
    status: 'Completed',
    projectType: 'New Sale Page',
    pageUrl: 'https://nutricost.com/pages/mothers-day-sale',
    launchDate: '2026-05-07',
    endDate: '2026-05-11',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'No Project Data Benchmark',
    pageBenchmarkSource: 'Same-Period Store CR',
    baselineCalculated: 'Not Required',
    notes: "Mother's Day promotion",
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout Sale',
    status: 'Completed',
    projectType: 'New Sale Page',
    pageUrl: 'https://nutricost.com/pages/pre-workout-sale',
    launchDate: '2026-05-10',
    endDate: '2026-05-12',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'No Project Data Benchmark',
    pageBenchmarkSource: 'Same-Period Store CR',
    baselineCalculated: 'Not Required',
    notes: 'Pre-workout product sale',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay()
  return day === 0 || day === 6
}

function seededRand(dateStr: string, offset: number): number {
  const hash = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + offset
  return (hash % 100) / 100
}

function pct(cur: number, ly: number): number {
  if (ly === 0) return 0
  return Math.round(((cur - ly) / ly) * 10000) / 100
}

// ---------------------------------------------------------------------------
// Nutricost Daily Data (Jan 1 – Jun 26 2026 = 177 days)
// Modelled to aggregate to the real YTD totals from the spreadsheet:
//   Orders 71,422 / Revenue $5,012,955 / Sessions 1,104,051 / CR 2.67% / AOV $70.19
// ---------------------------------------------------------------------------
export const mockNutricostDaily: NutricostDailyRow[] = (() => {
  const rows: NutricostDailyRow[] = []
  const start = '2026-01-01'
  const days = 177  // Jan 1 through Jun 26

  for (let i = 0; i < days; i++) {
    const date = addDays(start, i)
    const weekend = isWeekend(date)
    const s = seededRand(date, i)
    const s2 = seededRand(date, i + 37)

    // Month-based seasonal factor (May was huge — Summer Kickoff + Mothers Day)
    const month = new Date(date).getMonth() + 1
    const seasonal = month === 5 ? 1.45 : month === 6 ? 1.1 : month === 1 ? 0.95 : 1.0

    const baseOrders = weekend ? 250 + s * 60 : 360 + s * 80
    const orders = Math.round(baseOrders * seasonal)
    const aov = 65 + s * 12 + (weekend ? -3 : 3)
    const revenue = Math.round(orders * aov * 100) / 100
    const baseSessions = weekend ? 5500 + s * 2000 : 7200 + s * 3000
    const sessions = Math.round(baseSessions * seasonal)
    const conversionRate = Math.round((orders / sessions) * 10000) / 100

    // LY values — store was smaller (orders ~63% of current per spreadsheet YTD)
    const lyFactor = 0.60 + s2 * 0.08
    const lyOrders = Math.round(orders * lyFactor)
    const lyRevenue = Math.round(orders * lyFactor * (aov * (0.94 + s2 * 0.08)) * 100) / 100
    const lyAov = Math.round((lyRevenue / lyOrders) * 100) / 100
    const lySessionFactor = 1.05 + s2 * 0.15   // LY sessions were actually higher (less paid traffic efficiency)
    const lySessions = Math.round(sessions * lySessionFactor)
    const lyConversionRate = Math.round((lyOrders / lySessions) * 10000) / 100

    rows.push({
      date,
      periodType: 'Daily',
      orders,
      lyOrders,
      ordersChangePct: pct(orders, lyOrders),
      revenue,
      lyRevenue,
      revenueChangePct: pct(revenue, lyRevenue),
      sessions,
      lySessions,
      sessionsChangePct: pct(sessions, lySessions),
      conversionRate,
      lyConversionRate,
      crChangePct: pct(conversionRate, lyConversionRate),
      aov: Math.round(aov * 100) / 100,
      lyAov,
      aovChangePct: pct(aov, lyAov),
      totalSalesExclTikTok: Math.round(revenue * 0.93 * 100) / 100,
    })
  }
  return rows
})()

// ---------------------------------------------------------------------------
// Nutricost Period Summary rows — using real spreadsheet values
// ---------------------------------------------------------------------------
export const mockNutricostSummary: NutricostPeriodRow[] = [
  {
    sectionLabel: 'YTD TOTALS',
    period: '2026-01-01 to 2026-06-26',
    lyPeriod: '2025-01-01 to 2025-06-26',
    orders: 71422,    lyOrders: 43718,    ordersChangePct: 63.37,
    revenue: 5012954.66, lyRevenue: 2897553.59, revenueChangePct: 73.01,
    sessions: 1104051, lySessions: 1286426, sessionsChangePct: -14.18,
    cr: 2.67,  lyCr: 2.38,  crChangePct: 12.03,
    aov: 70.19, lyAov: 66.28, aovChangePct: 5.90,
  },
  {
    sectionLabel: 'YTD DAILY AVERAGES',
    period: '2026-01-01 to 2026-06-26',
    lyPeriod: '2025-01-01 to 2025-06-26',
    orders: 404,   lyOrders: 247,    ordersChangePct: 63.37,
    revenue: 28321.78, lyRevenue: 16370.36, revenueChangePct: 73.01,
    sessions: 6237, lySessions: 7268, sessionsChangePct: -14.18,
    cr: 2.67,  lyCr: 2.38,  crChangePct: 12.03,
    aov: 70.19, lyAov: 66.28, aovChangePct: 5.90,
  },
  {
    sectionLabel: 'LATEST DAILY SNAPSHOT',
    period: '2026-06-26',
    lyPeriod: '2025-06-26',
    orders: 290,   lyOrders: 267,    ordersChangePct: 8.61,
    revenue: 15617.03, lyRevenue: 16785.99, revenueChangePct: -6.96,
    sessions: 3924, lySessions: 3566, sessionsChangePct: 10.04,
    cr: 2.22,  lyCr: 2.11,  crChangePct: 5.21,
    aov: 53.85, lyAov: 62.87, aovChangePct: -14.35,
  },
  {
    sectionLabel: 'CURRENT WEEK',
    period: '2026-06-22 to 2026-06-26',
    lyPeriod: '2025-06-22 to 2025-06-26',
    orders: 1588,  lyOrders: 1088,   ordersChangePct: 45.96,
    revenue: 95852.09, lyRevenue: 71185.81, revenueChangePct: 34.79,
    sessions: 22440, lySessions: 18312, sessionsChangePct: 22.55,
    cr: 2.35,  lyCr: 1.89,  crChangePct: 24.34,
    aov: 60.36, lyAov: 65.43, aovChangePct: -7.75,
  },
  {
    sectionLabel: 'CURRENT MONTH',
    period: '2026-06-01 to 2026-06-26',
    lyPeriod: '2025-06-01 to 2025-06-26',
    orders: 8776,  lyOrders: 5350,   ordersChangePct: 64.04,
    revenue: 546927.80, lyRevenue: 341771.04, revenueChangePct: 60.03,
    sessions: 116809, lySessions: 89739, sessionsChangePct: 30.17,
    cr: 2.52,  lyCr: 2.01,  crChangePct: 25.37,
    aov: 62.33, lyAov: 63.88, aovChangePct: -2.43,
  },
]

// ---------------------------------------------------------------------------
// Monthly comparison — real spreadsheet values
// ---------------------------------------------------------------------------
export const mockNutricostMonthly: NutricostComparisonRow[] = [
  {
    periodLabel: 'Jun 2026', lyPeriodLabel: 'Jun 2025',
    orders: 8776,   lyOrders: 5350,  ordersChangePct: 64.04,
    revenue: 546927.80, lyRevenue: 341771.04, revenueChangePct: 60.03,
    sessions: 116809, lySessions: 89739, sessionsChangePct: 30.17,
    cr: 2.52,  lyCr: 2.01,  crChangePct: 25.37,
    aov: 62.33, lyAov: 63.88, aovChangePct: -2.43,
  },
  {
    periodLabel: 'May 2026', lyPeriodLabel: 'May 2025',
    orders: 16800,  lyOrders: 9252,  ordersChangePct: 81.58,
    revenue: 1342541.83, lyRevenue: 708154.49, revenueChangePct: 89.58,
    sessions: 249058, lySessions: 146820, sessionsChangePct: 69.57,
    cr: 3.21,  lyCr: 2.45,  crChangePct: 31.02,
    aov: 79.91, lyAov: 76.54, aovChangePct: 4.40,
  },
  {
    periodLabel: 'Apr 2026', lyPeriodLabel: 'Apr 2025',
    orders: 12982,  lyOrders: 8658,  ordersChangePct: 49.94,
    revenue: 924758.80, lyRevenue: 582450.45, revenueChangePct: 58.77,
    sessions: 207634, lySessions: 283530, sessionsChangePct: -26.78,
    cr: 2.58,  lyCr: 2.07,  crChangePct: 24.64,
    aov: 71.23, lyAov: 67.28, aovChangePct: 5.87,
  },
  {
    periodLabel: 'Mar 2026', lyPeriodLabel: 'Mar 2025',
    orders: 13276,  lyOrders: 8288,  ordersChangePct: 60.18,
    revenue: 875200.38, lyRevenue: 547686.09, revenueChangePct: 59.80,
    sessions: 185424, lySessions: 282290, sessionsChangePct: -34.31,
    cr: 2.61,  lyCr: 2.01,  crChangePct: 29.85,
    aov: 65.92, lyAov: 66.08, aovChangePct: -0.24,
  },
  {
    periodLabel: 'Feb 2026', lyPeriodLabel: 'Feb 2025',
    orders: 9062,   lyOrders: 5930,  ordersChangePct: 52.82,
    revenue: 592949.16, lyRevenue: 364063.11, revenueChangePct: 62.87,
    sessions: 147393, lySessions: 230906, sessionsChangePct: -36.17,
    cr: 2.31,  lyCr: 1.98,  crChangePct: 16.67,
    aov: 65.44, lyAov: 61.39, aovChangePct: 6.60,
  },
  {
    periodLabel: 'Jan 2026', lyPeriodLabel: 'Jan 2025',
    orders: 10526,  lyOrders: 6240,  ordersChangePct: 68.69,
    revenue: 730576.69, lyRevenue: 353428.41, revenueChangePct: 106.71,
    sessions: 197733, lySessions: 253300, sessionsChangePct: -21.93,
    cr: 2.43,  lyCr: 1.96,  crChangePct: 23.98,
    aov: 69.40, lyAov: 56.64, aovChangePct: 22.52,
  },
]

// ---------------------------------------------------------------------------
// Weekly comparison — real spreadsheet values (last 8+ weeks)
// ---------------------------------------------------------------------------
export const mockNutricostWeekly: NutricostComparisonRow[] = [
  {
    periodLabel: 'Jun 22 – Jun 26', lyPeriodLabel: 'LY Jun 22 – Jun 26',
    orders: 1588,  lyOrders: 1088,  ordersChangePct: 45.96,
    revenue: 95852.09,  lyRevenue: 71185.81,  revenueChangePct: 34.79,
    sessions: 22440, lySessions: 18312, sessionsChangePct: 22.55,
    cr: 2.35,  lyCr: 1.89,  crChangePct: 24.34,
    aov: 60.36, lyAov: 65.43, aovChangePct: -7.75,
  },
  {
    periodLabel: 'Jun 15 – Jun 21', lyPeriodLabel: 'LY Jun 15 – Jun 21',
    orders: 2700,  lyOrders: 1567,  ordersChangePct: 72.30,
    revenue: 184423.63, lyRevenue: 98045.49,  revenueChangePct: 88.10,
    sessions: 38220, lySessions: 27840, sessionsChangePct: 37.27,
    cr: 2.71,  lyCr: 2.12,  crChangePct: 27.83,
    aov: 68.30, lyAov: 62.57, aovChangePct: 9.16,
  },
  {
    periodLabel: 'Jun 8 – Jun 14', lyPeriodLabel: 'LY Jun 8 – Jun 14',
    orders: 2252,  lyOrders: 1399,  ordersChangePct: 60.97,
    revenue: 140047.73, lyRevenue: 95650.52,  revenueChangePct: 46.41,
    sessions: 31120, lySessions: 24580, sessionsChangePct: 26.60,
    cr: 2.64,  lyCr: 2.07,  crChangePct: 27.54,
    aov: 62.19, lyAov: 68.37, aovChangePct: -9.04,
  },
  {
    periodLabel: 'Jun 1 – Jun 7', lyPeriodLabel: 'LY Jun 1 – Jun 7',
    orders: 2236,  lyOrders: 1296,  ordersChangePct: 72.53,
    revenue: 126604.35, lyRevenue: 76889.22,  revenueChangePct: 64.66,
    sessions: 25030, lySessions: 19780, sessionsChangePct: 26.54,
    cr: 2.47,  lyCr: 1.92,  crChangePct: 28.65,
    aov: 56.62, lyAov: 59.33, aovChangePct: -4.57,
  },
  {
    periodLabel: 'May 25 – May 31', lyPeriodLabel: 'LY May 25 – May 31',
    orders: 4952,  lyOrders: 3467,  ordersChangePct: 42.83,
    revenue: 417584.55, lyRevenue: 287203.95, revenueChangePct: 45.38,
    sessions: 69420, lySessions: 48310, sessionsChangePct: 43.69,
    cr: 3.04,  lyCr: 2.48,  crChangePct: 22.58,
    aov: 84.33, lyAov: 82.84, aovChangePct: 1.80,
  },
  {
    periodLabel: 'May 18 – May 24', lyPeriodLabel: 'LY May 18 – May 24',
    orders: 5896,  lyOrders: 2446,  ordersChangePct: 141.05,
    revenue: 567002.07, lyRevenue: 205855.33, revenueChangePct: 175.44,
    sessions: 78540, lySessions: 43210, sessionsChangePct: 81.77,
    cr: 3.75,  lyCr: 2.29,  crChangePct: 63.76,
    aov: 96.17, lyAov: 84.16, aovChangePct: 14.27,
  },
  {
    periodLabel: 'May 11 – May 17', lyPeriodLabel: 'LY May 11 – May 17',
    orders: 2271,  lyOrders: 1232,  ordersChangePct: 84.33,
    revenue: 133986.11, lyRevenue: 80074.90,  revenueChangePct: 67.33,
    sessions: 31840, lySessions: 20640, sessionsChangePct: 54.26,
    cr: 2.51,  lyCr: 2.04,  crChangePct: 23.04,
    aov: 58.99, lyAov: 64.99, aovChangePct: -9.23,
  },
  {
    periodLabel: 'May 4 – May 10', lyPeriodLabel: 'LY May 4 – May 10',
    orders: 2676,  lyOrders: 1469,  ordersChangePct: 82.16,
    revenue: 167932.14, lyRevenue: 94654.82,  revenueChangePct: 77.43,
    sessions: 35780, lySessions: 23940, sessionsChangePct: 49.45,
    cr: 2.63,  lyCr: 2.07,  crChangePct: 27.05,
    aov: 62.76, lyAov: 64.43, aovChangePct: -2.59,
  },
]

// ---------------------------------------------------------------------------
// Project Data
// ---------------------------------------------------------------------------
function makeProjectDataRows(
  projectId: string,
  projectName: string,
  startDate: string,
  days: number,
  baselineCR: number,
  baselineAOV: number,
  baselineSessions: number,
  crMin: number,
  crMax: number,
): ProjectDataRow[] {
  const rows: ProjectDataRow[] = []
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    const s = seededRand(date, i + projectId.length)
    const cr = crMin + (crMax - crMin) * s
    const sessions = Math.round(baselineSessions * (0.85 + s * 0.35))
    const orders = Math.round(sessions * cr / 100)
    const aov = baselineAOV * (0.96 + s * 0.1)
    const revenue = orders * aov
    rows.push({
      projectId,
      projectName,
      date,
      periodType: 'Daily',
      sessions,
      orders,
      revenue: Math.round(revenue * 100) / 100,
      conversionRate: Math.round(cr * 100) / 100,
      aov: Math.round(aov * 100) / 100,
      crVsBaseline: Math.round(((cr - baselineCR) / baselineCR) * 10000) / 100,
      aovVsBaseline: Math.round(((aov - baselineAOV) / baselineAOV) * 10000) / 100,
    })
  }
  return rows
}

export const mockProjectData: ProjectDataRow[] = [
  // fd-26 — Active, pre-launch baseline Jun 11-18, live Jun 19-21
  {
    projectId: 'fd-26',
    projectName: 'Fathers Day Sale 2026',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 9800,
    orders: 232,
    revenue: 232 * 73.01,
    conversionRate: 2.37,
    aov: 73.01,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Pre-launch baseline Jun 11–18',
  },
  ...makeProjectDataRows('fd-26', 'Fathers Day Sale 2026', '2026-06-19', 3, 2.37, 73.01, 9800, 3.8, 4.5),

  // skoff — Completed, live May 19-26
  {
    projectId: 'skoff',
    projectName: 'Summer Kickoff',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 11200,
    orders: 622,
    revenue: 622 * 83.14,
    conversionRate: 5.55,
    aov: 83.14,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Same-period store CR baseline',
  },
  ...makeProjectDataRows('skoff', 'Summer Kickoff', '2026-05-19', 8, 5.55, 83.14, 11200, 5.1, 6.5),

  // md-26 — Completed, live May 7-11
  {
    projectId: 'md-26',
    projectName: 'Mothers Day Sale 2026',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 8600,
    orders: 165,
    revenue: 165 * 71.40,
    conversionRate: 1.92,
    aov: 71.40,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Same-period store CR baseline',
  },
  ...makeProjectDataRows('md-26', 'Mothers Day Sale 2026', '2026-05-07', 5, 1.92, 71.40, 8600, 4.8, 7.2),
]

// ---------------------------------------------------------------------------
// Page Analytics
// ---------------------------------------------------------------------------
function makePageAnalyticsRows(
  projectId: string,
  projectName: string,
  pageLabel: string,
  pageUrl: string,
  startDate: string,
  days: number,
  benchmarkSessions: number,
  benchmarkCR: number,
): PageAnalyticsRow[] {
  const rows: PageAnalyticsRow[] = []
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    const s = seededRand(date, i + projectId.length + 7)
    const sessions = Math.round(benchmarkSessions * (0.8 + s * 0.6))
    const sessionsVsBenchmark = Math.round(((sessions - benchmarkSessions) / benchmarkSessions) * 10000) / 100
    const cr = benchmarkCR * (0.95 + s * 0.3)
    const crVsBenchmark = Math.round(((cr - benchmarkCR) / benchmarkCR) * 10000) / 100
    const purchases = Math.round(sessions * cr / 100)
    rows.push({
      projectId, projectName, pageLabel, pageUrl, date,
      periodType: 'Daily',
      sessions,
      benchmarkSessions,
      sessionsVsBenchmark,
      purchases,
      conversionRate: Math.round(cr * 100) / 100,
      benchmarkCR,
      crVsBenchmark,
    })
  }
  return rows
}

export const mockPageAnalytics: PageAnalyticsRow[] = [
  // cfw-g — Evergreen, launched May 18, still running
  {
    projectId: 'cfw-g',
    projectName: 'Creatine Women - Gym',
    pageLabel: 'Gym',
    pageUrl: 'https://nutricost.com/pages/creatine-women-gym',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 180,
    benchmarkSessions: 180,
    sessionsVsBenchmark: 0,
    purchases: 3,
    conversionRate: 1.49,
    benchmarkCR: 1.49,
    crVsBenchmark: 0,
    notes: 'First valid tracking days baseline',
  },
  ...makePageAnalyticsRows('cfw-g', 'Creatine Women - Gym', 'Gym', 'https://nutricost.com/pages/creatine-women-gym', '2026-05-18', 40, 180, 1.49),

  // fd-26
  {
    projectId: 'fd-26',
    projectName: 'Fathers Day Sale 2026',
    pageLabel: 'Primary Landing Page',
    pageUrl: 'https://nutricost.com/pages/fathers-day-sale',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 9800,
    benchmarkSessions: 9800,
    sessionsVsBenchmark: 0,
    purchases: 232,
    conversionRate: 2.37,
    benchmarkCR: 2.37,
    crVsBenchmark: 0,
    notes: 'Same-period store CR baseline',
  },
  ...makePageAnalyticsRows('fd-26', 'Fathers Day Sale 2026', 'Primary Landing Page', 'https://nutricost.com/pages/fathers-day-sale', '2026-06-19', 3, 9800, 2.37),

  // skoff — Completed
  {
    projectId: 'skoff',
    projectName: 'Summer Kickoff',
    pageLabel: 'Primary Landing Page',
    pageUrl: 'https://nutricost.com/pages/summer-kickoff',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 11200,
    benchmarkSessions: 11200,
    sessionsVsBenchmark: 0,
    purchases: 622,
    conversionRate: 5.55,
    benchmarkCR: 5.55,
    crVsBenchmark: 0,
  },
  ...makePageAnalyticsRows('skoff', 'Summer Kickoff', 'Primary Landing Page', 'https://nutricost.com/pages/summer-kickoff', '2026-05-19', 8, 11200, 5.55),

  // md-26 — Completed
  {
    projectId: 'md-26',
    projectName: 'Mothers Day Sale 2026',
    pageLabel: 'Primary LP',
    pageUrl: 'https://nutricost.com/pages/mothers-day-sale',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 8600,
    benchmarkSessions: 8600,
    sessionsVsBenchmark: 0,
    purchases: 165,
    conversionRate: 1.92,
    benchmarkCR: 1.92,
    crVsBenchmark: 0,
  },
  ...makePageAnalyticsRows('md-26', 'Mothers Day Sale 2026', 'Primary LP', 'https://nutricost.com/pages/mothers-day-sale', '2026-05-07', 5, 8600, 1.92),

  // pre-workout — Completed, very small
  {
    projectId: 'pre-workout',
    projectName: 'Pre-Workout Sale',
    pageLabel: 'Primary Landing Page',
    pageUrl: 'https://nutricost.com/pages/pre-workout-sale',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 460,
    benchmarkSessions: 460,
    sessionsVsBenchmark: 0,
    purchases: 9,
    conversionRate: 1.86,
    benchmarkCR: 1.86,
    crVsBenchmark: 0,
  },
  ...makePageAnalyticsRows('pre-workout', 'Pre-Workout Sale', 'Primary Landing Page', 'https://nutricost.com/pages/pre-workout-sale', '2026-05-10', 3, 460, 1.86),
]

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export const mockSettings: AppSettings = {
  shopifyStoreDomain: 'store.com',
  shopifyApiVersion: '2024-01',
  timezone: 'America/Denver',
  weeklyRollupDay: 'Sunday',
  alertEmail: 'test@test.com',
  crDropAlertThreshold: '-10',
  defaultBaselineDays: 30,
  trackerYear: 2026,
  dailyAutomationEnabled: false,
}
