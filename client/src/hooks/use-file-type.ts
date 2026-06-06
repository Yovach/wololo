import { useQuery } from "@tanstack/react-query";
import { getFileType } from "../helpers/utils";

export function useFileType(file: File) {
  return useQuery({
    initialData: null,
    queryKey: ["file-type", file.name],
    queryFn: () => getFileType(file),
    refetchOnWindowFocus: false,
  });
}
