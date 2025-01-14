import { TownHallForm } from "./types";

export function cleanFormData(data: TownHallForm) {
  return {
    ...data,
    mayorId: data.mayorId !== null ? parseInt(data.mayorId) : null,
  };
}
