/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Alternative simpler declaration (if you only import CSS for side effects):
// declare module '*.css';