export type CategoryPayload = {
  categoryName: string;
  parentId: number | null;
};

export type Category = {
  id: number;
  categoryName: string;
  parentId?: number | null;
  subCategories: Category[];
};

export type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};
