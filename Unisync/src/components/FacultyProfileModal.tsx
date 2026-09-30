import { useState, useEffect } from "react";

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  status: 'active' | 'on_leave' | 'substitute' | 'pending';
  leaveType?: string;
  leaveStart?: string;
  leaveEnd?: string;
  classesAssigned: number;
  classesAdjusted: number;
  phone: string;
  joinDate: string;
  address?: string;
  specialization?: string;
  qualifications?: string;
  experience?: string;
  emergencyContact?: string;
  salary?: string;
  role?: string;
}

interface FacultyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyMember | null;
  mode: 'view' | 'edit';
  onSave?: (updatedFaculty: FacultyMember) => void;
  onDelete?: (email: string) => void;
}

export const FacultyProfileModal = ({ isOpen, onClose, faculty, mode, onSave, onDelete }: FacultyProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState<FacultyMember | null>(faculty);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Synchronize formData whenever faculty prop changes or modal opens
  useEffect(() => {
    if (faculty) {
      setFormData({ ...faculty });
    }
  }, [faculty, isOpen]);

  // ✅ Synchronize edit mode when mode prop changes
  useEffect(() => {
    setIsEditing(mode === 'edit');
  }, [mode, isOpen]);

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Economics',
    'Psychology',
    'Engineering'
  ];

  const handleSave = async () => {
    if (!formData || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData || !onDelete) return;
    const confirmDelete = window.confirm(
      `⚠️ Confirm Deletion:\n\nAre you sure you want to permanently delete faculty member "${formData.name}" (${formData.email})?\n\nThis will remove their profile and records from the college database.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(formData.email);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      [e.target.name]: e.target.value
    }) : null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-red-100 text-red-800';
      case 'substitute':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !faculty || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[oklch(0.546_0.245_262.881)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{formData.name}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(formData.status)}`}>
                    {formData.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">{formData.department}</span>
                  <span className="text-sm text-gray-500">ID: {formData.employeeId}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {mode === 'view' && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-[oklch(0.546_0.245_262.881)] text-white rounded-lg hover:bg-[oklch(0.5_0.245_262.881)] transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name.split(' ')[0]}
                      onChange={(e) => {
                        const lastName = formData.name.split(' ').slice(1).join(' ');
                        handleChange({
                          ...e,
                          target: { ...e.target, name: 'name', value: `${e.target.value} ${lastName}` }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.name.split(' ')[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name.split(' ').slice(1).join(' ')}
                      onChange={(e) => {
                        const firstName = formData.name.split(' ')[0];
                        handleChange({
                          ...e,
                          target: { ...e.target, name: 'name', value: `${firstName} ${e.target.value}` }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.name.split(' ').slice(1).join(' ')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.address || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact || ''}
                    onChange={handleChange}
                    placeholder="Name and phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.emergencyContact || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <p className="text-gray-900">{formData.employeeId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <p className="text-gray-900">{formatDate(formData.joinDate)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    placeholder="e.g., 8 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.experience || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization || ''}
                    onChange={handleChange}
                    placeholder="e.g., Data Structures & Algorithms"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.specialization || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                {isEditing ? (
                  <textarea
                    name="qualifications"
                    value={formData.qualifications || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g., PhD in Computer Science, MSc in Software Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.qualifications || 'Not provided'}</p>
                )}
              </div>

              {/* Class Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Class Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Classes Assigned:</span>
                    <span className="ml-2 font-medium text-gray-900">{formData.classesAssigned}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Classes Adjusted:</span>
                    <span className="ml-2 font-medium text-orange-600">{formData.classesAdjusted}</span>
                  </div>
                </div>
              </div>

              {/* Leave Information */}
              {formData.status === 'on_leave' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-3">Current Leave</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-red-700">Type:</span>
                      <span className="ml-2 font-medium text-red-900">{formData.leaveType}</span>
                    </div>
                    <div>
                      <span className="text-red-700">Duration:</span>
                      <span className="ml-2 font-medium text-red-900">
                        {formatDate(formData.leaveStart!)} - {formatDate(formData.leaveEnd!)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 pt-6 border-t">
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
                  title="Delete faculty member who left the college"
                >
                  <span>🗑️</span>
                  <span>{isDeleting ? 'Deleting...' : 'Delete Faculty Member'}</span>
                </button>
              )}
              <div className="flex space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-[oklch(0.546_0.245_262.881)] text-white rounded-lg hover:bg-[oklch(0.5_0.245_262.881)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold shadow-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
