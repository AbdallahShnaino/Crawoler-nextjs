export async function getDomain(domainId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "",
        credentials: "include",
      },
    }
  );
  console.log("getDomain response", res);
  if (!res.ok) {
    throw new Error("Failed to fetch domain data");
  }
  return res.json();
}

export async function getDomains(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/domains`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("getDomains response", res);

  if (!res.ok) {
    throw new Error("Failed to fetch domains");
  }
  return res.json();
}

export async function createDomain(domain: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/domains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ domain: domain }),
  });
  console.log("createDomain response", res);

  if (!res.ok) {
    throw new Error("Failed to create domain");
  }
  return res.json();
}
export async function updateDomain(
  domainId: number,
  newDomain: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain: newDomain }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to update domain");
  }
  return res.json();
}
export async function deleteDomain(domainId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/domains/${domainId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("deleteDomain response", res);

  if (!res.ok) {
    throw new Error("Failed to delete domains");
  }
  return res.json();
}
