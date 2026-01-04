import type { Post, PostMetaData } from '$lib/models/post';
import loadPost from '$lib/loadPost';

export function load({ params }): Post {
  return loadPost(`./content/posts/${params.slug}`);
}
