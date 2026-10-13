// Some registry components (e.g. qiuye-ui) read `process.env.NODE_ENV`.
// Vite statically replaces it at build time; this only provides the type.
declare const process: {
  readonly env: {
    readonly NODE_ENV?: "development" | "production" | "test"
  }
}
