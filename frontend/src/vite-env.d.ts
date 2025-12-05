/// <reference types="vite/client" />

// Declaración de módulos CSS
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Permitir importaciones de archivos CSS sin errores de tipo
declare module '*.module.css';
