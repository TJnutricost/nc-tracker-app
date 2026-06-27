import type { Project, ProjectDataRow, PageAnalyticsRow, NutricostDailyRow, AppSettings } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'SKOFF',
    name: 'Skincare Off Page',
    status: 'Active',
    projectType: 'New Sale Page',
    pageUrl: '/pages/skincare-sale',
    launchDate: '2026-02-01',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: '30-day pre-launch avg',
    pageBenchmarkSource: 'Jan 2026 avg',
    baselineCalculated: 'Yes',
    notes: 'Targeting skincare bundle buyers',
  },
  {
    id: 'CFW-G',
    name: 'Creatine For Women - General',
    status: 'Active',
    projectType: 'Evergreen / Ongoing Page',
    pageUrl: '/pages/creatine-for-women',
    launchDate: '2026-01-15',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: 'Dec 2025 avg',
    pageBenchmarkSource: 'Dec 2025 avg',
    baselineCalculated: 'Yes',
    notes: 'Evergreen women creatine page',
  },
  {
    id: 'HP-REVAMP',
    name: 'Homepage Revamp',
    status: 'Active',
    projectType: 'Existing Page Revamp',
    pageUrl: '/',
    launchDate: '2026-03-10',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'Yes',
    projectDataBenchmarkSource: '30-day pre-launch avg',
    pageBenchmarkSource: 'Feb 2026 avg',
    baselineCalculated: 'Yes',
    notes: 'Full homepage redesign',
  },
  {
    id: 'BOGO-25',
    name: 'BOGO 25% Off Event',
    status: 'Completed',
    projectType: 'New Sale Page',
    pageUrl: '/pages/bogo-25',
    launchDate: '2026-01-01',
    endDate: '2026-01-31',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'No',
    projectDataBenchmarkSource: 'Dec 2025 avg',
    pageBenchmarkSource: '',
    baselineCalculated: 'Yes',
    notes: 'Jan BOGO promotion',
  },
  {
    id: 'PROMO-Q2',
    name: 'Q2 Sitewide Promo',
    status: 'Planned',
    projectType: 'Sitewide Sale Only',
    launchDate: '2026-07-01',
    projectDataTracking: 'Yes',
    pageAnalyticsTracking: 'No',
    projectDataBenchmarkSource: 'TBD',
    pageBenchmarkSource: '',
    baselineCalculated: 'No',
    notes: 'Planned Q2 promotion',
  },
]

// Generate dates array from 2026-01-01 for 60 days
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr)
  const day = d.getDay()
  return day === 0 || day === 6
}

// Seed-like deterministic variation using date string
function seededRand(dateStr: string, offset: number): number {
  const hash = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + offset
  return (hash % 100) / 100
}

export const mockNutricostDaily: NutricostDailyRow[] = (() => {
  const rows: NutricostDailyRow[] = []
  const start = '2026-01-01'
  for (let i = 0; i < 60; i++) {
    const date = addDays(start, i)
    const weekend = isWeekend(date)
    const s = seededRand(date, i)
    const orders = Math.round(weekend ? rand(180, 260) : rand(240, 350)) + Math.round(s * 40)
    const aov = rand(140, 180) + s * 20
    const revenue = orders * aov
    const sessions = Math.round(weekend ? rand(7000, 10000) : rand(9000, 15000)) + Math.round(s * 1000)
    const conversionRate = (orders / sessions) * 100
    rows.push({
      date,
      periodType: 'Daily',
      orders,
      revenue: Math.round(revenue * 100) / 100,
      sessions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      aov: Math.round(aov * 100) / 100,
      totalSalesExclTikTok: Math.round(revenue * 0.92 * 100) / 100,
      lyOrders: Math.round(orders * (0.82 + s * 0.06)),
      lyRevenue: Math.round(revenue * (0.82 + s * 0.06) * 100) / 100,
      lyConversionRate: Math.round(conversionRate * (0.88 + s * 0.06) * 100) / 100,
    })
  }
  return rows
})()

// ---- SKOFF Project Data ----
const skoffBaselineCR = 3.2
const skoffBaselineAOV = 152
const skoffBaselineSessions = 1800
const skoffBaselineOrders = Math.round(skoffBaselineSessions * skoffBaselineCR / 100)
const skoffBaselineRevenue = skoffBaselineOrders * skoffBaselineAOV

const skoffBaseline: ProjectDataRow = {
  projectId: 'SKOFF',
  projectName: 'Skincare Off Page',
  date: 'BASELINE',
  periodType: 'Baseline',
  sessions: skoffBaselineSessions,
  orders: skoffBaselineOrders,
  revenue: skoffBaselineRevenue,
  conversionRate: skoffBaselineCR,
  aov: skoffBaselineAOV,
  crVsBaseline: 0,
  aovVsBaseline: 0,
  notes: 'Jan 2026 30-day pre-launch avg',
}

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
    const crVsBaseline = ((cr - baselineCR) / baselineCR) * 100
    const aovVsBaseline = ((aov - baselineAOV) / baselineAOV) * 100
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
      crVsBaseline: Math.round(crVsBaseline * 100) / 100,
      aovVsBaseline: Math.round(aovVsBaseline * 100) / 100,
    })
  }
  return rows
}

export const mockProjectData: ProjectDataRow[] = [
  skoffBaseline,
  ...makeProjectDataRows('SKOFF', 'Skincare Off Page', '2026-02-01', 30, skoffBaselineCR, skoffBaselineAOV, skoffBaselineSessions, 3.5, 4.1),

  {
    projectId: 'CFW-G',
    projectName: 'Creatine For Women - General',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 2200,
    orders: Math.round(2200 * 2.8 / 100),
    revenue: Math.round(2200 * 2.8 / 100) * 148,
    conversionRate: 2.8,
    aov: 148,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Dec 2025 avg',
  },
  ...makeProjectDataRows('CFW-G', 'Creatine For Women - General', '2026-01-15', 30, 2.8, 148, 2200, 2.9, 3.4),

  {
    projectId: 'HP-REVAMP',
    projectName: 'Homepage Revamp',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 12000,
    orders: Math.round(12000 * 2.1 / 100),
    revenue: Math.round(12000 * 2.1 / 100) * 162,
    conversionRate: 2.1,
    aov: 162,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Feb 2026 30-day avg',
  },
  ...makeProjectDataRows('HP-REVAMP', 'Homepage Revamp', '2026-03-10', 30, 2.1, 162, 12000, 2.2, 2.7),

  {
    projectId: 'BOGO-25',
    projectName: 'BOGO 25% Off Event',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 9500,
    orders: 285,
    revenue: 285 * 155,
    conversionRate: 3.0,
    aov: 155,
    crVsBaseline: 0,
    aovVsBaseline: 0,
    notes: 'Dec 2025 avg',
  },
  ...makeProjectDataRows('BOGO-25', 'BOGO 25% Off Event', '2026-01-01', 31, 3.0, 155, 9500, 3.8, 5.2),
]

// ---- Page Analytics ----
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
    const sessionsVsBenchmark = ((sessions - benchmarkSessions) / benchmarkSessions) * 100
    const cr = benchmarkCR * (0.95 + s * 0.3)
    const crVsBenchmark = ((cr - benchmarkCR) / benchmarkCR) * 100
    const purchases = Math.round(sessions * cr / 100)
    rows.push({
      projectId,
      projectName,
      pageLabel,
      pageUrl,
      date,
      periodType: 'Daily',
      sessions,
      benchmarkSessions,
      sessionsVsBenchmark: Math.round(sessionsVsBenchmark * 100) / 100,
      purchases,
      conversionRate: Math.round(cr * 100) / 100,
      benchmarkCR,
      crVsBenchmark: Math.round(crVsBenchmark * 100) / 100,
    })
  }
  return rows
}

export const mockPageAnalytics: PageAnalyticsRow[] = [
  {
    projectId: 'SKOFF',
    projectName: 'Skincare Off Page',
    pageLabel: 'Skincare Sale Page',
    pageUrl: '/pages/skincare-sale',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 1600,
    benchmarkSessions: 1600,
    sessionsVsBenchmark: 0,
    purchases: 51,
    conversionRate: 3.2,
    benchmarkCR: 3.2,
    crVsBenchmark: 0,
    notes: 'Jan 2026 baseline',
  },
  ...makePageAnalyticsRows('SKOFF', 'Skincare Off Page', 'Skincare Sale Page', '/pages/skincare-sale', '2026-02-01', 30, 1600, 3.2),

  {
    projectId: 'CFW-G',
    projectName: 'Creatine For Women - General',
    pageLabel: 'Creatine For Women',
    pageUrl: '/pages/creatine-for-women',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 2000,
    benchmarkSessions: 2000,
    sessionsVsBenchmark: 0,
    purchases: 56,
    conversionRate: 2.8,
    benchmarkCR: 2.8,
    crVsBenchmark: 0,
    notes: 'Dec 2025 baseline',
  },
  ...makePageAnalyticsRows('CFW-G', 'Creatine For Women - General', 'Creatine For Women', '/pages/creatine-for-women', '2026-01-15', 30, 2000, 2.8),

  {
    projectId: 'HP-REVAMP',
    projectName: 'Homepage Revamp',
    pageLabel: 'Homepage',
    pageUrl: '/',
    date: 'BASELINE',
    periodType: 'Baseline',
    sessions: 11000,
    benchmarkSessions: 11000,
    sessionsVsBenchmark: 0,
    purchases: 231,
    conversionRate: 2.1,
    benchmarkCR: 2.1,
    crVsBenchmark: 0,
    notes: 'Feb 2026 baseline',
  },
  ...makePageAnalyticsRows('HP-REVAMP', 'Homepage Revamp', 'Homepage', '/', '2026-03-10', 30, 11000, 2.1),
]

export const mockSettings: AppSettings = {
  shopifyStoreDomain: 'nutricost.myshopify.com',
  shopifyApiVersion: '2024-01',
  timezone: 'America/Denver',
  weeklyRollupDay: 'Monday',
  alertEmail: 'trevin.jared@nutricost.com',
  crDropAlertThreshold: '-10',
  defaultBaselineDays: 30,
  trackerYear: 2026,
  dailyAutomationEnabled: false,
}
