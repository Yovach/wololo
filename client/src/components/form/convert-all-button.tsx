import { memo } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Selection,
} from "react-aria-components";
import { cn } from "../../helpers/utils";
import { ConvertFileForm } from "./convert-file-form";

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
                    onPress={close}
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
