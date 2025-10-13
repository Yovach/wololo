import { FFmpeg } from "@ffmpeg/ffmpeg";
import ffmpegWorker from "@ffmpeg/ffmpeg/worker?url";
import { shouldAutomaticallyDownload } from "./constants";

export const ffmpegInstance: FFmpeg = new FFmpeg();

type FFmpegCoreType =
  | typeof import("@ffmpeg/core?url")
  | typeof import("@ffmpeg/core-mt?url");

type FFmpegWasmType =
  | typeof import("@ffmpeg/core/wasm?url")
  | typeof import("@ffmpeg/core-mt/wasm?url");

async function importFFmpeg(): Promise<Readonly<{
  core: FFmpegCoreType;
  wasm: FFmpegWasmType;
}>> {
  // If we can use SharedArrayBuffer, use ffmpeg multi-thread
  if ("SharedArrayBuffer" in window) {
    return Object.freeze({
      core: await import("@ffmpeg/core-mt?url"),
      wasm: await import("@ffmpeg/core-mt/wasm?url"),
    });
  }

  // Otherwise, use ffmpeg single-thread
  return Object.freeze({
    core: await import("@ffmpeg/core?url"),
    wasm: await import("@ffmpeg/core/wasm?url"),
  });
}

export async function downloadFFmpeg(signal?: AbortSignal): Promise<void> {
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
