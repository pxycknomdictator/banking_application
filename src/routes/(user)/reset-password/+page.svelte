<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { resetPasswordSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	let { data } = $props();
	const token = page.url.searchParams.get("token");

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.form, {
		validators: zod4Client(resetPasswordSchema)
	});
</script>

<main>
	<section>
		<h1>Reset Your Password</h1>
		<form action="?/reset_password" method="post" use:enhance>
			<div>
				<input type="text" value={token} hidden name="token" id="token" />
			</div>

			<div>
				<label for="password">New Password</label>
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

			<div>
				<label for="password_confirm">Confirm New Password</label>
				<div>
					<input
						type="password"
						name="password_confirm"
						id="password_confirm"
						bind:value={$form.password_confirm}
					/>
					{#if $errors.password_confirm}
						<small>{$errors.password_confirm}</small>
					{/if}
				</div>
			</div>

			<section>
				<a href={resolve("/login")}>Back to Login</a>
				<button type="submit">Update Password</button>
			</section>
		</form>
	</section>
</main>
