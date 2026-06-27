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
  baselineCalculated: 'Yes' | 'No';
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

export interface NutricostDailyRow {
  date: string;
  periodType: 'Daily' | 'Weekly' | 'Monthly';
  orders: number;
  revenue: number;
  sessions: number;
  conversionRate: number;
  aov: number;
  totalSalesExclTikTok?: number;
  lyOrders?: number;
  lyRevenue?: number;
  lyConversionRate?: number;
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
