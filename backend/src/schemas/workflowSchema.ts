import { z } from "zod";

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),

  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  data: z.record(z.string(), z.unknown()),
});

const edgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  dest: z.string().min(1),
  sourceHandle: z.string().nullable(),
});

export const workflowSchema = z.object({
  is_active: z.boolean(),
  user_id: z.string().nullable(),

  node_config: z.object({
    nodes: z.array(nodeSchema),
    edges: z.array(edgeSchema),
  }),
});