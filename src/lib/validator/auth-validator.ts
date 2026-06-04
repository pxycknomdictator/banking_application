import { z } from "zod/v4";

export const emailSchema = z.strictObject({
	email: z.email({ error: "Invalid email address" })
});

export const passwordSchema = z.strictObject({
	password: z.string().min(8, { error: "Password must be 8 characters" })
});

export const loginSchema = z.strictObject({
	...emailSchema.shape,
	...passwordSchema.shape
});

export const signupSchema = loginSchema
	.safeExtend({
		name: z.string().min(2, { error: "Name must be 2 characters" }),
		username: z.string().min(2, { error: "Username must be 2 characters" }),
		password_confirm: z.string().min(8, { error: "Confirm Password must be 8 characters" })
	})
	.superRefine(({ password, password_confirm }, ctx) => {
		if (password_confirm.length >= 8 && password !== password_confirm) {
			ctx.addIssue({
				code: "custom",
				message: "Password not matched",
				path: ["password_confirm"]
			});
		}
	});

export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
