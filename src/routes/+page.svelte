<script lang="ts">
  import { onMount } from "svelte";
  import { typewriter } from "$lib/transitions.js";

  let { data } = $props();
  let visible = $state(false);

  onMount(() => {
    visible = true;
  });
</script>

<div class="welcome">
  <pre class="welcome-banner">
\ \      / /__| | ___ ___  _ __ ___   ___ 
 \ \ /\ / / _ \ |/ __/ _ \| '_ ` _ \ / _ \
  \ V  V /  __/ | (_| (_) | | | | | |  __/
   \_/\_/ \___|_|\___\___/|_| |_| |_|\___|
  </pre>
  <div class="typewrite-placeholder">
    {#if visible}
      <h4 transition:typewriter={{ speed: 4 }}>
        ** A collection of notes, snippets, and other ramblings
      </h4>
    {/if}
  </div>
</div>

<div class="article-container">
  <h2>Latest Blogs</h2>
  {#each data.posts as post}
    <article>
      <h2>
        <a class="post-title" href="/blogs/{post.fname}"
          >{post.metaData.title}</a
        >
      </h2>
      <div class="post-meta">Posted on {post.metaData.date.toDateString()}</div>
      <p>
        {post.metaData.desc}
      </p>
    </article>
  {/each}
</div>

<style>
  .typewrite-placeholder {
    display: block;
    min-height: 1.5rem;
  }

  .welcome {
    max-width: 700px;
    width: 100%;
    margin: 2rem auto;
    color: var(--color-header-fg);
  }

  .welcome-banner {
    font-size: 1.5rem;
  }

  article {
    margin-bottom: 1rem;
    padding: 0.25rem 0 0.25rem 0;
    border-left: 4px solid var(--color-header-fg);
    padding-left: 1rem;
    background: var(--color-header-bg);
  }

  .post-title {
    text-decoration: none;
    font-weight: bold;
  }

  h2:has(.post-title) {
    margin: 0.5rem 0 0.5rem 0;
  }

  .post-meta {
    color: var(--color-link);
    font-size: 0.9em;
    font-style: italic;
  }
</style>
