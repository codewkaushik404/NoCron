import { z } from "zod";

/** ACTIONS CONFIG SCHEMA */
export const emailConfigSchema = z.object({
    to: z.email().meta({ label: "Recipient", control: "text", mono: true }),
    subject: z.string().meta({ label: "Subject", control: "text" }),
    body: z.string().meta({ label: "Message", control: "textarea" }),
}).strict()

export const discordConfigSchema = z.object({
    webhook_url: z.url({ protocol: /^https$/, hostname: /^(discord|discordapp)\.com$/ })
        .meta({ label: "Discord webhook URL", control: "text", mono: true }),
    message: z.string().min(2).meta({ label: "Message", control: "textarea" })
}).strict()

export const slackConfigSchema = z.object({
    webhook_url: z.url({ protocol: /^https$/, hostname: /^hooks\.slack\.com$/ })
        .meta({ label: "Slack webhook URL", control: "text", mono: true }),
    message: z.string().min(2).meta({ label: "Message", control: "textarea" })
}).strict()

export const waitConfigSchema = z.object({
    wait_time: z.coerce.number().nonnegative().max(60)
        .meta({ label: "Wait time in minutes", control: "number", min: 0, max: 60 })
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