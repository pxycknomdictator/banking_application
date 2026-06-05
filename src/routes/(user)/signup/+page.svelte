<script lang="ts">
	import { resolve } from "$app/paths";
	import { signupSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.signup, {
		validators: zod4Client(signupSchema)
	});
</script>

<main>
	<section>
		<h1>Signup page</h1>
		<form action="?/signup" method="post" use:enhance>
			<div>
				<label for="name">Name:</label>
				<div>
					<input type="text" name="name" id="name" bind:value={$form.name} />
					{#if $errors.name}
						<small>{$errors.name}</small>
					{/if}
				</div>
			</div>

			<div>
				<label for="username">Username:</label>
				<div>
					<input type="text" name="username" id="username" bind:value={$form.username} />
					{#if $errors.username}
						<small>{$errors.username}</small>
					{/if}
				</div>
			</div>

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
				<label for="password">Password:</label>
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
				<label for="password_confirm">Confirm Password:</label>
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
				<div>
					<span>Already have a account? <a href={resolve("/login")}>Login</a></span>
				</div>
				<button type="submit">Signup</button>
			</section>
		</form>
	</section>
</main>
