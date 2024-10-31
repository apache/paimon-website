/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import GithubSlugger from 'github-slugger';
import { Renderer, marked, Tokens } from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { loadFront as parseMarkdownWithYAML } from 'yaml-front-matter';

loadLanguages(['java']);

const githubSlugger = new GithubSlugger();

class ArticleRender extends Renderer {
  override heading({ text, depth }: Tokens.Heading): string {
    const slugText = githubSlugger.slug(text);
    if (depth === 1) {
      return ``;
    } else {
      return `<h${depth} id="${slugText}">${text}</h${depth}>`;
    }
  }

  override code({ text, lang }: Tokens.Code): string {
    const language = prism.languages[lang!] || prism.languages['java'];
    const highlight = prism.highlight(text, language, lang!);
    return `<pre class="code"><code>${highlight}</code></pre>`;
  }

  override image({ href, title }: Tokens.Image): string {
    return `<img class="img-responsive" src="${href}" alt="${title}">`;
  }

  override link({ href, title, text }: Tokens.Link): string {
    return `<a href="${href}" target="_blank" title="${title}" rel="noopener">${text}</a>`;
  }
}

const parseMarkdownToHTMLWithSlug = (content: string): string => {
  githubSlugger.reset();
  return marked.parse(content, { renderer: new ArticleRender() }) as string;
};

export { githubSlugger, parseMarkdownWithYAML, parseMarkdownToHTMLWithSlug as parseMarkdownToHTML };
