import {z} from "zod";

export default function validateConfig<T extends z.ZodType>(
    schema: T, 
    name: string, 
    config: unknown
): z.infer<T> {
    const result = schema.safeParse(config);
    if (!result.success) {
        throw new Error(`Invalid config for ${name}`, { cause: result.error });
    }
    return result.data;
}