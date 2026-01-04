export class PostMetaData {
  title!: string;
  date!: Date;
  desc!: string;
}

export class Post {
  metaData!: PostMetaData;
  content!: string;
}
