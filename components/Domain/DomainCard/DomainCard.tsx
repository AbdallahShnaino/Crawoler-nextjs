"use client";
import { useAuth } from "@/context/user";
import { Url } from "@/lib/types";
import { addAllPagesOnce, deleteDomain } from "@/services/domain";
import { deleteUrl } from "@/services/url";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Trash2,
  Videotape,
  FolderPlus,
  Workflow,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UpdatePageModal from "@/components/Modale/UpdatePageModal";
import UpdateDomainModal from "@/components/Modale/UpdateDomainModal";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAsset } from "@/services/asset";
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [openAddPagesDialog, setOpenAddPagesDialog] = useState(false);
  const [openAddAssetDialog, setOpenAddAssetDialog] = useState<
    Record<number, boolean>
  >({});
  const [newAsset, setNewAsset] = useState("");
  const [loadingSubpage, setLoadingSubpage] = useState(false);

  const handleDeleteDomain = async () => {
    try {
      await deleteDomain(id, token!);
      toast("Domain deleted successfully");
      refetchDomains();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to delete page");
    }
  };

  const handleShowAssets = async (domainId: number, pageId: number) => {
    router.replace(`?pageId=${pageId}&domainId=${domainId}`);
  };

  const handleDeletePageUrl = async (pageId: number) => {
    try {
      await deleteUrl(id, pageId, token!);
      toast.success("Page deleted successfully");
      refetchDomains();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to delete page");
    }
  };
  const handleAddNewAsset = async (pageId: number) => {
    try {
      if (!token) {
        return;
      }
      setLoadingSubpage(true);
      setError("");
      const assetRegex =
        /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+([\/\w\-._~:?#[\]@!$&'()*+,;=]*)\.(jpg|jpeg|png|gif|bmp|webp|svg|pdf)$/i;

      if (!assetRegex.test(newAsset)) {
        setError("Invalid URL asset format.");
        setLoadingSubpage(false);
        return;
      }

      const op = await createAsset(newAsset, pageId, token);
      if (op.id) {
        toast("Asset has been created.");
        setOpenAddAssetDialog((prev) => ({ ...prev, [pageId]: false }));
        setLoadingSubpage(false);
      } else {
        toast("Failed to add new asset. Please try again.");
      }
      setLoadingSubpage(false);
      setNewAsset("");
      setError("");
      await refetchDomains();
    } catch {
      toast("Failed to add domain. Please try again.");
    }
  };
  async function handleAddPagesList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");
    setLoadingSubpage(true);

    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError("Please select a .txt file.");
      setLoadingSubpage(false);
      return;
    }

    const file = fileInput.files[0];

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      setError("Only .txt files are allowed.");
      setLoadingSubpage(false);
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 2MB.");
      setLoadingSubpage(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await addAllPagesOnce(id, formData, token!);

      if (!res || res.error || res.status === false || res.ok === false) {
        setError(res?.message || "Failed to upload file.");
        setLoadingSubpage(false);
        return;
      }

      toast("Pages added successfully!");
      setOpenAddPagesDialog(false);
      setLoadingSubpage(false);
      setError("");
      fileInput.value = "";
      refetchDomains();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "Failed to add pages. Please try again or check your file format."
        );
      } else {
        setError(
          "Failed to add pages. Please try again or check your file format."
        );
      }
      setLoadingSubpage(false);
    }
  }
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-3 border rounded-lg p-4 shadow-md bg-white"
    >
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold truncate max-w-[50%]">{domain}</h4>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only"></span>
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see all pages in this domain</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteDomain()}
          >
            <Trash2 />
          </Button>
          {token && (
            <UpdateDomainModal
              id={id}
              domain={domain}
              token={token}
              onFinished={refetchDomains}
            />
          )}
        </div>
      </div>
      <Dialog open={openAddPagesDialog} onOpenChange={setOpenAddPagesDialog}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Workflow size="icon" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to add all pages once</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Pages</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed">
              Add all pages at once to a certain domain. <br />
              Click <span className="font-medium text-black">Save</span> when
              you are done.
              <div className="mt-3">
                <span className="font-medium text-gray-700">File format:</span>{" "}
                Upload a plain text file (
                <code className="text-blue-600">.txt</code>) with one URL per
                line.
              </div>
              <pre className="bg-gray-100 rounded-md p-3 text-xs text-gray-800 mt-2 border border-gray-200">
                https://example.com/page1{"\n"}
                https://example.com/page2{"\n"}
                https://example.com/page3
              </pre>
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" />
          </div>
          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          <DialogFooter>
            <Button onClick={handleAddPagesList} disabled={loadingSubpage}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CollapsibleContent className="space-y-3">
        {urls && urls.length > 0 ? (
          urls.map((page) => (
            <div
              key={page.id}
              className="rounded-md border px-3 py-2 font-mono text-sm shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center group relative">
                <span className="truncate max-w-[150px]">{page.url}</span>
                <div className="absolute left-0 bottom-full mb-1 hidden w-max rounded bg-white px-2 py-1 text-xs text-black shadow group-hover:block z-10">
                  {page.url}
                </div>

                <span className="text-xs text-gray-500">{page.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePageUrl(page.id)}
                >
                  <Trash2 size="icon" />
                </Button>

                <Dialog
                  open={openAddAssetDialog[page.id]}
                  onOpenChange={(open) =>
                    setOpenAddAssetDialog((prev) => ({
                      ...prev,
                      [page.id]: open,
                    }))
                  }
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <FolderPlus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to add asset on this page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Asset</DialogTitle>
                      <DialogDescription>
                        Add new assets to a certain web page here. Click save
                        when you are done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Asset URL
                        </Label>
                        <Input
                          id="domainName"
                          placeholder="Please add an image or PDF link"
                          className="col-span-3"
                          onChange={(e) => setNewAsset(e.target.value)}
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mb-1">{error}</p>
                    )}
                    <DialogFooter>
                      <Button
                        onClick={() => handleAddNewAsset(page.id)}
                        disabled={loadingSubpage}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {page.status === "completed" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowAssets(id, page.id)}
                          >
                            <Videotape className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to show all assets extracted by the crawler</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {token && (
                  <UpdatePageModal
                    domainId={id}
                    urlId={page.id}
                    url={page.url}
                    token={token}
                    onFinished={refetchDomains}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No pages added</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
