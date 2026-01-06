<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../styles.css";
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Ben Heil's Blog</title>
</svelte:head>

<!-- <header> -->
<!--   <pre> -->
<!-- \ \      / /__| | ___ ___  _ __ ___   ___  -->
<!--  \ \ /\ / / _ \ |/ __/ _ \| '_ ` _ \ / _ \ -->
<!--   \ V  V /  __/ | (_| (_) | | | | | |  __/ -->
<!--    \_/\_/ \___|_|\___\___/|_| |_| |_|\___| -->
<!--   </pre> -->
<!-- </header> -->

<main>
  {@render children()}
</main>

<footer>
  &copy; 2026 Ben Heil. All rights reserved.
  <br />
  <a href="mailto:ben.heil.dev@gmail.com">Email me</a>
</footer>
