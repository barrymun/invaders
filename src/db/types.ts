export type ResourceType = "food" | "lumber" | "stone" | "iron";

export type Resources = {
  [key in ResourceType]: number;
};

export type TroopType =
  | "worker"
  | "warrior"
  | "scout"
  | "swordsman"
  | "pikeman"
  | "archer"
  | "cavalry"
  | "cataphract"
  | "transporter"
  | "batteringRam"
  | "ballista"
  | "catapult";

export type Troops = {
  [key in TroopType]: number;
};
