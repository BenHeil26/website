import fs from 'fs';
import loadPost from '$lib/loadPost';

export function load() {
  let dir = './content/posts';
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      throw new Error;
    }

    return files.map(file => loadPost(`${dir}/${file}`));
  });
}
