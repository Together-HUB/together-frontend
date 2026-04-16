export interface Organisation {
  id: string;
  slug?: string;
  name: string;
  full_name: string;
  acronym: string;
  logo_url: string;
  founded: number;
  founded_date?: string;
  founded_city?: string;
  founded_province?: string;
  province_primary: string;
  city: string;
  headquarters?: string;
  headquarters_city?: string;
  operational_offices?: string[];
  website?: string;
  contact_email?: string;
  contact_email_1?: string;
  contact_email_2?: string;
  contact_phone?: string;
  social?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  verified: boolean;
  status: "active" | "pending" | "inactive";
  provinces_covered: string[];
  territories_sud_kivu?: string[];
  sectors: string[];
  description_fr: string;
  description?: string;
  mission_fr?: string;
  mission_points?: string[];
  vision?: string;
  domains?: string[];
  values?: string[];
  experience_years?: number;
  experience_badge?: string;
  staff_count?: number;
  offices_count?: number;
  impact_note?: string;
  team_note?: string;
  images?: string[];
  map_image?: string;
  partner_logos?: string[];
  stats: {
    projects_completed: number;
    people_helped: number;
    partners_count: number;
    experience_years?: number;
    staff_min?: number;
    staff_max?: number;
  };
  success_story?: SuccessStory;
  success_stories?: SuccessStory[];
  tags: string[];
}

export interface SuccessStory {
  id?: string;
  title: string;
  organisation: string;
  period: string;
  duration?: string;
  description: string;
  results: {
    people_assisted: number;
    funding_obtained?: string;
    funding_source?: string;
    villages_covered?: number;
    households_reached?: number;
    distributions?: number;
    provinces_covered?: number;
    zones_covered?: number;
    location?: string;
    beneficiary_profile?: string;
  };
  location?: string;
  sector: string;
  metric_display: string;
}
