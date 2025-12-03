import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";
import { DEFAULT_FORMATS, getAvailableFormats } from "../helpers/api";

export function useGetSupportedFormats(): DefinedUseQueryResult<
  readonly {
    type: string;
    label: string;
    items: readonly { name: string }[];
  }[],
  Error
> {
  return useQuery({
    queryKey: ["available-formats"],
    initialData: DEFAULT_FORMATS,
    queryFn: () => getAvailableFormats(),
  });
}
