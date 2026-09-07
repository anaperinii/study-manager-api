export interface CreateCourseInput {
  title: string;
  description: string;
  workload: number;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  workload?: number;
}
