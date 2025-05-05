export async function getOCRResult(userId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ocr/assets/${userId}/results`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch OCR results");
  }
  return res.json();
}
export async function triggerOcr(assetId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ocr/assets/1/process`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ asset_id: assetId }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create domain");
  }
  return res.json();
}
