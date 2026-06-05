<script lang="ts">
	import { resolve } from "$app/paths";
	import { loginSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.login, {
		validators: zod4Client(loginSchema)
	});
</script>

<main>
	<section>
		<h1>Login page</h1>
		<form action="?/login" method="post" use:enhance>
			<div>
				<label for="email">Email:</label>
				<div>
					<input type="email" name="email" id="email" bind:value={$form.email} />
					{#if $errors.email}
						<small>{$errors.email}</small>
					{/if}
				</div>
			</div>

			<div>
				<div>
					<label for="password">Password:</label>
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
					<span>Don't have a account? <a href={resolve("/signup")}>Signup</a></span>
				</div>
				<button type="submit">Login</button>
			</section>
			<div>
				<button type="button">GitHub</button>
				<button type="button">Google</button>
				<button type="button">Microsoft</button>
			</div>
		</form>
	</section>
</main>
