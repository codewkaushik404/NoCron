import { emailConfigSchema, discordConfigSchema, slackConfigSchema, waitConfigSchema } from "./types.js";

const actionConfigRegistry = {
    sendEmail: emailConfigSchema,
    sendDiscordMessage: discordConfigSchema,
    sendSlackMessage: slackConfigSchema,
    wait: waitConfigSchema
}

export default actionConfigRegistry;