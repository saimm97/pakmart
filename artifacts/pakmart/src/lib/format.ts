export function formatPrice(value: number | undefined | null): string {
  if (value === undefined || value === null) return "Rs. 0";
  return "Rs. " + new Intl.NumberFormat("en-PK").format(value);
}

export function getImageUrl(filename: string | undefined | null): string {
  if (!filename) return "";
  return import.meta.env.BASE_URL + "images/pakmart/" + filename;
}
