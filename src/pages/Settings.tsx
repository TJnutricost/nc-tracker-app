import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import { mockSettings } from '../data/mockData'
import type { AppSettings } from '../types'

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({ ...mockSettings })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function setField<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function inputClass() {
    return 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  }

  function labelClass() {
    return 'block text-sm font-medium text-gray-700 mb-1'
  }

  return (
    <div>
      <TopBar title="Settings" />
      <div className="p-6 max-w-2xl space-y-6">

        {/* Store Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass()}>Shopify Store Domain</label>
              <input
                type="text"
                value={settings.shopifyStoreDomain}
                onChange={e => setField('shopifyStoreDomain', e.target.value)}
                className={inputClass()}
                placeholder="yourstore.myshopify.com"
              />
            </div>
            <div>
              <label className={labelClass()}>Shopify API Version</label>
              <input
                type="text"
                value={settings.shopifyApiVersion}
                onChange={e => setField('shopifyApiVersion', e.target.value)}
                className={inputClass()}
                placeholder="2024-01"
              />
            </div>
            <div>
              <label className={labelClass()}>Timezone</label>
              <select
                value={settings.timezone}
                onChange={e => setField('timezone', e.target.value)}
                className={inputClass()}
              >
                {['America/Denver', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'UTC'].map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass()}>Weekly Rollup Day</label>
              <select
                value={settings.weeklyRollupDay}
                onChange={e => setField('weeklyRollupDay', e.target.value)}
                className={inputClass()}
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alerts & Automation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Automation</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass()}>Alert Email</label>
              <input
                type="email"
                value={settings.alertEmail}
                onChange={e => setField('alertEmail', e.target.value)}
                className={inputClass()}
              />
            </div>
            <div>
              <label className={labelClass()}>CR Drop Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.crDropAlertThreshold}
                onChange={e => setField('crDropAlertThreshold', e.target.value)}
                className={inputClass()}
                placeholder="-10"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when CR drops by this % vs baseline (e.g. -10 = -10%)</p>
            </div>
            <div>
              <label className={labelClass()}>Default Baseline Days</label>
              <input
                type="number"
                value={settings.defaultBaselineDays}
                onChange={e => setField('defaultBaselineDays', parseInt(e.target.value) || 30)}
                className={inputClass()}
                min={7}
                max={90}
              />
            </div>
            <div>
              <label className={labelClass()}>Tracker Year</label>
              <input
                type="number"
                value={settings.trackerYear}
                onChange={e => setField('trackerYear', parseInt(e.target.value) || 2026)}
                className={inputClass()}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Daily Automation</p>
                <p className="text-xs text-gray-500">Auto-pull Shopify + GA4 data each day</p>
              </div>
              <button
                onClick={() => setField('dailyAutomationEnabled', !settings.dailyAutomationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.dailyAutomationEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${settings.dailyAutomationEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle size={16} />
              Settings saved!
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
