import DomainViewer from "@/components/Domain/DomainViewer/DomainViewer";
import { requireAuth } from "@/context/auth";
import { Domain, Url } from "@/lib/types";
import { getDomains } from "@/services/domain";
import { getDomainUrls } from "@/services/url";

export default async function PagesDashboard() {
  const { token } = await requireAuth();
  const domains: Domain[] = await getDomains(token);

  const domainsList = await Promise.all(
    domains.map(async (domain: Domain) => {
      const urls: Url[] = await getDomainUrls(domain.id, token);
      return { id: domain.id, domain: domain.domain, urls: urls };
    })
  );

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
  return <DomainViewer initialDomains={domainsList} />;
}
