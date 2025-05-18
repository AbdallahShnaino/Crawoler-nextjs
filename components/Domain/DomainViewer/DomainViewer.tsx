"use client";

import { Domain, Url } from "@/lib/types";
import DomainCard from "../DomainCard/DomainCard";
import { useState } from "react";
import { useAuth } from "@/context/user";
import { createDomain, getDomains } from "@/services/domain";
import { createDomainUrl, getDomainUrls } from "@/services/url";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runCrawler } from "@/services/crawler";
interface IProps {
  initialDomains: Domain[] | undefined;
}

export default function AssetViewer({ initialDomains }: IProps) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains || []);
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [selectedDomainId, setSelectedDomainId] = useState<
    string | undefined
  >();

  const [openDomainDialog, setOpenDomainDialog] = useState(false);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newPage, setNewPage] = useState("");
  const [loadingSubpage, setLoadingSubpage] = useState(false);
  const refetchDomains = async () => {
    try {
      if (!token) {
        return;
      }
      const domains: Domain[] = await getDomains(token);

      const domainsList = await Promise.all(
        domains.map(async (domain: Domain) => {
          const urls: Url[] = await getDomainUrls(domain.id, token);
          return { id: domain.id, domain: domain.domain, urls: urls };
        })
      );

      setDomains(domainsList);
    } catch {}
  };

  const handleAddUrl = async () => {
    try {
      if (!token) {
        return;
      }
      setLoadingSubpage(true);

      const domainRegex =
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
      if (!domainRegex.test(newDomain)) {
        setError("Invalid domain format.");
        setLoadingSubpage(false);
        return;
      }

      const op = await createDomain(newDomain, token);
      if (op.domain) {
        setOpenDomainDialog(false);
        setLoadingSubpage(false);
        toast("Domain has been created.");
      } else {
        toast("Failed to add domain. Please try again.");
      }
      setLoadingSubpage(false);
      setNewDomain("");
      setError("");
      await refetchDomains();
    } catch {
      toast("Failed to add domain. Please try again.");
    }
  };
  const handleRunCrawler = async () => {
    if (!token) {
      toast.error("You must be logged in to run the crawler.");
      return;
    }

    try {
      await runCrawler(token);
      toast.success("Crawler started successfully!");
    } catch (error) {
      console.error("Error running crawler:", error); // Debugging
      toast.error(
        error instanceof Error ? error.message : "Failed to run the crawler"
      );
    }
  };
  const handleAddPage = async () => {
    const pageRegex =
      /^https?:\/\/(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9](?:\/[\w\-.:;=?&%]*)*$/i;
    if (!pageRegex.test(newPage) && Number(selectedDomainId) != -1) {
      setError("Invalid domain format.");
      setLoadingSubpage(false);
      return;
    }
    if (Number(selectedDomainId) === -1) {
      setError("Please choose a domain before adding pages.");
      setLoadingSubpage(false);
      return;
    }

    try {
      await createDomainUrl(Number(selectedDomainId), newPage, token!);
      toast("Page added successfully");
      setOpenPageDialog(false);
      setNewPage("");
      refetchDomains();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to delete page");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-8">Domain Dashboard</h1>
      <Button className="px-2 py-1 text-sm" onClick={handleRunCrawler}>
        Run Crawler
      </Button>
      <Dialog open={openDomainDialog} onOpenChange={setOpenDomainDialog}>
        <DialogTrigger asChild>
          <Button
            className="px-2 py-1 text-sm"
            variant="outline"
            onClick={() => {
              setError("");
            }}
          >
            Add Domain
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
            <DialogDescription>
              Add new domains here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Domain Name
              </Label>
              <Input
                id="domainName"
                placeholder="google.com "
                className="col-span-3"
                onChange={(e) => setNewDomain(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          <DialogFooter>
            <Button onClick={handleAddUrl} disabled={loadingSubpage}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPageDialog} onOpenChange={setOpenPageDialog}>
        <DialogTrigger asChild>
          <Button
            className="px-2 py-1 text-sm"
            variant="outline"
            onClick={() => {
              setError("");
            }}
          >
            Add Page
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Page</DialogTitle>
            <DialogDescription>
              Add new page to an existing domain here. Click save when you are
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Domain
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setSelectedDomainId(value)}>
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bcbcbc] focus:border-[#bcbcbc]">
                    <SelectValue placeholder="Choose Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.length > 0 ? (
                      domains.map((domain) => (
                        <SelectItem
                          key={domain.id}
                          value={domain.id.toString()}
                        >
                          {domain.domain}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={-1} value={"-1"}>
                        No Domains Available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4 ">
              <Label htmlFor="name" className="text-right">
                Page URL
              </Label>
              <Input
                id="domainName"
                placeholder="https://www.google.com/images"
                className="col-span-3"
                onChange={(e) => setNewPage(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          <DialogFooter>
            <Button onClick={handleAddPage} disabled={loadingSubpage}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {domains.map((domain) => (
        <DomainCard
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
