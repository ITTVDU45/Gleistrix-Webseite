export type Project = {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};


