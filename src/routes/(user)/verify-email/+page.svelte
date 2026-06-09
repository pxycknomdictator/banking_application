<script lang="ts">
	import { enhance } from "$app/forms";

	let { data } = $props();
</script>

<main>
	<section>
		<h1>Check your inbox</h1>
		<div>
			<span>{data.maskedEmail}</span>
			<p>
				We've sent a verification link to your email address. Please click the link in the
				email to verify your account.
			</p>
		</div>
		<form action="?/resend_email" method="post" use:enhance>
			<button type="submit">Resend Verification Email</button>
		</form>
		<div>
			<p>Didn't get the email? Check your spam folder.</p>
		</div>
	</section>
</main>
