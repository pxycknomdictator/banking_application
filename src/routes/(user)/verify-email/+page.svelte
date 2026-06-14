<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import Logo from "$components/Logo.svelte";
	import LockIcon from "$lib/assets/lock.svg";
	import Footer from "$components/Footer.svelte";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { enhance } = superForm(data.form);
</script>

<main class="flex min-h-screen flex-col">
	<header class="flex h-20 w-full items-center border border-outline px-16">
		<nav class="flex w-full items-center justify-between">
			<Logo />
			<div>
				<img src={LockIcon} alt="lock_icon" />
			</div>
		</nav>
	</header>
	<section class="flex flex-1">
		<div>
			<h1>Check your inbox</h1>
			<span>{data.maskedEmail}</span>
			<p>
				We've sent a verification link to your email address. Please click the link in the
				email to verify your account.
			</p>
		</div>
		<form action="?/resend_email" method="post" use:enhance>
			<div>
				<input type="email" value={data.email} hidden name="email" id="email" />
			</div>

			<button type="submit">Resend Verification Email</button>
		</form>
		<div>
			<p>Didn't get the email? Check your spam folder.</p>
		</div>
	</section>
	<Footer linkTexts={["Privacy Policy", "Shariah Governance", "Support"]} />
</main>
