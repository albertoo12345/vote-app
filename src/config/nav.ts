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
    href: "/voters",
    title: "Voters",
    icon: Globe,
  },
  {
    href: "/leaders",
    title: "Leaders",
    icon: Globe,
  },
  { href: "/settings", title: "Configuración", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
