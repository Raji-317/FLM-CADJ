import { useState } from "react";
import RegistrationModal from "../../../components/RegistrationModal";

interface FormContentProps {
  onLogin: (email: string, type: 'teacher' | 'admin') => void;
}

export const FormContent = ({ onLogin }: FormContentProps) => {

  const [activeTab, setActiveTab] = useState<'teacher' | 'admin'>('teacher');
  const [email, setEmail] = useState('teacher@edu.com');
  const [password, setPassword] = useState('Teach@UniSync#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // OTP login states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpHint, setOtpHint] = useState('');

  const handleTabChange = (tab: 'teacher' | 'admin') => {
    setActiveTab(tab);
    if (tab === 'teacher') {
      setEmail('teacher@edu.com');
      setPassword('Teach@UniSync#2026');
    } else {
      setEmail('admin@edu.com');
      setPassword('Admin@UniSync#2026');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresOtp) {
          alert("Your registration was approved by admin! An OTP verification code is required.");
          if (data.otpCode) {
            setOtp(data.otpCode);
            setOtpHint(data.otpCode);
          }
          setShowOtpInput(true);
        } else {
          // Verify role matches selected tab
          if (data.user.role !== activeTab) {
            const roleName = data.user.role === 'admin' ? 'Administrator' : 'Teacher';
            const proceed = window.confirm(
              `⚠️ Role Notice: You selected the '${activeTab.toUpperCase()}' tab, but this account (${data.user.email}) is an ${roleName} account.\n\nClick OK to continue as ${roleName}, or Cancel to switch tabs.`
            );
            if (!proceed) {
              setIsLoading(false);
              return;
            }
          }
          alert(`Login successful as ${data.user.role.toUpperCase()} ✅`);
          onLogin(data.user.email, data.user.role);
        }
      } else {
        alert(data.message || "Invalid credentials");
      }

    } catch (error) {
      console.error(error);
      alert("Server error while logging in");
    }

    setIsLoading(false);
  };

  const handleVerifyOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-approved-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Verification successful! Login successful ✅");
        onLogin(data.user.email, data.user.role);
      } else {
        alert(data.message || "Invalid OTP code");
      }

    } catch (error) {
      console.error(error);
      alert("Server error while verifying OTP");
    }

    setIsLoading(false);
  };

  return (
    <div className="box-border caret-transparent outline-[oklab(0.708_0_0_/_0.5)] pb-6 px-6">

      {showOtpInput ? (
        <form onSubmit={handleVerifyOtpAndLogin} className="box-border caret-transparent gap-x-2 flex flex-col outline-[oklab(0.708_0_0_/_0.5)] gap-y-2">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-blue-600">Verification Required</h3>
            <p className="text-xs text-gray-500 mt-1">Please enter the 6-digit OTP code sent to your phone</p>
            {otpHint && (
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-1.5 mt-2">
                Demo OTP Code: <strong>{otpHint}</strong>
              </p>
            )}
          </div>

          <label>OTP Code</label>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="bg-gray-100 h-11 w-full rounded-lg px-3 text-center tracking-widest text-lg font-bold"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white h-11 rounded-lg mt-4"
          >
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowOtpInput(false);
              setOtp('');
            }}
            className="mt-2 text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Back to Password Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="box-border caret-transparent gap-x-2 flex flex-col outline-[oklab(0.708_0_0_/_0.5)] gap-y-2">

          <div
            role="tablist"
            className="text-gray-500 items-center bg-gray-200 grid grid-cols-2 h-9 w-full mb-6 p-[3px] rounded-[14px]"
          >

            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              className={`${activeTab === 'teacher' ? 'bg-white font-bold text-blue-600 shadow-sm' : ''} rounded-[14px] transition-all`}
            >
              Teacher
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`${activeTab === 'admin' ? 'bg-white font-bold text-blue-600 shadow-sm' : ''} rounded-[14px] transition-all`}
            >
              Admin
            </button>

          </div>

          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-2 rounded border border-blue-200 flex-1 transition-colors"
            >
              👤 Fill Teacher Demo
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 py-1 px-2 rounded border border-purple-200 flex-1 transition-colors"
            >
              🛡️ Fill Admin Demo
            </button>
          </div>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-100 h-11 w-full rounded-lg px-3"
          />

          <label>Password</label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              data-lpignore="true"
              className="bg-gray-100 h-11 w-full rounded-lg px-3"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              👁
            </button>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white h-11 rounded-lg mt-4 font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-3 text-sm">
            <span className="text-gray-500">Need an account?</span>
            <button
              type="button"
              onClick={() => setIsRegistrationOpen(true)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>

        </form>
      )}

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        defaultRole={activeTab}
        onSuccess={(registeredEmail, registeredPassword, role) => {
          setEmail(registeredEmail);
          if (registeredPassword) setPassword(registeredPassword);
          if (role) setActiveTab(role);
          setIsRegistrationOpen(false);
        }}
      />

    </div>
  );
};