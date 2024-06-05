export const host =
  import.meta.env.MODE === 'production'
    ? 'https://www.frsource.org'
    : 'http://localhost:3333';
