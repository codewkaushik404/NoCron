import { z } from "zod";

function formatFieldLabel(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/^./, (character) => character.toUpperCase());
}

export default function getConfigFields(schema: z.ZodObject): Array<Record<string, unknown>> {
    return Object.entries(schema.shape).map(([key, field]) => {
        const metadata = field.meta() ?? {};

        return {
            key,
            label: metadata.label ?? formatFieldLabel(key),
            control: metadata.control ?? "text",
            required: !field.isOptional(),
            ...(metadata.mono === true ? { mono: true } : {}),
            ...(typeof metadata.min === "number" ? { min: metadata.min } : {}),
            ...(typeof metadata.max === "number" ? { max: metadata.max } : {}),
            ...(metadata.defaultValue !== undefined
                ? { defaultValue: metadata.defaultValue }
                : {}),
        };
    });
}
