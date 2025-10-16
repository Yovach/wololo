import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";
import { DEFAULT_FORMATS, getAvailableFormats } from "../helpers/api";

export function useGetSupportedFormats(): DefinedUseQueryResult<
  {
    image: readonly string[];
    video: readonly string[];
    audio: readonly string[];
  },
  Error
> {
  return useQuery({
    queryKey: ["available-formats"],
    initialData: DEFAULT_FORMATS,
    queryFn: () => getAvailableFormats().then((val) => val.formats),
  });
}
