export interface CourseProps {
  id?: number | null;
  title: string;
  description: string;
  workload: number;
}

export interface CourseJSON {
  id: number | null;
  title: string;
  description: string;
  workload: number;
}

class Course {
  readonly id: number | null;
  readonly title: string;
  readonly description: string;
  readonly workload: number;

  constructor({ id = null, title, description, workload }: CourseProps) {
    this.id = id;
    this.title = title.trim();
    this.description = description.trim();
    this.workload = Number(workload);
  }

  toJSON(): CourseJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      workload: this.workload,
    };
  }
}

export default Course;
