export type StreamChunk =
  | { type: 'text';        content: string }
  | { type: 'tool_call';   skill: string; params: unknown }
  | { type: 'skill_progress'; steps: unknown[] }
  | { type: 'tool_result'; component: string; props: unknown }
  | { type: 'error';       message: string }
  | { type: 'done' }
