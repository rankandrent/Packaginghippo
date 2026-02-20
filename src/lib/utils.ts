import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadataTitle(title?: string | null, siteName: string = "Packaging Hippo") {
  if (!title) return undefined;
  if (title.toLowerCase().includes(siteName.toLowerCase())) {
    return { absolute: title };
  }
  return title;
}
