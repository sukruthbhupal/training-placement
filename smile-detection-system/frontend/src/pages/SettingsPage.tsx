export const SettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold">Settings</h1>
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-slate-400">Theme, detection preferences, and account controls are available here.</p>
      <div className="mt-4 flex gap-3">
        <button className="rounded-full bg-white px-6 py-3 font-medium text-slate-950">Save Preferences</button>
        <button className="rounded-full border border-white/10 px-6 py-3 font-medium">Reset</button>
      </div>
    </div>
  </div>
)
