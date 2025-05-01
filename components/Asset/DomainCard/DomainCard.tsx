"use client";
import { useAuth } from "@/context/user";
import { UrlWithAssets } from "@/lib/types";
import { deleteDomain, updateDomain } from "@/services/domain";
import { createDomainUrl, deleteUrl, updateUrl } from "@/services/url";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AssetCard({
  id,
  domain,
  urls,
  refetchDomains,
}: {
  id: number;
  domain: string;
  urls?: UrlWithAssets[];
  refetchDomains: () => void;
}) {
  const { token } = useAuth();
  const [expandedDomainId, setExpandedDomainId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDomain, setEditedDomain] = useState(domain);
  const [loading, setLoading] = useState(false);
  const [showSubpageModal, setShowSubpageModal] = useState(false);
  const [newSubpage, setNewSubpage] = useState("");
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [editedPageUrl, setEditedPageUrl] = useState("");
  const [loadingPageId, setLoadingPageId] = useState<number | null>(null);
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
      await createDomainUrl(id, newSubpage, token);
      toast.success("Subpage added successfully!");

      setShowSubpageModal(false);
      setNewSubpage("");

      refetchDomains();
    } catch {
      toast.error("Error adding subpage. Please try again.");
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
      await deleteDomain(id, token);
      toast.success("Domain deleted successfully!");

      refetchDomains();
    } catch {
      toast.error("Error deleting domain. Please try again.");
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

    setLoading(true);
    try {
      await updateDomain(id, updatedDomain, token);

      setEditedDomain(updatedDomain);
      setIsEditing(false);

      refetchDomains();

      toast.success("Domain updated successfully!");
    } catch {
      toast.error("Error updating domain. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPageUrl = async (pageId: number, updatedUrl: string) => {
    if (!token) {
      toast.error("You must be logged in to edit a page URL.", {
        autoClose: 3000,
      });
      router.push("/login");
      return;
    }

    setLoadingPageId(pageId);
    try {
      await updateUrl(id, pageId, updatedUrl, token);
      toast.success("Page URL updated successfully!", { autoClose: 3000 });

      setEditingPageId(null);
      refetchDomains();
    } catch {
      toast.error("Error updating page URL. Please try again.");
    } finally {
      setLoadingPageId(null);
    }
  };

  const handleDeletePageUrl = async (pageId: number) => {
    if (!token) {
      toast.error("You must be logged in to delete a page URL.", {
        autoClose: 3000,
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      await deleteUrl(id, pageId, token);
      toast.success("Page URL deleted successfully!", { autoClose: 3000 });

      refetchDomains();
    } catch {
      toast.error("Error deleting page URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsEditing(false);
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
      <div className="flex justify-between items-center">
        <div>
          {loading ? (
            <div className="text-gray-500">Updating...</div>
          ) : isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedDomain}
              onChange={(e) => setEditedDomain(e.target.value)}
              className="border p-1 rounded"
            />
          ) : (
            <h2
              className="text-xl font-semibold cursor-pointer"
              onDoubleClick={handleDoubleClick}
            >
              {editedDomain}
            </h2>
          )}
        </div>
        <div className="flex gap-2 items-center">
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
      {showSubpageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Subpage</h2>
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
                <div>
                  {loadingPageId === page.id ? (
                    <div className="text-gray-500">Updating...</div>
                  ) : editingPageId === page.id ? (
                    <input
                      type="text"
                      value={editedPageUrl}
                      onChange={(e) => setEditedPageUrl(e.target.value)}
                      onBlur={() => handleEditPageUrl(page.id, editedPageUrl)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditPageUrl(page.id, editedPageUrl);
                        }
                      }}
                      className="border p-1 rounded"
                    />
                  ) : (
                    <p
                      onDoubleClick={() => {
                        setEditingPageId(page.id);
                        setEditedPageUrl(page.url);
                      }}
                      className="cursor-pointer"
                    >
                      <strong>Page URL:</strong> {page.url}
                    </p>
                  )}
                  <p>
                    <strong>Assets:</strong>{" "}
                    {page.assets.length > 0 ? (
                      <ul>
                        {page.assets.map((asset, index) => (
                          <li key={index}>{JSON.stringify(asset)}</li>
                        ))}
                      </ul>
                    ) : (
                      "No assets available"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePageUrl(page.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No pages associated with this domain.</div>
          )}
        </div>
      </div>
    </div>
  );
}
