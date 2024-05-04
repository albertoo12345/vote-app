import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

export const crawlerSplitterByLabel = (label: string, data: string) => {
  const nonParsedData = data.split("\n").filter((x) => x.toLowerCase().includes(label))[0];
  return nonParsedData.split("</b> ")[1].trim().split("</p>")[0];
};

export const crawlPanamanianData = (data: string) => {
  const nationalId = crawlerSplitterByLabel("cedula", data);
  const name = crawlerSplitterByLabel("nombre", data);
  const township = crawlerSplitterByLabel("corregimiento", data);
  const school = crawlerSplitterByLabel("centro de votación:", data);
  const desk = crawlerSplitterByLabel("mesa", data);
  return { nationalId, name, township, school, desk };
};

export const getPanamanianData = async (nationalId: string) => {
  const formdata = new FormData();
  formdata.append("cedula", nationalId);
  const res = await fetch("https://verificate.votopanama.net/search.php", {
    method: "POST",
    body: formdata,
    redirect: "follow",
  });

  const data = await res.text();
  return crawlPanamanianData(data);
};

export const nationalIdSchema = z.object({
  nationalId: z.string(),
});
