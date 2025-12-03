"use client";

import { saveAs } from "file-saver";
import mime from "mime/lite";
import {
  FormEvent,
  memo,
  NamedExoticComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useGetSupportedFormats } from "../../api/get-supported-formats";
import { useFFmpeg } from "../../contexts/ffmpeg-context";
import { ffmpegInstance } from "../../helpers/ffmpeg";
import { sendConvertFileRequest } from "../../helpers/send-convert-file-request";
import {
  Collection,
  Header,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select,
} from "react-aria-components";

const Translations = {
  video: "Video",
  audio: "Audio",
  image: "Image",
} as const;

interface Props {
  onSelectOutput: (format: string) => void;
}

export const OutputFormatSelector: NamedExoticComponent<Props> = memo(
  function OutputFormatSelector() {
    const { data: formats } = useGetSupportedFormats();

    console.log(formats);

    const groups = useMemo(
      () => Object.keys(formats) as unknown as (keyof typeof formats)[],
      [formats],
    );

    return (
      <fieldset className="field-format">
        <Label>Please select an output format</Label>
        <Select
          selectionMode="single"
          onChange={(evt) => {
            console.log("received", evt);
          }}
        >
          <Popover>
            <ListBox items={formats}>
              {(group) => (
                <ListBoxSection
                  id={`SelectFormat.${group.label}.${group.label}`}
                >
                  <Header>{group.label}</Header>
                  <Collection items={group.items}>
                    {(format) => (
                      <ListBoxItem id={format.name}>{format.name}</ListBoxItem>
                    )}
                  </Collection>
                </ListBoxSection>
              )}
            </ListBox>
          </Popover>
        </Select>
      </fieldset>
    );
  },
);
