"use client";
import { useAuth } from "@/context/user";
import { Url } from "@/lib/types";
import { deleteDomain, updateDomain } from "@/services/domain";
import { createDomainUrl } from "@/services/url";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DomainCard({
  id,
  domain,
  urls,
  refetchDomains,
}: {
  id: number;
  domain: string;
  urls?: Url[];
  refetchDomains: () => void;
}) {
  const { token } = useAuth();
  const [expandedDomainId, setExpandedDomainId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDomain, setEditedDomain] = useState(domain);
  const [loading, setLoading] = useState(false);
  const [showSubpageModal, setShowSubpageModal] = useState(false); // State to control subpage modal visibility
  const [newSubpage, setNewSubpage] = useState(""); // State for the new subpage
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const toggleExpand = (id: number) => {
    setExpandedDomainId(expandedDomainId === id ? null : id);
  };

  const handleAddSubpage = async () => {
    try {
      if (!token) {
        toast.error("You must be logged in to add a subpage.");
        router.push("/login");
        return;
      }
      if (!newSubpage.trim()) {
        toast.error("Subpage URL cannot be empty.");
        return;
      }

      setLoading(true);
      console.log(`Adding subpage "${newSubpage}" to domain ID: ${id}`);
      await createDomainUrl(id, newSubpage, token);
      toast.success("Subpage added successfully!");

      setShowSubpageModal(false);
      setNewSubpage("");

      refetchDomains();
    } catch (error) {
      toast.error("Error adding subpage. Please try again.");
      console.error("Error adding subpage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      toast.error("You must be logged in to delete a domain.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const op = await deleteDomain(id, token);
      console.log("Domain deleted successfully:", op);
      toast.success("Domain deleted successfully!");

      // Trigger refetch after successful delete
      refetchDomains();
    } catch (error) {
      toast.error("Error deleting domain. Please try again.");
      console.error("Error deleting domain:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (updatedDomain: string) => {
    if (!token) {
      toast.error("You must be logged in to edit a domain.");
      router.push("/login");
      return;
    }

    setLoading(true); // Start loading
    try {
      console.log(`Updating domain with id: ${id} to ${updatedDomain}`);
      const op = await updateDomain(id, updatedDomain, token);

      // Optimistically update the local state
      setEditedDomain(updatedDomain);
      setIsEditing(false);

      // Trigger refetch to ensure consistency with the server
      refetchDomains();

      toast.success("Domain updated successfully!");
      console.log("Domain Updated successfully:", op);
    } catch (error) {
      toast.error("Error updating domain. Please try again.");
      console.error("Error updating domain:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsEditing(false);

      // Use the latest value of `editedDomain` for the update
      handleEdit(editedDomain);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedDomain]);

  return (
    <div
      key={id}
      className="border rounded-2xl shadow-md p-6 bg-white transition-all duration-300"
    >
      <ToastContainer /> {/* Toast container to display notifications */}
      <div className="flex justify-between items-center">
        <div>
          {loading ? (
            <div className="text-gray-500">Updating...</div> // Loader while updating
          ) : isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedDomain}
              onChange={(e) => setEditedDomain(e.target.value)} // Update `editedDomain` state
              className="border p-1 rounded"
            />
          ) : (
            <h2
              className="text-xl font-semibold cursor-pointer"
              onDoubleClick={handleDoubleClick}
            >
              {editedDomain} {/* Show the updated domain */}
            </h2>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {/* Add Subpage Button */}
          <button
            onClick={() => setShowSubpageModal(true)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition cursor-pointer"
          >
            Add Subpage
          </button>

          <button
            onClick={() => handleDelete(id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => toggleExpand(id)}
            className="px-2 py-1 text-gray-600 hover:text-black transition cursor-pointer"
          >
            {expandedDomainId === id ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {/* Modal for Adding Subpage */}
      {showSubpageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Subpage</h2>

            {/* Input for New Subpage */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subpage URL
              </label>
              <input
                type="text"
                value={newSubpage}
                onChange={(e) => setNewSubpage(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSubpageModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubpage}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {loading ? "Adding..." : "Add Subpage"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
          expandedDomainId === id
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-gray-700 text-sm space-y-2">
          {urls && urls?.length > 0 ? (
            urls.map((page) => (
              <div key={page.id}>
                <p>
                  <strong>Page URL:</strong> {page.url}
                </p>
                <p>
                  <strong>Crawling Status :</strong> {page.status}
                </p>
              </div>
            ))
          ) : (
            <div>You page is not associated with a url</div>
          )}
        </div>
      </div>
    </div>
  );
}
