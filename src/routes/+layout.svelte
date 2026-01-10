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
  <a href="mailto:ben.heil.dev@gmail.com" rel="me">Email me</a>
  <a href="https://github.com/BenHeil26" rel="me">Github</a>
  <a href="www.linkedin.com/in/ben--heil" rel="me">LinkedIn</a>
  <br />
  <br />
  <a href="https://xn--sr8hvo.ws/previous">←</a>
  An <a href="https://xn--sr8hvo.ws">IndieWeb Webring</a> 🕸💍
  <a href="https://xn--sr8hvo.ws/next">→</a>
</footer>
