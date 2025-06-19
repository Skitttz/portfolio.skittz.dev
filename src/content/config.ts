import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.date(),
    author: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  articles: postsCollection,
};
