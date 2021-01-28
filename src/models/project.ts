export interface Project {
  id: number
  name: string
}

export interface ProjectCreate {
  name: string
}

// export function getProjectName(projects: Project[], id: number) {
//   const project = projects.find((elem: Project) => elem.id === id)
//   if (project) return project.name
//   else return ''
// }
