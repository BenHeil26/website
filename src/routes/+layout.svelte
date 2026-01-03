<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Ben Heil's Blog</title>
</svelte:head>

<header>
  <p>Ben's Tech Blog</p>
</header>

<main>
  {@render children()}
</main>

<footer>
  &copy; 2026 Ben Heil. All rights reserved.
  <br />
  <a href="mailto:ben.heil.dev@gmail.com">Email me</a>
</footer>
