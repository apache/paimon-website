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
import marked from 'marked';

import { ExtendTokensList, generateTOC, TOC } from './article';
import { parseMarkdownToHTML, parseMarkdownWithYAML } from '../utils/markdown';

/**
 * Raw data parsed from yaml & markdown
 */
export class Document {
  constructor(
    readonly title: string,
    readonly type: string, // 'release' | 'download'
    readonly content: string,
    readonly alias: string,
    readonly version?: string
  ) {}
}

/**
 * Resolved document used to render in web
 */
export class ResolvedDocument {
  constructor(
    readonly title: string,
    readonly type: string, // 'release' | 'download'
    readonly content: string,
    readonly toc: TOC[],
    readonly alias: string, // for `Edit this page` button
    readonly version?: string
  ) {}
}

export class BriefRelease {
  constructor(
    readonly title: string,
    readonly version: string
  ) {}
}

/**
 * parse document from buffer with yaml & markdown
 * @param name
 * @param buffer
 */
export function parseDocumentFromBuffer(name: string, buffer: Buffer): Document {
  try {
    const { title, type, version, alias, __content } = parseMarkdownWithYAML(buffer);
    return new Document(title, type, __content, alias, version);
  } catch (e) {
    console.log(e);
    throw new Error(name);
  }
}

/**
 * Correct and add more properties to document
 * @param doc
 */
export function resolveDocument(doc: Document): ResolvedDocument {
  const { title, type, content, alias, version } = doc;
  const tokensList = new marked.Lexer().lex(doc.content) as unknown as ExtendTokensList;

  const contentString = parseMarkdownToHTML(content);
  const toc = generateTOC(tokensList);
  return new ResolvedDocument(title, type, contentString, toc, alias, version);
}
