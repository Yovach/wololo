import { memo } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay
} from "react-aria-components";
import { cn } from "../../helpers/utils";

interface Props {
  nbSelectedElements: number;
}

export const ConvertAllButton = memo(function ConvertAll({
  nbSelectedElements,
}: Props) {
  return (
    <DialogTrigger>
      <Button>Convert {nbSelectedElements} elements</Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) =>
          cn(
            "absolute top-0 left-0 isolate z-10 h-(--page-height) w-full bg-black/25 backdrop-blur",
            isEntering && "animate-in fade-in duration-300 ease-out",
            isExiting && "animate-out fade-out duration-200 ease-in",
          )
        }
      >
        <Modal
          className={({ isEntering, isExiting }) =>
            cn(
              "sticky top-0 left-0 box-border flex h-(--visual-viewport-height) w-full items-center justify-center p-4 text-center",
              isEntering && "animate-in zoom-in-95 duration-300 ease-out",
              isExiting && "animate-out zoom-out-95 duration-200 ease-in",
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
                <p className="mt-3 text-slate-500">
                  You are going to convert files
                </p>
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
