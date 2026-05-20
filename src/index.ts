import type { Plugin, Hooks } from "@opencode-ai/plugin"

export const InjectSessionIdPlugin: Plugin = async () => {
  const sessionIds = new Map<string, string>()

  return {
    event: async ({ event }) => {
      if ((event.type === "session.created") || (event.type === "session.idle") || (event.type === "server.connected")) {
        sessionIds.set("sessionId", event.properties.sessionID)
      }
    },

    "shell.env": async (input, output) => {
      const stored = sessionIds.get("sessionId")
      if (!stored) {
        delete output.env.OPENCODE_SESSION_ID
      }
      output.env.OPENCODE_SESSION_ID = stored
    },
  } satisfies Hooks
}

export default {
  id: "inject-session-id",
  server: InjectSessionIdPlugin,
}
