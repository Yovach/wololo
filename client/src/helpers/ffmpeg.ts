import { FFmpeg } from "@ffmpeg/ffmpeg";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { shouldAutomaticallyDownload } from "./constants";

export const ffmpegInstance = new FFmpeg();

export async function importFFmpeg(): Promise<{
  core: typeof import("*?url");
  wasm: typeof import("*?url");
}> {
  // If we can use SharedArrayBuffer, use ffmpeg multi-thread
  if ("SharedArrayBuffer" in window) {
    return {
      core: await import("@ffmpeg/core-mt?url"),
      wasm: await import("@ffmpeg/core-mt/wasm?url"),
    };
  }

  // Otherwise, use ffmpeg single-thread
  return {
    core: await import("@ffmpeg/core?url"),
    wasm: await import("@ffmpeg/core/wasm?url"),
  };
}

export async function downloadFFmpeg(signal?: AbortSignal) {
  const ffmpegData = await importFFmpeg();
  if (!ffmpegInstance.loaded) {
    await ffmpegInstance.load(
      {
        wasmURL: ffmpegData.wasm.default,
        coreURL: ffmpegData.core.default,
        workerURL: ffmpegWorker,
      },
      {
        signal,
      },
    );

    localStorage.setItem(shouldAutomaticallyDownload, "1");
  }
}
