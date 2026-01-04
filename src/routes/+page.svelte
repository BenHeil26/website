<script lang="ts">
  let { posts } = $props();
</script>

<div class="article-container">
  {#each posts as post}
    <article>
      <h2>
        <a class="post-title" href="/blogs/{post.slug}">{post.title}</a>
      </h2>
      <div class="post-meta">Posted on {post.date}</div>
      <p>
        {post.desc}
      </p>
    </article>
  {/each}
</div>

<style>
  article {
    margin-bottom: 1rem;
    padding: 0.25rem 0 0.25rem 0;
    border-left: 4px solid #b91c4a;
    padding-left: 1rem;
    background: rgba(30, 30, 46, 0.7);
  }

  .article-container {
    max-width: 700px;
    margin: 2rem auto;
    background: #181825;
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
    color: #a6adc8;
    font-size: 0.9em;
    font-style: italic;
  }
</style>
