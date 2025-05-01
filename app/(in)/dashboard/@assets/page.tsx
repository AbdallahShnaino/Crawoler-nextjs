import { requireAuth } from "@/context/auth";
import { DomainAssets, Url } from "@/lib/types";
import { getDomains } from "@/services/domain";
import { getDomainUrls, getUrlAssets } from "@/services/url";

export default async function AssetsDashboard() {
  const { token } = await requireAuth();
  const domains: DomainAssets[] = await getDomains(token);

  const domainsList = [];
  for (const domain of domains) {
    const urls: Url[] = await getDomainUrls(domain.id, token);

    const urlAssets = [];
    for (const url of urls) {
      const assets = await getUrlAssets(url.id, token);
      urlAssets.push({ ...url, assets });
    }
    domainsList.push({ id: domain.id, domain: domain.domain, urls: urlAssets });
  }

  if (domainsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">🔒 Locked</h1>
        <p className="text-lg text-gray-500">
          No domains available. Please add a domain to unlock the dashboard.
        </p>
      </div>
    );
  }

  /*
  <DomainViewer initialDomains={domainsList} />;
   */
  return <h1>12</h1>;
}
