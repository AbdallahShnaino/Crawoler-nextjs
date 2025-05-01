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
  console.log("getUrl response", res);

  if (!res.ok) {
    throw new Error("Failed to fetch urls");
  }
  return res.json();
}

export async function getUrlAssets(urlId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/urls/${urlId}/assets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("getUrlAssets response", res);

  return res.json();
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
  console.log("deleteUrl response", res);

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
