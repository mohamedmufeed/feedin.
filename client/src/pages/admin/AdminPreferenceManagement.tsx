
import { toast } from "react-toastify"; 
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import _ from "lodash";
import { addPreference, getPreference, removePrefrence } from "../../service/admin/preferencesManagement";
import AdminSearchBar from "../../components/admin/AdminSearchbar";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface PreferenceType {
  _id?: string;
  name: string;
  createdAt: Date;
}

const PreferenceManagement = () => {
  const [preferences, setPreferences] = useState<PreferenceType[]>([]);
  const [preferenceInput, setPreferenceInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalPreferences] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const prevRequestRef = useRef<AbortController | null>(null);

  const fetchPreferences = async (page = 1, query = "") => {
    if (prevRequestRef.current) {
      prevRequestRef.current.abort();
    }

    const abortController = new AbortController();
    prevRequestRef.current = abortController;

    setLoading(true);
    try {

      const response = await getPreference(page, itemsPerPage, query, abortController.signal);
      if (prevRequestRef.current === abortController) {
        setPreferences(response.preferences);
        setTotalPreferences(response.totalPreferences);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error("Error fetching Preferences", error);
        toast.error("Failed to fetch Preferences");
      }
    } finally {
      if (prevRequestRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  const debouncedFetch = useCallback(
    _.debounce((page: number, query: string) => {
      fetchPreferences(page, query);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetch(currentPage, searchQuery);
    } else {
      fetchPreferences(currentPage, searchQuery);
    }
  }, [currentPage, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 1) setCurrentPage(1);
    debouncedFetch(1, query);
  };

  const addPreferenceToList = () => {
    const newPreferenceObj: PreferenceType = {
      name: preferenceInput.trim(),
      createdAt: new Date(),
    };

    const trimmedPreference = preferenceInput.trim();
    const isDuplicate = preferences.some(
      (preferences) => preferences.name.toLowerCase() === trimmedPreference.toLowerCase()
    );

    if (isDuplicate) {
      toast.error(`Preference "${trimmedPreference}" already exists.`);
      return;
    }

    setPreferences((prevPreferences) => [...prevPreferences, newPreferenceObj]);
    setPreferenceInput("");
  };

  const handleDelete = async (name: string, id: string) => {
    if (!id) return;
    try {
      const response = await removePrefrence(id);
      if (response) {
        setPreferences((prevPreferences) => prevPreferences.filter((Preference) => Preference.name !== name));
        if (preferences.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchPreferences(currentPage, searchQuery);
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error removing Preference", error.message);
      toast.error("Error removing Preference");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newPreferences = preferences.filter((preferences) => !preferences._id);

    if (newPreferences.length === 0) {
      toast.error("No new Preference to save.");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        preference: newPreferences.map((preferences) => preferences.name),
      };
      const response = await addPreference(requestData);
      if (response.preference) {
        fetchPreferences(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error in adding Preference:", error);
      toast.error("Error adding Preference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div
        className="bg-[#F6F6F6] flex-1 overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <AdminHeader heading="Preference Management" />
        <AdminSearchBar placeholder="Search Preferences..." onSearch={handleSearch} />
        <div className="p-9">
          <div className="bg-white p-7 rounded-lg shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">Existing Preferences</h2>
            {loading ? (
              <p className="text-center text-gray-600">Loading Preferences...</p>
            ) : !preferences || preferences.length === 0 ? (
              <p className="text-center text-gray-600">
                No Preferences found. Add a Preference to get started.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {preferences.map((preference, index) => (
                  <div
                    key={index}
                    className="bg-gray-600 text-white rounded-xl p-3 flex items-center space-x-3"
                  >
                    <p className="font-medium">{preference.name}</p>
                    <button onClick={() => handleDelete(preference.name, preference._id || "")}>
                      <IoClose className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-8 mb-8">
              <button
                className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, page) => (
                <button
                  key={page}
                  className={`p-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold ${currentPage === page + 1
                      ? "bg-gray-800 hover:bg-black text-white"
                      : "bg-gray-200"
                    }`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}

              <button
                className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <div className="bg-white p-7 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Preference</h2>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={preferenceInput}
                onChange={(e) => setPreferenceInput(e.target.value)}
                className="border p-2 w-full rounded-lg focus:outline-gray-500"
                placeholder="Enter Preference name"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  if (preferenceInput.trim()) {
                    addPreferenceToList();
                  } else if (preferences.length > 0) {
                    handleSubmit(e);
                  }
                }}
                className={`p-2 px-4 whitespace-nowrap rounded-lg text-white font-bold ${preferenceInput.trim() || preferences.length > 0
                    ? "bg-gray-700 hover:bg-black"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={!preferenceInput.trim() && preferences.length === 0}
              >
                {preferenceInput.trim() ? "Add Preference" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceManagement;