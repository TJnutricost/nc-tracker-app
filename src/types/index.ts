export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Planned' | 'Paused' | 'Inactive' | 'Archived';
  projectType: 'New Sale Page' | 'Existing Page Revamp' | 'Evergreen / Ongoing Page' | 'Sitewide Sale Only';
  pageUrl?: string;
  launchDate?: string;
  endDate?: string;
  projectDataTracking: 'Yes' | 'No';
  pageAnalyticsTracking: 'Yes' | 'No';
  projectDataBenchmarkSource: string;
  pageBenchmarkSource: string;
  baselineCalculated: 'Yes' | 'No' | 'Not Required';
  notes?: string;
}

export interface ProjectDataRow {
  projectId: string;
  projectName: string;
  date: string;
  periodType: 'Baseline' | 'Daily' | 'Weekly' | 'Monthly' | 'Current Avg';
  sessions?: number;
  orders?: number;
  revenue?: number;
  conversionRate?: number;
  aov?: number;
  crVsBaseline?: number;
  aovVsBaseline?: number;
  notes?: string;
}

export interface PageAnalyticsRow {
  projectId: string;
  projectName: string;
  pageLabel: string;
  pageUrl: string;
  date: string;
  periodType: 'Daily' | 'Weekly' | 'Monthly' | 'Baseline';
  sessions?: number;
  benchmarkSessions?: number;
  sessionsVsBenchmark?: number;
  purchases?: number;
  conversionRate?: number;
  benchmarkCR?: number;
  crVsBenchmark?: number;
  notes?: string;
}

// Raw daily rows — one per day with full YoY comparison columns
export interface NutricostDailyRow {
  date: string;
  periodType: 'Daily';
  orders: number;
  lyOrders: number;
  ordersChangePct: number;
  revenue: number;          // Total Sales
  lyRevenue: number;
  revenueChangePct: number;
  sessions: number;
  lySessions: number;
  sessionsChangePct: number;
  conversionRate: number;   // CR %
  lyConversionRate: number;
  crChangePct: number;
  aov: number;
  lyAov: number;
  aovChangePct: number;
  totalSalesExclTikTok?: number;
  notes?: string;
}

// Summary period rows: YTD Totals, YTD Daily Avg, Latest Daily, Current Week, Current Month
export interface NutricostPeriodRow {
  sectionLabel: string;   // e.g. "YTD TOTALS"
  period: string;         // e.g. "2026-01-01 to 2026-06-26"
  lyPeriod: string;       // e.g. "2025-01-01 to 2025-06-26"
  orders: number;
  lyOrders: number;
  ordersChangePct: number;
  revenue: number;
  lyRevenue: number;
  revenueChangePct: number;
  sessions: number;
  lySessions: number;
  sessionsChangePct: number;
  cr: number;
  lyCr: number;
  crChangePct: number;
  aov: number;
  lyAov: number;
  aovChangePct: number;
}

// Monthly and weekly comparison table rows
export interface NutricostComparisonRow {
  periodLabel: string;    // "Jun 2026" | "Jun 22 – Jun 26"
  lyPeriodLabel: string;  // "Jun 2025" | "Jun 22 – Jun 26 LY"
  orders: number;
  lyOrders: number;
  ordersChangePct: number;
  revenue: number;
  lyRevenue: number;
  revenueChangePct: number;
  sessions: number;
  lySessions: number;
  sessionsChangePct: number;
  cr: number;
  lyCr: number;
  crChangePct: number;
  aov: number;
  lyAov: number;
  aovChangePct: number;
}

export interface AppSettings {
  shopifyStoreDomain: string;
  shopifyApiVersion: string;
  timezone: string;
  weeklyRollupDay: string;
  alertEmail: string;
  crDropAlertThreshold: string;
  defaultBaselineDays: number;
  trackerYear: number;
  dailyAutomationEnabled: boolean;
}
