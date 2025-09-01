import { atom } from "recoil";

export const stage1 = atom({
  key: "stage1",
  default: false,
});

export const stage2 = atom({
  key: "stage2",
  default: false,
});

export const stage4 = atom({
  key: "stage4",
  default: false,
});

export const stage5 = atom({
  key: "stage5",
  default: false,
});

export const openPopup = atom({
  key: "popup",
  default: false,
});

export const isStartScene = atom({
  key: "isStart",
  default: false,
});

export const onResetCar = atom({
  key: "isCar",
  default: true,
});

export const isModalOpen = atom({
  key: "isModalOpen",
  default: false,
});
