import { useQuery } from "@tanstack/react-query";
import { getFilePreview } from "../helpers/utils";

export function useFilePreviewUrl(file: File, size: number = 24) {
  return useQuery({
    initialData: null,
    queryKey: ["file-preview-url", file.name],
    queryFn: () => getFilePreview(file, size),
    refetchOnWindowFocus: false,
  });
}
