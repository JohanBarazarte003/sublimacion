import type { NextConfig } from "next";

const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // Tailwind 4 se procesa con el cargador de Turbopack (valor por defecto de create-next-app)
  turbopack: {
    rules: {
      "*.css": { as: "*.css", loaders: ["@tailwindcss/turbopack"] },
    },
  },

  images: {
    // Permite mostrar imágenes públicas de TU proyecto de Supabase
    remotePatterns: urlSupabase
      ? [
          {
            protocol: "https",
            hostname: new URL(urlSupabase).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;