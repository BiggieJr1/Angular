// src/app/data/cursos.mock.ts

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  duracion: string;
  gradienteBg: string; 
  badgeColor: string;
}

export const CURSOS: Curso[] = [
  {
    id: 1,
    titulo: 'Desarrollo Moderno con Angular y Tailwind',
    descripcion: 'Domina la creación de interfaces dinámicas, componentes standalone y el nuevo control de flujo.',
    categoria: 'Frontend',
    duracion: '40 hrs',
    gradienteBg: 'from-red-500 to-pink-500',
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    id: 2,
    titulo: 'APIs REST con Spring Boot y MySQL',
    descripcion: 'Construye servicios robustos, gestiona bases de datos relacionales y asegura tus endpoints.',
    categoria: 'Backend',
    duracion: '55 hrs',
    gradienteBg: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-100 text-green-800'
  },
  {
    id: 3,
    titulo: 'Administración de Linux, Zabbix y Docker',
    descripcion: 'Gestiona servidores, monitoriza redes y automatiza despliegues mediante contenedores y scripts en bash.',
    categoria: 'DevOps',
    duracion: '35 hrs',
    gradienteBg: 'from-blue-500 to-cyan-500',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 4,
    titulo: 'Flujos Ágiles con Git, Bitbucket y Jira',
    descripcion: 'Control de versiones avanzado, integración continua y gestión de proyectos bajo metodologías ágiles.',
    categoria: 'Gestión',
    duracion: '20 hrs',
    gradienteBg: 'from-purple-500 to-indigo-500',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
];