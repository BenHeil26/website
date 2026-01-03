<script lang="ts">
  let { data } = $props();
</script>

{#each data.posts as post}
  <div class="article-container">
    <article>
      <h2>
        <a class="post-title" href="/blogs/{post.slug}">{post.title}</a>
      </h2>
      <div class="post-meta">Posted on {post.date}</div>
      <p>
        {post.desc}
      </p>
    </article>
  </div>
{/each}

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
  .post-title {
    color: #b4befe;
    text-decoration: none;
    font-weight: bold;
  }

  .post-title:hover {
    color: #f38ba8;
  }

  .post-meta {
    color: #a6adc8;
    font-size: 0.9em;
    font-style: italic;
  }
</style>
