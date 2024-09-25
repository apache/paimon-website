import { processProfiles } from './handlers/profile';
import { processArticles } from './handlers/article';
import { processRoutes } from './handlers/prerender';
import { processSearch } from './handlers/search';

const profiles = processProfiles();

const articles = processArticles(profiles);
// init folder
processRoutes(articles, profiles);
processSearch(articles, profiles);
