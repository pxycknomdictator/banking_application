import { Resend } from "resend";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");

interface Email {
	receiver: string | Array<string>;
	subject: string;
	text: string;
}

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({ receiver, subject, text }: Email) {
	try {
		const res = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: receiver,
			subject: subject,
			html: text
		});

		if (res.error) {
			return error(res.error.statusCode as number, { message: res.error.message });
		}

		return res.data;
	} catch (e) {
		const errors = e as Error;
		return error(500, { message: errors.message || "unexpected error" });
	}
}
