<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/auth-client";
	import { loginSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.login, {
		validators: zod4Client(loginSchema),
		async onResult({ result }) {
			if (result.type === "success") {
				await goto(resolve("/dashboard"), { replaceState: true });
			}
		}
	});

	type SocialProvider = "google" | "github" | "microsoft";

	async function loginWithSocial(provider: SocialProvider) {
		const { error } = await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
		if (error) console.error(error);
	}
</script>

<main>
	<section>
		<h1>Login</h1>
		<form action="?/login" method="post" use:enhance>
			<div>
				<label for="email">Email Address</label>
				<div>
					<input type="email" name="email" id="email" bind:value={$form.email} />
					{#if $errors.email}
						<small>{$errors.email}</small>
					{/if}
				</div>
			</div>

			<div>
				<div>
					<label for="password">Password</label>
					<span>
						<a href={resolve("/forget-password")}>forget-password?</a>
					</span>
				</div>
				<div>
					<input
						type="password"
						name="password"
						id="password"
						bind:value={$form.password}
					/>
					{#if $errors.password}
						<small>{$errors.password}</small>
					{/if}
				</div>
			</div>

			<section>
				<div>
					<span>Don't have an account? <a href={resolve("/signup")}>Signup</a></span>
				</div>
				<button type="submit">Login</button>
			</section>
			<div>
				<button type="button" onclick={() => loginWithSocial("github")}>GitHub</button>
				<button type="button" onclick={() => loginWithSocial("google")}>Google</button>
				<button type="button" onclick={() => loginWithSocial("microsoft")}>Microsoft</button
				>
			</div>
		</form>
	</section>
</main>
