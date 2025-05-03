"use client";

import { Asset } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
interface IProps {
  assets: Asset[];
}

export default function AssetsViewer({ assets }: IProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Assets Dashboard</h1>

      {assets && assets.length > 0 ? (
        assets.map((asset) => (
          <Accordion key={asset.assetId} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{asset.assetUrl}</AccordionTrigger>
              {asset.ocrResult.length > 0 ? (
                asset.ocrResult.map((result, index) => (
                  <AccordionContent key={index}>
                    Asset Type: {asset.type}
                    <br />
                    Asset Status: {asset.status}
                    <br />
                    <div className="text-orange-500 font-bold">OCR Result</div>
                    Content: {result.content}
                    <br />
                    Confidence Score: {result.confidence}
                  </AccordionContent>
                ))
              ) : (
                <AccordionContent key={asset.assetId}>
                  Asset Type: {asset.type}
                  <br />
                  Asset Status: {asset.status}
                  <p>No OCR information available for this asset</p>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        ))
      ) : (
        <p>
          No assets found for this page. Try picking another one to view its
          assets.
        </p>
      )}
    </div>
  );
}
