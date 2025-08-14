import { create } from "zustand";
import type { Project } from "@/types/models";

type ProjectState = {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  addProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...project,
        },
      ],
    })),
}));


