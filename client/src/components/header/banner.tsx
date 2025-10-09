import { memo, NamedExoticComponent } from "react";
import { JSX } from "react/jsx-runtime";

export const Banner: NamedExoticComponent = memo(function Banner(): JSX.Element {
  return (
    <h1>
      welcome to <span>wololo</span>
    </h1>
  );
});
