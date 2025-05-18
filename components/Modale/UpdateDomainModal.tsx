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
import { updateDomain } from "@/services/domain";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface IProps {
  token: string;
  domain: string;
  id: number;
  onFinished: () => void;
}

export default function UpdateDomainModal({
  id,
  token,
  domain,
  onFinished,
}: IProps) {
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateDomain = async () => {
    setLoading(true);
    try {
      await updateDomain(id, newDomain, token!);
      toast("Domain updated successfully");
      onFinished();
      setOpen(false);
    } catch {
      toast("Failed to update Domain ");
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
                  <span className="sr-only">Edit Domain</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Domain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Domain</DialogTitle>
          <DialogDescription>
            Update the domain by filling the new value beside the current one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-6 py-4">
          <div className="flex flex-col w-full">
            <Label className="text-sm text-muted-foreground mb-1">
              Current Domain
            </Label>
            <div className="h-10 flex items-center px-3 rounded-md border border-input bg-muted text-sm text-gray-800 dark:text-white">
              {domain}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <Label htmlFor="newDomain" className="mb-1">
              New Domain
            </Label>
            <Input
              id="newDomain"
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdateDomain} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
