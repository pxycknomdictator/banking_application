import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";

const betterAuthHandle: Handle = async ({ resolve, event }) => {
	const clientSession = await auth.api.getSession({
		headers: event.request.headers
	});

	if (clientSession) {
		event.locals.user = clientSession.user;
		event.locals.session = clientSession.session;
	}

	return svelteKitHandler({ auth, building, resolve, event });
};

export const handle: Handle = sequence(betterAuthHandle);
