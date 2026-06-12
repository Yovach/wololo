import { useQuery } from "@tanstack/react-query";
import { createLogger } from "evlog";
import { BASE_IMAGE_FORMATS, isMimeTypeSupported } from "../helpers/output";

/**
 * Returns a set of supported mime types.
 *
 * @returns A set of supported mime types.
 */
async function getSupportedMimeTypes(): Promise<Set<string>> {
  const logger = createLogger({
    name: "supported_mime_types",
    received: {
      amount: BASE_IMAGE_FORMATS.length,
    },
  });

  const supportedMimeTypes = new Set<string>();

  try {
    for (const { mimeType } of BASE_IMAGE_FORMATS) {
      try {
        const isSupported = await isMimeTypeSupported(mimeType);
        if (isSupported) {
          supportedMimeTypes.add(mimeType);
        }
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err);
        }
      }
    }

    logger.set({
      outcome: "success",
    });
  } catch (err) {
    logger.set({
      outcome: "error",
      error: err,
    });
  } finally {
    logger.set({
      supported: {
        amount: supportedMimeTypes.size,
        items: [...supportedMimeTypes.values()],
      },
    });

    logger.emit();
  }

  return Object.freeze(supportedMimeTypes);
}

/**
 * A hook that returns a query that returns a set of supported mime types.
 *
 * @returns A query that returns a set of supported mime types.
 */
export function useSupportedMimeTypes() {
  return useQuery({
    queryKey: ["supported-mime-types"],
    queryFn: getSupportedMimeTypes,

    // It's done locally so we don't need to refetch it.
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
