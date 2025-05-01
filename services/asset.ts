export async function getAssetOCRs(assetId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assets/${assetId}/ocr-results`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("getAssetOCRs response", res);
  if (!res.ok) {
    throw new Error("Failed to fetch ocr results");
  }
  return res.json();
}
