
type MessageActionName = "sendDiscordMessage" | "sendSlackMessage";

async function sendMessage(name: MessageActionName, webhookUrl: string, message: string) {
    const payload = name === "sendDiscordMessage"
        ? { content: message }
        : { text: message };

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        redirect: "error",
        signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
        throw new Error(`${name} webhook request failed with status ${response.status}`);
    }
}

export default sendMessage;