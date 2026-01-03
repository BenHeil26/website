<script lang="ts">
  import SvelteMarkdown from "@humanspeak/svelte-markdown";

  let { data } = $props();
</script>

<div class="article-container">
  <a href="/"> Home</a>
  <article>
    <SvelteMarkdown source={data.content} />
  </article>
</div>

<style>
  .article-container {
    max-width: 700px;
    margin: 2rem auto;
    background: #181825;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 0 2px #313244;
    border: 1px solid #313244;
  }
</style>
