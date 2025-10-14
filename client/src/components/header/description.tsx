import { memo, NamedExoticComponent } from "react";
import { JSX } from "react/jsx-runtime";

export const Description: NamedExoticComponent = memo(
  function Description(): JSX.Element {
    return <p>You can easily convert your videos and images !</p>;
  },
);
