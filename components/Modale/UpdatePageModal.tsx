"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateUrl } from "@/services/url";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface IProps {
  urlId: number;
  domainId: number;
  token: string;
  url: string;
  onFinished: () => void;
}

export default function UpdatePageModal({
  urlId,
  token,
  url,
  domainId,
  onFinished,
}: IProps) {
  const [newPage, setNewPage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePage = async () => {
    setLoading(true);
    try {
      await updateUrl(domainId, urlId, newPage, token!);
      toast("Page updated successfully");
      onFinished();
      setOpen(false);
    } catch {
      toast("Failed to update page ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setError("");
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Update Page</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Page</DialogTitle>
          <DialogDescription>
            Update the page by filling the new value beside the current one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-6 py-4">
          <div className="flex flex-col w-full">
            <Label className="text-sm text-muted-foreground mb-1">
              Current Page
            </Label>
            <div className="h-10 flex items-center px-3 rounded-md border border-input bg-muted text-sm text-gray-800 dark:text-white">
              {url}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <Label htmlFor="newPage" className="mb-1">
              New Page
            </Label>
            <Input
              id="newPage"
              placeholder="example.com"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdatePage} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
