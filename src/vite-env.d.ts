/// <reference types="vite/client" />

// vite-imagetools resize imports, e.g. '@/assets/x.webp?w=800&format=webp'
declare module '*&format=webp&quality=78' {
  const src: string;
  export default src;
}
