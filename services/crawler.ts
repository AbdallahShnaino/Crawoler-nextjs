export async function runCrawler(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/crawler/crawl-pending`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("runCrawler response", res);

  if (!res.ok) {
    throw new Error("Failed to create domain");
  }
  return res.json();
}
