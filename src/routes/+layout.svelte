<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../styles.css";
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Ben Heil's Blog</title>
</svelte:head>

<main>
  {@render children()}
</main>

<footer>
  &copy; 2026 Ben Heil. All rights reserved.
  <br />
  <a href="mailto:ben.heil.dev@gmail.com">Email me</a>
</footer>
