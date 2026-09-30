export const DemoCredentials = () => {
  return (
    <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl mt-4">
      <h3 className="text-blue-900 font-semibold text-sm mb-2 flex items-center gap-1.5">
        <span>🔑</span> Authentication & Demo Access
      </h3>
      <div className="text-xs text-gray-700 space-y-2">
        <div className="p-2.5 bg-white rounded-lg border border-blue-100">
          <p className="font-semibold text-blue-800 flex items-center justify-between">
            <span>👨‍🏫 Registered Faculty Members:</span>
            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">Live DB Auth</span>
          </p>
          <p className="text-[11px] text-gray-600 mt-1">
            Any faculty member with an active account in the database can sign in using their registered email & password.
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex flex-wrap gap-1 text-[11px] text-gray-500 font-mono">
            <span className="bg-gray-50 px-1.5 py-0.5 rounded border">teacher@edu.com</span>
            <span className="bg-gray-50 px-1.5 py-0.5 rounded border">harinadhv@edu.com</span>
            <span className="bg-gray-50 px-1.5 py-0.5 rounded border">pradeep@edu.com</span>
            <span className="bg-gray-50 px-1.5 py-0.5 rounded border">manisha@gmail.com</span>
          </div>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-purple-100">
          <p className="font-semibold text-purple-800 flex items-center justify-between">
            <span>🛡️ Quick Demo Credentials:</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono">Instant Fill</span>
          </p>
          <p className="mt-1 font-mono text-gray-800 text-[11px]">
            Teacher: <strong>teacher@edu.com</strong> / <strong>Teach@UniSync#2026</strong><br />
            Admin: <strong>admin@edu.com</strong> / <strong>Admin@UniSync#2026</strong>
          </p>
        </div>

        <p className="text-[11px] text-gray-500 italic text-center pt-1">
          💡 Click "Fill Teacher Demo" or "Fill Admin Demo" above to quickly try out either role.
        </p>
      </div>
    </div>
  );
};
