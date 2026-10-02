import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

interface ProfileViewProps {
  userEmail: string;
  userType: 'teacher' | 'admin';
}

export const ProfileView = ({ userEmail, userType }: ProfileViewProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/${userEmail}`);
        const data = await res.json();

        const defaultName = userEmail === 'teacher@edu.com' ? "Dhamini" : (userEmail ? userEmail.split('@')[0] : "Teacher");
        const defaultDept = "Computer Science";
        const defaultPhone = "+91 9876543210";
        const defaultAddress = "100 University Campus Road";

        if (!data) {
          setProfileData({
            email: userEmail,
            name: defaultName,
            department: defaultDept,
            phone: defaultPhone,
            address: defaultAddress,
            role: userType === 'admin' ? 'Administrator' : 'Teacher'
          });
        } else {
          setProfileData({
            ...data,
            name: data.name || defaultName,
            department: data.department || defaultDept,
            phone: data.phone || defaultPhone,
            address: data.address || defaultAddress,
            role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1)) : (userType === 'admin' ? 'Administrator' : 'Teacher')
          });
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
        // Fallback default data in case server fails
        setProfileData({
          email: userEmail,
          name: userEmail === 'teacher@edu.com' ? "Dhamini" : "Teacher",
          department: "Computer Science",
          phone: "+91 9876543210",
          address: "100 University Campus Road",
          role: userType === 'admin' ? 'Administrator' : 'Teacher'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail, userType]);

  // ✅ HANDLE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile saved successfully ✅");
        if (data.user) {
          setProfileData((prev: any) => ({
            ...prev,
            ...data.user
          }));
        }
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to save profile");
      }

    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const departments = [
    'Computer Science', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'English', 'History',
    'Economics', 'Psychology', 'Engineering'
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center text-sm text-gray-500">
        Loading profile information...
      </div>
    );
  }

  const initialLetter = profileData?.name ? profileData.name.trim().charAt(0).toUpperCase() : 'D';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="p-6">

          {/* AVATAR & BASIC DETAILS (MATCHES SCREENSHOT EXACTLY) */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-xs">
              {initialLetter}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {profileData?.name || "Dhamini"}
              </h3>
              <p className="text-sm text-gray-500 font-normal mt-0.5">
                {profileData?.role || (userType === 'admin' ? 'Administrator' : 'Teacher')}
              </p>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                {profileData?.department || "Computer Science"}
              </p>
            </div>
          </div>

          {/* FORM GRID (2-COLUMN LAYOUT MATCHING SCREENSHOT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

            {/* NAME */}
            <div>
              <label className="block text-sm text-gray-500 font-normal mb-1">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData?.name || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              ) : (
                <p className="text-sm text-gray-900 font-normal">
                  {profileData?.name || "Dhamini"}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm text-gray-500 font-normal mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  disabled
                  value={profileData?.email || userEmail}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              ) : (
                <p className="text-sm text-gray-900 font-normal">
                  {profileData?.email || userEmail}
                </p>
              )}
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm text-gray-500 font-normal mb-1">
                Department
              </label>
              {isEditing ? (
                <select
                  name="department"
                  value={profileData?.department || "Computer Science"}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-900 font-normal">
                  {profileData?.department || "Computer Science"}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm text-gray-500 font-normal mb-1">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profileData?.phone || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              ) : (
                <p className="text-sm text-gray-900 font-normal">
                  {profileData?.phone || "+91 9876543210"}
                </p>
              )}
            </div>

            {/* ADDRESS (UNDER DEPARTMENT ON LEFT COLUMN AS IN SCREENSHOT) */}
            <div>
              <label className="block text-sm text-gray-500 font-normal mb-1">
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profileData?.address || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              ) : (
                <p className="text-sm text-gray-900 font-normal">
                  {profileData?.address || "100 University Campus Road"}
                </p>
              )}
            </div>

          </div>

          {/* EDIT ACTIONS */}
          {isEditing && (
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
              >
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};