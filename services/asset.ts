export async function getAssetOCRs(assetId: number, token: string) {
  const res = await fetch(
    // /api/assets/1/ocr-results
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
