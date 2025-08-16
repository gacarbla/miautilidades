// error-utils.ts
import { inspect } from "util";

const TOKEN_RE = /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g; // patrón típico token Discord
const WEBHOOK_RE = /https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/gi;
const AUTH_RE = /(authorization|api[-_ ]?key|token)\s*[:=]\s*([^\s'"]+)/gi;

export function redact(value: unknown): unknown {
    if (typeof value === "string") {
        return value
            .replace(TOKEN_RE, "[REDACTED_TOKEN]")
            .replace(WEBHOOK_RE, "[REDACTED_WEBHOOK]")
            .replace(AUTH_RE, (_m, k) => `${k}: [REDACTED]`);
    }
    if (Array.isArray(value)) return value.map(redact);
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[k] = redact(v);
        return out;
    }
    return value;
}

export function serializeError(err: unknown): Record<string, unknown> {
    if (err instanceof Error) {
        const base: Record<string, unknown> = {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
        // Copia props no enumerables/enumerables adicionales
        for (const key of Object.getOwnPropertyNames(err)) {
            if (!(key in base)) base[key] = (err as any)[key];
        }
        // DiscordAPIError u otros que exponen .code/.status/rawError
        const anyErr = err as any;
        if (anyErr.code !== undefined) base.code = anyErr.code;
        if (anyErr.status !== undefined) base.status = anyErr.status;
        if (anyErr.rawError) base.rawError = anyErr.rawError;
        if (anyErr.cause) base.cause = serializeError(anyErr.cause);
        return base;
    }

    if (typeof err === "string") return { name: "Error", message: err };
    if (err && typeof err === "object") {
        try {
            return JSON.parse(JSON.stringify(err));
        } catch {
            return { value: inspect(err, { depth: 3 }) };
        }
    }

    return { value: String(err) };
}

export function newErrorId(): string {
    return `E-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

export const ErrorUtils = {
    newErrorId,
    serializeError,
    redact
}