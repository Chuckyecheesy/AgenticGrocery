import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the project AGENTS.md. Next would otherwise append its own agent rules.
  agentRules: false,
};

export default nextConfig;
