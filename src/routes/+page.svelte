<script lang="ts">
  let { data } = $props();
</script>

<div class="article-container">
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
  article {
    margin-bottom: 1rem;
    padding: 0.25rem 0 0.25rem 0;
    border-left: 4px solid var(--color-header-fg);
    padding-left: 1rem;
    background: var(--color-header-bg);
  }

  .article-container {
    max-width: 700px;
    margin: 2rem auto;
    background: var(--color-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 0 2px #313244;
    border: 1px solid #313244;
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
