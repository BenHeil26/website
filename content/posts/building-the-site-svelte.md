---
title: "Getting Started with SvelteKit"
date: 2026-01-10
desc: Learn about why I chose SvelteKit to build my personal site
---

It has been about seven years since I've built a personal website. My last one was built using Angular 4 and honestly was more of a digital business card - I think I built it as one more project to throw on my résumé.

I'd like for this site to be a lot different. I'm building content here with myself in mind as the primary audience. And while I do hope that others out there benefits from it, I am not building it for any reason other than my own enjoyment.

That being said, I'm creating a post that will document the basics of how I put the site together using SvelteKit. I won't cover every detail - but you can find the code on my GitHub [here](https://github.com/BenHeil26/website).

## Getting Started

First things first, I had to think through what tools I would use. I considered several frameworks like React, NextJS, Ember, before ultimately landing on Svelte. The reason that Svelte spoke to me over the others was its developer experience. As I mentioned above, I used Angular for a lot of my earlier career. I've also used React extensively a Paylocity. Both of those frameworks have a heavy barrier to entry due to their complexity. While that complexity is a necessary evil for what makes them great, it isn't always necessary for simpler sites such as this one. 

Svelte essentially can do the same things that the more popular frameworks can, while reducing the amount of setup boilerplate required. Svelte is able to do this because it follows some pretty strict conventions that other frameworks don't. For instance, the folder structure of your source code dictates the way your application creates routes between pages, and pages within directories follow a convention that determines their purpose.

For example see the source tree for this site below:

```
src
├── app.d.ts
├── app.html
├── lib
│   ├── assets
│   │   └── favicon.svg
│   ├── loadPost.ts
│   ├── models
│   │   └── post.ts
│   └── transitions.ts
├── routes
│   ├── +layout.server.ts
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── blogs
│       └── [slug]
│           ├── +page.server.ts
│           └── +page.svelte
└── styles.css
 
```

It's very clear to the reader what each file is responsible for. 

To learn more about Svelte and how to setup a SvelteKit project, go through the [tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte) on their site.

## Adding the Home Page 

Creating a page in Svelte is straightforward. Each page has three components which anyone familiar with web development will be familiar with - content, functionality, and styles.

### Content

Content is encoded via plain html in conjunction with additional helper directives like `#if` and `#each` that users of React or Angular would be quickly comfortable with.
```html
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
```

### Functionality

Functionality is controlled by a top level `<script>` tag which contains typescript or JavaScript that interacts with the rich library of [runes](https://svelte.dev/blog/runes) available in Svelte which provide reactivity.

```html

<script lang="ts">
  import { onMount } from "svelte";
  import { typewriter } from "$lib/transitions.js";

  let { data } = $props();

  let visible = $state(data.visible);

  onMount(() => {
    visible = true;
  });
</script>
```

### Styling

Styling is done in top level `style` tags and is only effective for the components within that file, which makes it a little tougher to share styles but is still possible. 

```html
<style>
  .home-link {
    display: inline-block;
    padding-bottom: 1em;
  }
</style>

```

If I had one word to describe this framework I would chose "ergonomic", that is, designed with the human as the first priority. 
