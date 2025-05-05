import { Asset } from "@/lib/types";
import { getAssetOCRs } from "./asset";

export async function getUrl(domainId: number, urlId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}/urls/${urlId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch urls");
  }
  return res.json();
}

export async function getUrlAssets(
  domainId: number,
  urlId: number,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/urls/domains/${domainId}/urls/${urlId}/assets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }
  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }

  const data: Array<{
    id: number;
    url: string;
    asset_type: string;
    status: string;
  }> = await res.json();
  const mappedAssets: Asset[] = await Promise.all(
    data.map(async (item) => {
      const ocrResult = await getAssetOCRs(item.id, token);
      return {
        assetId: item.id,
        pageId: urlId,
        assetUrl: item.url,
        type: item.asset_type,
        status: item.status,
        ocrResult: !ocrResult.ocr_result
          ? {}
          : {
              content: ocrResult.ocr_result.content,
              confidence: Math.round(
                Number(ocrResult.ocr_result.confidence) * 100
              ),
            },
      } as Asset;
    })
  );

  return mappedAssets;
}

export async function deleteUrl(
  domainId: number,
  urlId: number,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}/urls/${urlId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete urls");
  }
  return res.json();
}

export async function updateUrl(
  domainId: number,
  urlId: number,
  url: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}/urls/${urlId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: url }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update url");
  }
  return res.json();
}

export async function getDomainUrls(domainId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}/urls`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch urls");
  }

  return res.json();
}

export async function createDomainUrl(
  domainId: number,
  url: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}/urls`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: url }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch urls");
  }
  return res.json();
}
