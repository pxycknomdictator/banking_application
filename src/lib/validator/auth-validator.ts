import { z } from "zod/v4";

export const emailSchema = z.strictObject({
	email: z.email({ error: "Invalid email address" })
});

export const loginSchema = emailSchema.safeExtend({
	password: z.string().min(8, { error: "Password must be 8 characters" })
});

export const signupSchema = loginSchema
	.safeExtend({
		name: z.string().min(2, { error: "Name must be 2 characters" }),
		username: z.string().min(2, { error: "Username must be 2 characters" }),
		password_confirm: z.string().min(8, { error: "Confirm Password must be 8 characters" })
	})
	.superRefine(({ password, password_confirm }, ctx) => {
		if (password !== password_confirm) {
			ctx.addIssue({
				code: "custom",
				message: "Password not matched",
				path: ["password_confirm"]
			});
		}
	});
