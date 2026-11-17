export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export const succeed = <T>(data: T): ActionResult<T> => ({ ok: true, data });
export const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
