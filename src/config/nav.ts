import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Estadisticas", icon: HomeIcon },
  // { href: "/account", title: "Account", icon: Cog },
  {
    href: "/leaders",
    title: "Dirigentes",
    icon: Globe,
  },
  {
    href: "/voters",
    title: "Votantes",
    icon: Globe,
  },

  { href: "/settings", title: "Configuración", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
