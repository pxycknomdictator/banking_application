<script lang="ts">
	let { data } = $props();
</script>

<main>
	{#if data}
		<h1>Welcome {data.name}</h1>
		<span>Session Id: {data.session}</span>
	{/if}
</main>
