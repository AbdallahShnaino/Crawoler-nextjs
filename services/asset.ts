export async function getAssetOCRs(assetId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ocr/assets/${assetId}/results`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

export async function createAsset(
  assetUrl: string,
  pageId: number,
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      asset_url: assetUrl,
      parent_url_id: pageId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create new asset");
  }
  return res.json();
}
