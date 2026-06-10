import { db } from "$lib/server/db";

export async function generateUniqueUsername(name: string): Promise<string> {
	const base = name
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "");

	const existing = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.username, base)
	});

	if (!existing) return base;

	const suffix = Date.now().toString(36).slice(-4);
	return `${base}_${suffix}`;
}
