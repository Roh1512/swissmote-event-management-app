import { memo } from "react";

type Props = {
  text?: string;
};

const ButtonLoading = memo((props: Props) => {
  return (
    <>
      <span className="text-inherit">{props.text || "Loading"}</span>{" "}
      <span className="loading loading-dots loading-md"></span>
    </>
  );
});

export default ButtonLoading;
