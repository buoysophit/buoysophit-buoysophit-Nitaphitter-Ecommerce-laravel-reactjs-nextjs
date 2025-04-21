import camelCaseKeys from "camelcase-keys";
import pickBy from "lodash/pickBy";

// interface PaginatorInfo {
//   [key: string]: unknown;
// }
// type PaginatorOutputType = {
//   hasMorePages: boolean;
//   nextPageUrl: string;
//   [key: string]: unknown;
// };
// export const mapPaginatorData = (obj: PaginatorInfo): PaginatorOutputType => {
//   const formattedValues = camelcaseKeys(obj);
//   return {
//     ...(formattedValues as PaginatorOutputType),
//     hasMorePages: formattedValues.lastPage !== formattedValues.currentPage,
//   };
// };

interface Paginator {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  data?: any[];
}
export const mapPaginatorData = (obj: Paginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = camelCaseKeys(obj);
  return {
    ...formattedValues,
    hasMorePages: formattedValues.lastPage !== formattedValues.currentPage,
    firstItem: formattedValues.from,
    lastItem: formattedValues.to,
  };
};

export const parseSearchString = (values: any) => {
  const parsedValues = pickBy(values);
  return Object.keys(parsedValues)
    .map((k) => {
      if (k === "type") {
        return `${k}.slug:${parsedValues[k]};`;
      }
      if (k === "category") {
        return `categories.slug:${parsedValues[k]};`;
      }
      return `${k}:${parsedValues[k]};`;
    })
    .join("")
    .slice(0, -1);
};