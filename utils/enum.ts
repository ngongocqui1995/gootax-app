export const GOOGLE_MAPS_API_KEY = "AIzaSyDuG_Yw3NrzoN79fIWHnE10-9zSbcNvJK8";

export const NAVIGATOR_SCREEN = {
  HOME: "HOME",
  MESSAGE: "MESSAGE",
  HOME_SCREEN: "HOME_SCREEN",
  ACTIVATE: "ACTIVATE",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  PROFILE: "PROFILE",
  BOOK_CAR: "BOOK_CAR",
  SEARCH_LOCATION: "SEARCH_LOCATION",
  BOOK_DETAIL: "BOOK_DETAIL",
};

export const GENDER_ENUM = {
  MALE: { text: "Nam" },
  FEMALE: { text: "Nữ" },
  OTHER: { text: "Khác" },
};

export enum ENUM_STATUS_BOOK {
  FINDING = "FINDING",
  PICKING = "PICKING",
  RIDING = "RIDING",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export type ENUM_STATUS_BOOK_STRING = keyof typeof ENUM_STATUS_BOOK;

export const STATUS_BOOK = {
  [ENUM_STATUS_BOOK.FINDING]: {
    text: "Đang tìm tài xế",
    key: ENUM_STATUS_BOOK.FINDING,
    color: "black",
    background: "gray.300",
  },
  [ENUM_STATUS_BOOK.PICKING]: {
    text: "Đang đón khách",
    key: ENUM_STATUS_BOOK.PICKING,
    color: "black",
    background: "gray.300",
  },
  [ENUM_STATUS_BOOK.RIDING]: {
    text: "Trong chuyến đi",
    key: ENUM_STATUS_BOOK.RIDING,
    color: "#1677ff",
    background: "#e6f4ff",
  },
  [ENUM_STATUS_BOOK.CANCELED]: {
    text: "Bị huỷ",
    key: ENUM_STATUS_BOOK.CANCELED,
    color: "#ff4d4f",
    background: "#fff2f0",
  },
  [ENUM_STATUS_BOOK.COMPLETED]: {
    text: "Hoàn thành",
    key: ENUM_STATUS_BOOK.COMPLETED,
    color: "#52c41a",
    background: "#f6ffed",
  },
};
