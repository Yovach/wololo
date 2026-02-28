import {
  AdtsOutputFormat,
  FlacOutputFormat,
  MkvOutputFormat,
  MovOutputFormat,
  Mp4OutputFormat,
  MpegTsOutputFormat,
  OggOutputFormat,
  WavOutputFormat
} from "mediabunny";

export const OUTPUT_FORMAT_CONVERTERS = [
  new Mp4OutputFormat(),
  new MpegTsOutputFormat(),
  new FlacOutputFormat(),
  new AdtsOutputFormat(),
  new MkvOutputFormat(),
  new MovOutputFormat(),
  new OggOutputFormat(),
  new WavOutputFormat(),
] as const;
