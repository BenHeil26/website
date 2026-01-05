<script lang="ts">
  import { onMount } from "svelte";

  import hljs from "highlight.js";
  import mermaid from "mermaid";
  import { marked } from "marked";

  onMount(() => {
    hljs.highlightAll();
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    mermaid.run();
  });

  let { data } = $props();
</script>

<div class="article-container">
  <a class="home-link" href="/">Home</a>
  <article>
    <p style="font-style:italic">
      Posted on {data.metaData.date.toDateString()}
    </p>
    {@html marked(data.content)}
  </article>
</div>

<style>
  .article-container {
    max-width: 700px;
    margin: 2rem auto;
    background: var(--color-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 0 2px #313244;
    border: 1px solid #313244;
  }

  .home-link {
    display: inline-block;
    padding-bottom: 1em;
  }
</style>
