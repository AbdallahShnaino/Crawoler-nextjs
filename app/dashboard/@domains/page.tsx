import DomainViewer from "@/components/Domain/DomainViewer/DomainViewer";
import { requireAuth } from "@/context/auth";
import { Domain, Url } from "@/lib/types";
import { getDomains } from "@/services/domain";
import { getDomainUrls } from "@/services/url";

export default async function DomainDashboard() {
  const { token } = await requireAuth();
  const domains: Domain[] = await getDomains(token);

  const domainsList = (
    await Promise.all(
      domains.map(async (domain: Domain) => {
        try {
          const urls: Url[] = await getDomainUrls(domain.id, token);
          return { id: domain.id, domain: domain.domain, urls: urls };
        } catch (error) {
          console.error(
            "DomainDashboard error while fetching domain urls ",
            error
          );
        }
      })
    )
  ).filter((domain) => domain !== undefined) as Domain[];

  return <DomainViewer initialDomains={domainsList} />;
}
