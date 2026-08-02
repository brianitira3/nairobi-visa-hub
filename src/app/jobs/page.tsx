"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Briefcase, MapPin, DollarSign, Calendar, Save } from "lucide-react";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";

export default function JobsPage() {
  const { user, loading: userLoading, refreshUser, updateUser } = useUser();
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Job preferences form state
  const [jobPreferences, setJobPreferences] = useState({
    preferredCategory: '',
    preferredLocation: '',
    expectedSalary: '',
    experience: '',
    skills: '',
    availability: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const categories = ['all', 'Construction', 'Hospitality', 'Healthcare', 'Agriculture', 'Manufacturing', 'Other'];
  const locations = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'];
  const salaryRanges = ['KES 30,000 - 40,000', 'KES 40,000 - 50,000', 'KES 50,000 - 60,000', 'KES 60,000 - 70,000', 'KES 70,000+'];
  const experienceLevels = ['No experience', '1-2 years', '3-5 years', '5+ years'];
  const availabilityOptions = ['Immediate', 'Within 1 month', 'Within 3 months', 'Within 6 months'];

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user?.jobPreferences) {
      // Check if jobPreferences have meaningful data (not all empty)
      const hasMeaningfulData = 
        user.jobPreferences.preferredCategory ||
        user.jobPreferences.preferredLocation ||
        user.jobPreferences.expectedSalary ||
        user.jobPreferences.experience ||
        user.jobPreferences.skills?.length ||
        user.jobPreferences.availability ||
        user.jobPreferences.notes;
      
      if (hasMeaningfulData) {
        setSavedPreferences(user.jobPreferences);
        setIsEditMode(false);
      } else {
        setSavedPreferences(null);
        setIsEditMode(true);
      }
      
      setJobPreferences({
        preferredCategory: user.jobPreferences.preferredCategory || '',
        preferredLocation: user.jobPreferences.preferredLocation || '',
        expectedSalary: user.jobPreferences.expectedSalary || '',
        experience: user.jobPreferences.experience || '',
        skills: user.jobPreferences.skills?.join(', ') || '',
        availability: user.jobPreferences.availability || '',
        notes: user.jobPreferences.notes || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?category=${selectedCategory}`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs);
        } else {
          setError('Failed to load jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCategory]);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        setError('Please login first');
        setIsSaving(false);
        return;
      }

      const skillsArray = jobPreferences.skills.split(',').map(s => s.trim()).filter(s => s);

      const payload = {
        nationalId,
        jobPreferences: {
          ...jobPreferences,
          skills: skillsArray
        }
      };

      const response = await fetch('/api/job-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        await refreshUser();
        setSavedPreferences(responseData.jobPreferences);
        setIsEditMode(false);
        setSuccess('Job preferences saved successfully!');
      } else {
        setError(responseData.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePreferences = async () => {
    if (!confirm('Are you sure you want to delete your job preferences?')) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        setError('Please login first');
        setIsSaving(false);
        return;
      }

      const response = await fetch('/api/job-preferences', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });

      if (response.ok) {
        await refreshUser();
        setSavedPreferences(null);
        setJobPreferences({
          preferredCategory: '',
          preferredLocation: '',
          expectedSalary: '',
          experience: '',
          skills: '',
          availability: '',
          notes: ''
        });
        setSuccess('Job preferences deleted successfully!');
      } else {
        setError('Failed to delete preferences');
      }
    } catch (error) {
      console.error('Error deleting preferences:', error);
      setError('Failed to delete preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isMobile === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600 text-center p-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Mobile Only</h1>
          <p>This page is designed for mobile devices only.</p>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="min-h-screen pb-24 no-scrollbar relative z-10" style={{
        backgroundColor: '#F0E6D6',
        backgroundImage: `
          linear-gradient(135deg, #F0E6D6 0%, #E8DCC5 50%, #E0D4BC 100%),
          radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)
        `
      }}>
      <LeatherBadge />
      {/* Header */}
      <div className="border-b-4 border-amber-900 bg-amber-100 relative" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.05) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.05) 50%, rgba(139, 69, 19, 0.05) 75%, transparent 75%, transparent)',
        backgroundSize: '4px 4px'
      }}>
        <div className="absolute inset-0 border-b-2 border-dashed border-amber-700" style={{ bottom: '6px' }}></div>
        <div className="flex items-center justify-center px-4 py-3 relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-800"></div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-800"></div>
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Job Preferences</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {error && (
          <div className="mb-4 bg-red-50/50 p-3 rounded-lg border-2 border-red-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-red-700 rounded-lg pointer-events-none"></div>
            <p className="text-sm font-serif text-red-900 relative z-10 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50/50 p-3 rounded-lg border-2 border-green-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
            <p className="text-sm font-serif text-green-900 relative z-10 font-medium">{success}</p>
          </div>
        )}

        {/* Job Preferences Form */}
        <div className="mb-8 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 border-b-2 border-dashed border-amber-700 pb-2 relative z-10">
            <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              Your Job Preferences
            </h2>
            {savedPreferences && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-xs font-serif text-amber-800 hover:text-amber-900 font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {/* Read-only view when preferences exist */}
          {savedPreferences && !isEditMode ? (
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Preferred Category:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.preferredCategory || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Preferred Location:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.preferredLocation || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Expected Salary:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.expectedSalary || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Experience Level:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.experience || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Skills:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.skills?.join(', ') || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-xs font-serif text-amber-900 font-medium">Availability:</span>
                <span className="text-xs font-serif font-bold text-amber-900">{savedPreferences.availability || '---'}</span>
              </div>
              {savedPreferences.notes && (
                <div className="py-2 border-b border-dashed border-amber-700/50">
                  <span className="text-xs font-serif text-amber-900 font-medium block mb-1">Notes:</span>
                  <span className="text-xs font-serif text-amber-900">{savedPreferences.notes}</span>
                </div>
              )}
              <button
                onClick={handleDeletePreferences}
                disabled={isSaving}
                className="w-full border-2 border-red-800 bg-red-800 px-4 py-2 text-xs font-serif font-bold text-red-50 hover:bg-red-700 focus:outline-none focus:border-red-600 disabled:bg-red-600 disabled:cursor-not-allowed transition-colors mt-4 relative"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
                  backgroundSize: '4px 4px'
                }}
              >
                {isSaving ? "Deleting..." : "Delete Preferences"}
              </button>
            </div>
          ) : (
            /* Edit form */
            <div className="space-y-3 relative z-10">
              {/* Preferred Category */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Preferred Category</label>
                <select
                  value={jobPreferences.preferredCategory}
                  onChange={(e) => setJobPreferences({...jobPreferences, preferredCategory: e.target.value})}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Location */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Preferred Location</label>
                <select
                  value={jobPreferences.preferredLocation}
                  onChange={(e) => setJobPreferences({...jobPreferences, preferredLocation: e.target.value})}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Expected Salary Range</label>
                <select
                  value={jobPreferences.expectedSalary}
                  onChange={(e) => setJobPreferences({...jobPreferences, expectedSalary: e.target.value})}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                >
                  <option value="">Select salary range</option>
                  {salaryRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Experience Level</label>
                <select
                  value={jobPreferences.experience}
                  onChange={(e) => setJobPreferences({...jobPreferences, experience: e.target.value})}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={jobPreferences.skills}
                  onChange={(e) => setJobPreferences({...jobPreferences, skills: e.target.value})}
                  placeholder="e.g., caregiving, cooking, cleaning"
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 placeholder-amber-700 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Availability</label>
                <select
                  value={jobPreferences.availability}
                  onChange={(e) => setJobPreferences({...jobPreferences, availability: e.target.value})}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:border-amber-600"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                >
                  <option value="">Select availability</option>
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Additional Notes</label>
                <textarea
                  value={jobPreferences.notes}
                  onChange={(e) => setJobPreferences({...jobPreferences, notes: e.target.value})}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 placeholder-amber-700 focus:outline-none focus:border-amber-600 resize-none"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                    backgroundSize: '8px 8px'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="w-full border-2 border-amber-800 bg-amber-800 px-4 py-3 text-sm font-serif font-bold text-amber-50 hover:bg-amber-700 focus:outline-none focus:border-amber-600 disabled:bg-amber-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
                  backgroundSize: '4px 4px'
                }}
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Preferences"}
              </button>

              {/* Cancel button if editing */}
              {savedPreferences && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setJobPreferences({
                      preferredCategory: savedPreferences.preferredCategory || '',
                      preferredLocation: savedPreferences.preferredLocation || '',
                      expectedSalary: savedPreferences.expectedSalary || '',
                      experience: savedPreferences.experience || '',
                      skills: savedPreferences.skills?.join(', ') || '',
                      availability: savedPreferences.availability || '',
                      notes: savedPreferences.notes || ''
                    });
                  }}
                  className="w-full border-2 border-amber-800 bg-amber-50 px-4 py-2 text-sm font-serif font-semibold text-amber-900 hover:bg-amber-100 focus:outline-none focus:border-amber-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Available Jobs Section */}
        <div>
          <h2 className="mb-4 text-sm font-serif font-semibold text-amber-900 uppercase tracking-wider border-b-2 border-amber-800 pb-2">
            Available Jobs
          </h2>

          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-serif font-semibold text-amber-900">Filter by Category</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs font-serif border-2 whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'border-amber-800 bg-amber-800 text-amber-50'
                      : 'border-amber-800 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-sm font-serif text-amber-900">Loading jobs...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm font-serif text-amber-900">No jobs available in this category</div>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="border-2 border-amber-800 bg-amber-50 p-3 cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-serif font-semibold text-amber-900 flex-1">{job.title}</h3>
                    <span className="text-xs font-serif text-amber-700 ml-2">{job.category}</span>
                  </div>
                  
                  <div className="space-y-1 text-xs font-serif text-amber-900">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={12} />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-amber-800/30">
                    <p className="text-xs font-serif text-amber-700 line-clamp-2">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
    </>
  );
}
