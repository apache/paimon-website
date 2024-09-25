export const Configuration = {
  image: {
    profile: [] as string[],
    article: [] as string[]
  },
  directory: {
    source: 'community',
    dist: 'metadata',
    article: 'articles',
    profile: 'profiles',
    search: 'search'
  },
  article: {
    abstract: {
      minLength: 150
    }
  }
};
