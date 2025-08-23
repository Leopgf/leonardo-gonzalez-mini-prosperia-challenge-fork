export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: process.env.DATABASE_URL!,
  OCR_PROVIDER: (process.env.OCR_PROVIDER || "tesseract") as "tesseract" | "mock",
  AI_PROVIDER: (process.env.AI_PROVIDER || "mock") as "openai" | "mock",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "http://localhost:8080",
  PROSPERIA_TOKEN: process.env.PROSPERIA_TOKEN || "nombre-apellido"
};
