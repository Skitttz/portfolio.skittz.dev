import { defineCollection, z } from 'astro:content';
import { glob } from "astro/loaders";


const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.date(),
    author: z.string(),
    lang: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  articles: postsCollection,
};
