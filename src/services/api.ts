import type { Organisation } from "@/types/organization";

export function filterOrganizations(
  orgs: Organisation[],
  query: string,
  province: string,
  sector: string,
  status: string
): Organisation[] {
  return orgs.filter((org) => {
    const matchQuery =
      !query ||
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.full_name.toLowerCase().includes(query.toLowerCase()) ||
      org.acronym.toLowerCase().includes(query.toLowerCase()) ||
      org.sectors.some((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ) ||
      org.provinces_covered.some((p) =>
        p.toLowerCase().includes(query.toLowerCase())
      );

    const matchProvince =
      !province || org.provinces_covered.includes(province);

    const matchSector =
      !sector ||
      org.sectors.some((s) =>
        s.toLowerCase().includes(sector.toLowerCase())
      );

    const matchStatus = !status || org.status === status;

    return matchQuery && matchProvince && matchSector && matchStatus;
  });
}
