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
    <h1>{data.metaData.title}</h1>
    <p style="font-style:italic">
      Posted on {data.metaData.date.toDateString()}
    </p>
    <hr />
    {@html marked(data.content)}
  </article>
</div>

<style>
  .home-link {
    display: inline-block;
    padding-bottom: 1em;
  }
</style>
