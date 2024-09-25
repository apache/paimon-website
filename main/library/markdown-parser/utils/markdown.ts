import { loadFront as parseMarkdownWithYAML } from 'yaml-front-matter';
import prism from 'prismjs';
import GithubSlugger from 'github-slugger';
import loadLanguages from 'prismjs/components/';
import { Renderer, marked, Tokens } from 'marked';
loadLanguages(['java']);

const githubSlugger = new GithubSlugger();

class ArticleRender extends Renderer {
  override heading({ text, depth }: Tokens.Heading) {
    const slugText = githubSlugger.slug(text);
    if (depth === 1) {
      return ``;
    } else {
      return `<h${depth} id="${slugText}">${text}</h${depth}>`;
    }
  }
  override code({ text, lang }: Tokens.Code) {
    const language = prism.languages[lang!] || prism.languages['java'];
    const highlight = prism.highlight(text, language, lang!);
    return `<pre class="code"><code>${highlight}</code></pre>`;
  }

  override image({ href, title }: Tokens.Image) {
    return `<img class="img-responsive" src="${href}" alt="${title}">`;
  }

  override link({ href, title, text }: Tokens.Link) {
    return `<a href="${href}" target="_blank" title="${title}" rel="noopener">${text}</a>`;
  }
}

const parseMarkdownToHTMLWithSlug = (content: string): string => {
  githubSlugger.reset();
  return marked.parse(content, { renderer: new ArticleRender() }) as string;
};

export { githubSlugger, parseMarkdownWithYAML, parseMarkdownToHTMLWithSlug as parseMarkdownToHTML };
