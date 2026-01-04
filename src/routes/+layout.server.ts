import fs from 'fs';
import loadPost from '$lib/loadPost';

export function load() {
  let dir = './content/posts';
  let files = fs.readdirSync(dir);
  let posts = files.map(file => loadPost(`${dir}/${file}`));
  return { posts };
}
