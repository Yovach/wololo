import { JSX, memo, NamedExoticComponent } from "react";

const imgUrl = new URL("../../images/wololo-logo.png", import.meta.url).href;

export const Logo: NamedExoticComponent = memo(function Logo(): JSX.Element {
  return <img src={imgUrl} className="logo" />;
});
