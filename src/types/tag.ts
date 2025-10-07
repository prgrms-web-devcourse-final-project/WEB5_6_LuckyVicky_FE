
export type TagPayload = {
  tagName: string;
};

export type Tag = {
  id: number;
  tagName: string;
};

export type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};
