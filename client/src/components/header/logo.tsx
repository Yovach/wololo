import { JSX, memo, NamedExoticComponent } from "react";

export const Logo: NamedExoticComponent = memo(function Logo(): JSX.Element {
  return <img src="/src/images/logo_wololo.png" />;
});
