import type { CollectionEntry } from "astro:content";
import getReadingTime from "reading-time";

type Post = CollectionEntry<"blog">;

type PostWithReadingTime<T> = T extends Post[] ? Post[] : Post;

export function withReadingTime<T extends Post[] | Post>(
  posts: T
): PostWithReadingTime<T> {
  if (Array.isArray(posts)) {
    posts.forEach(post => {
      post.data.readingTime = getReadingTime(post.body).text;
    });
    return posts as PostWithReadingTime<T>;
  } else {
    posts.data.readingTime = getReadingTime(posts.body).text;
    return posts as PostWithReadingTime<T>;
  }
}
