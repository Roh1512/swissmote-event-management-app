import { useAppSelector } from "./hooks";
import { RootState } from "./store";

export const useCurrentAuthState = () => {
  const accessToken = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  return { accessToken };
};
