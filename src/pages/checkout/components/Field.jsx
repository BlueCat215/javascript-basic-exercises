export const inputClass =
  "w-full text-sm text-ink rounded border border-line py-3 px-3.5 focus:border-ink focus:ring-1 focus:ring-ink outline-none bg-white transition-colors";

export const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
      {label} {required && <span className="text-rust">*</span>}
    </label>
    {children}
    {error && <p className="text-rust text-[11px] mt-1.5">{error}</p>}
  </div>
);
