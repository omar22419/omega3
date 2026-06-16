import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode: eliminates the SSR/localStorage mismatch in the original.
  // Auth, workspace selection, and theme all use localStorage and are
  // incompatible with server rendering without full hydration guards.
  ssr: false,
} satisfies Config;
