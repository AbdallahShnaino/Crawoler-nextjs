"use client";

import { Asset, DomainAssets, Url } from "@/lib/types";
import { useState } from "react";
import { useAuth } from "@/context/user";
import { createDomain, getDomains } from "@/services/domain";
import { getDomainUrls, getUrlAssets } from "@/services/url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssetCard from "../DomainCard/DomainCard";

interface IProps {
  initialDomains: DomainAssets[];
}

export default function DomainViewer({ initialDomains }: IProps) {
  const [domains, setDomains] = useState<DomainAssets[]>(initialDomains);
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [subPages, setSubPages] = useState<string[]>([]);

  const refetchDomains = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
      const domains: DomainAssets[] = await getDomains(token);
      const domainsList = [];
      for (const domain of domains) {
        const urls: Url[] = await getDomainUrls(domain.id, token);
        const urlAssets = [];
        for (const url of urls) {
          const assets: Asset[] = await getUrlAssets(url.id, token);
          urlAssets.push({
            ...url,
            assets,
          });
        }
        domainsList.push({
          id: domain.id,
          domain: domain.domain,
          urls: urlAssets,
        });
      }

      setDomains(domainsList);
    } catch (error) {
      console.error("DomainViewer Error refetching domains:", error);
    }
  };

  const handleAddUrl = async () => {
    try {
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(newUrl)) {
        toast.error(
          "Invalid domain format. Please enter a valid domain like example.com."
        );
        return;
      }

      await createDomain(newUrl, token);
      toast.success("Domain added successfully!");

      setShowModal(false);
      setNewUrl("");
      setSubPages([]);
      await refetchDomains();
    } catch (error) {
      toast.error("Error adding new URL. Please try again.");
      console.error("Error adding new URL:", error);
    }
  };

  const handleAddSubPage = () => {
    setSubPages([...subPages, ""]);
  };

  const handleSubPageChange = (index: number, value: string) => {
    const updatedSubPages = [...subPages];
    updatedSubPages[index] = value;
    setSubPages(updatedSubPages);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8">Domain Dashboard</h1>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add New URL
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New URL</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {subPages.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subpages (Optional)
                </label>
                {subPages.map((subPage, index) => (
                  <input
                    key={index}
                    type="text"
                    value={subPage}
                    onChange={(e) => handleSubPageChange(index, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                  />
                ))}
              </div>
            )}
            <button
              onClick={handleAddSubPage}
              className="text-blue-500 text-sm hover:underline"
            >
              + Add Subpage
            </button>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>
      )}
      {domains.map((domain) => (
        <AssetCard
          key={domain.id}
          id={domain.id}
          domain={domain.domain}
          urls={domain.urls}
          refetchDomains={refetchDomains}
        />
      ))}
    </div>
  );
}
