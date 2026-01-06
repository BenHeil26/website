import fs from 'fs';
import loadPost from '$lib/loadPost';

export function load({ url }: { url: URL }) {
  let page: number = parseInt(url.searchParams.get('page') ?? '0');
  let size: number = parseInt(url.searchParams.get('size') ?? '5');
  let visible: boolean = url.searchParams.get('visible') === 'true';

  let dir = './content/posts';
  let files = fs.readdirSync(dir);
  let allPosts = files.map(file => loadPost(`${dir}/${file}`));

  let pages = Math.floor(allPosts.length / size);
  if (page > pages) page = 0;

  let posts = allPosts
    .sort((l, r) => l.metaData.date < r.metaData.date ? 1 : -1)
    .slice(page * size, (page * size) + size);

  console.log(posts, pages, size)

  return { posts, pages, page, size, visible };
}

