import { z } from "zod";

/** ACTIONS CONFIG SCHEMA */
export const emailConfigSchema = z.object({
    to: z.email(),
    subject: z.string(),
    body: z.string(),
}).strict()

export const discordConfigSchema = z.object({
    webhook_url: z.url({ protocol: /^https$/, hostname: /^(discord|discordapp)\.com$/ }),
    message: z.string().min(2)
}).strict()

export const slackConfigSchema = z.object({
    webhook_url: z.url({ protocol: /^https$/, hostname: /^hooks\.slack\.com$/ }),
    message: z.string().min(2)
}).strict()

export const waitConfigSchema = z.object({
    wait_time: z.coerce.number().nonnegative().max(60) //minutes
}).strict()

/** TRIGGER CONFIG SCHEMA */
export const webhookConfigSchema = z.object({
    
});

export const idSchema = z.uuid();

export const workflowSchema = z.object({
    name: z.string().min(3),
    trigger: z.object({
        name: z.string().min(3),
        type: z.string().min(3),
        config: z.record(z.string(), z.unknown())
    }),
    actions: z.array(z.object({
        name: z.string().min(3),
        type: z.string().min(3),
        config: z.record(z.string(), z.unknown()),
        order: z.number()
    }))
}).strict();


export type EmailConfig = z.infer<typeof emailConfigSchema>;
export type DiscordConfig = z.infer<typeof discordConfigSchema>;
export type SlackConfig = z.infer<typeof slackConfigSchema>;