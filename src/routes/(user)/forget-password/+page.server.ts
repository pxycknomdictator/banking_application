import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { emailSchema } from "$lib/validator/auth-validator";

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(emailSchema));
	return { form };
};

export const actions: Actions = {
	async forget_password({ request }) {
		const form = await superValidate(request, zod4(emailSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form.data);
	}
};
