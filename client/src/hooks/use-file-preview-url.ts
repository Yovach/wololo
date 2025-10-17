import { getFilePreview } from "../helpers/utils";
import { useQuery } from "@tanstack/react-query";

export function useFilePreviewUrl(file: File) {
  return useQuery({
    initialData: null,
    queryKey: ["file-preview-url", file.name],
    queryFn: () => getFilePreview(file),
  });
}
