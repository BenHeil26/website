import type { Post, PostMetaData } from "./models/post";
import fs from 'fs';
import yaml from 'js-yaml';

export default function(path: string): Post {
  let file = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' });
  console.log(file);

  let frontMatter = file.match(/^---.*---/)?.[0];
  console.log(frontMatter);

  if (frontMatter) {
    let metaData = yaml.load(frontMatter.replace('---', '')) as PostMetaData;
    let content = file.replace('^---.*---', '');
    return {
      metaData,
      content
    }
  }

  throw new Error;
}
