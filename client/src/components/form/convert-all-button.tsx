import { memo, useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Label,
  Modal,
  ModalOverlay,
  ProgressBar,
  Selection,
} from "react-aria-components";
import { cn } from "../../helpers/utils";
import { ConvertFileForm } from "./convert-file-form";
import { convertToImage, downloadFile } from "../../helpers/converter";

interface Props {
  files: File[];
  selectedFiles: Selection;
}

export const ConvertAllButton = memo(function ConvertAll({
  selectedFiles,
  files,
}: Props) {
  const nbSelectedElements: number =
    selectedFiles === "all" ? files.length : selectedFiles.size;

  const [progression, setProgression] = useState<number>();
  const [maxProgression, setMaxProgression] = useState<number>();

  const onClickOnConvert = useCallback(async () => {
    const nbElements = files.length;
    setProgression(0);
    setMaxProgression(nbElements);

    const convertedFiles = await Promise.all(
      files.map((file, i) =>
        convertToImage(file, "image/png")
          .then((file) => {
            return file;
          })
          .then((file) => {
            return new Promise<File>((resolve) => {
              setTimeout(
                () => {
                  setProgression((curr) => (curr || 0) + 1);

                  resolve(file);
                },
                250 * (i + 1),
              );
            });
          }),
      ),
    );

    setMaxProgression(undefined);
    setProgression(undefined);
    convertedFiles.forEach((file) => {
      downloadFile(file);
    });
  }, [files]);

  return (
    <DialogTrigger>
      <Button>Convert {nbSelectedElements} elements</Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) =>
          cn(
            "absolute top-0 left-0 isolate z-10 h-(--page-height) w-full bg-black/25 backdrop-blur",
            isEntering && "duration-300 ease-out animate-in fade-in",
            isExiting && "duration-200 ease-in animate-out fade-out",
          )
        }
      >
        <Modal
          className={({ isEntering, isExiting }) =>
            cn(
              "sticky top-0 left-0 box-border flex h-(--visual-viewport-height) w-full items-center justify-center p-4 text-center",
              isEntering && "duration-300 ease-out animate-in zoom-in-95",
              isExiting && "duration-200 ease-in animate-out zoom-out-95",
            )
          }
        >
          <Dialog
            role="alertdialog"
            className="relative box-border max-h-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl outline-hidden"
          >
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="text-xxl my-0 leading-6 font-semibold text-slate-700"
                >
                  Convert files
                </Heading>
                {/* {maxProgression != null && progression != null && ( */}
                <ProgressBar
                  value={progression}
                  maxValue={maxProgression}
                  className="flex w-56 flex-col gap-3 text-slate-700"
                >
                  {({ percentage, valueText }) => (
                    <>
                      <div className="flex">
                        <Label className="flex-1">Converting</Label>
                        <span>{valueText}</span>
                      </div>
                      <div className="top-[50%] h-2 w-full translate-y-[-50%] transform rounded-full bg-blue-500/40">
                        <div
                          className="absolute top-[50%] h-2 translate-y-[-50%] transform rounded-full bg-blue-500"
                          style={{ width: percentage + "%" }}
                        />
                      </div>
                    </>
                  )}
                </ProgressBar>
                {/* )} */}
                <ConvertFileForm />
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    className="bg-slate-200 text-slate-800 hover:border-slate-300 pressed:bg-slate-300"
                    onPress={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-500 text-white hover:border-blue-600 pressed:bg-blue-600"
                    onPress={onClickOnConvert}
                  >
                    Convert
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
});
