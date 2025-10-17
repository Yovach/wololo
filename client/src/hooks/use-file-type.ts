import { getFilePreview, getFileType } from "../helpers/utils";
import { useQuery } from "@tanstack/react-query";

export function useFileType(file: File) {
  return useQuery({
    initialData: null,
    queryKey: ["file-type", file.name],
    queryFn: () => getFileType(file),
  });
}
