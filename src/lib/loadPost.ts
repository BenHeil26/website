import type { Post, PostMetaData } from "./models/post";
import fs from 'fs';
import yaml from 'js-yaml';

export default function(path: string): Post {
  let file = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' });

  let frontMatter = file.split('---\n').at(1);
  let fname = path.split('/').at(-1);
  let content = file.split('---\n').slice(2);
  if (frontMatter && fname && content) {
    let metaData = yaml.load(frontMatter.replace('---', '')) as PostMetaData;
    return {
      metaData,
      content: content.join('---\n'),
      fname
    }
  }

  throw new Error;
}
