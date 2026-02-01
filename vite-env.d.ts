/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_LOB_API_KEY?: string;
  readonly VITE_CLICK2MAIL_API_KEY?: string;
  readonly VITE_LETTERSTREAM_API_KEY?: string;
  readonly VITE_POSTGRID_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
