import { GlobalState } from "utils/global-state/types";

import { LocalStorageKeys } from "./enums";

export interface LocalStorageValueMap {
  [LocalStorageKeys.GlobalState]: GlobalState;
}
