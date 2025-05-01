"use client";
import { useAuth } from "@/context/user";
import { Url } from "@/lib/types";
import { deleteDomain } from "@/services/domain";
import { deleteUrl } from "@/services/url";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Delete } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UpdatePageModal from "@/components/Modale/UpdatePageModal";
import UpdateDomainModal from "@/components/Modale/UpdateDomainModal";

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

  const handleDeleteDomain = async () => {
    try {
      await deleteDomain(id, token!);
      toast("Domain deleted successfully");
      refetchDomains();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to delete page");
    }
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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className=" space-y-4 border rounded-lg p-4 shadow-md bg-white"
    >
      <div className=" flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">{domain}</h4>
        <div className="flex space-x-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteDomain()}
          >
            <Delete />
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

      <CollapsibleContent className="space-y-3">
        {urls && urls.length > 0 ? (
          urls.map((page) => (
            <div
              key={page.id}
              className="rounded-md border px-3 py-2 font-mono text-sm shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{page.url}</span>
                <span className="text-xs text-gray-500">{page.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePageUrl(page.id)}
                >
                  <Delete className="h-4 w-4" />
                </Button>
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
