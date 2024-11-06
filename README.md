# Apache Paimon Website UI

This project is a website UI for Apache Paimon.

## Development

### Install

Run `pnpm install` to install all dependencies.

> Note: Make sure you have installed [pnpm](https://pnpm.io/) before running the command.

### Dev server

Run `pnpm start` for a dev server. Navigate to `http://localhost:8801/`. The application will automatically reload if you change any of the source files.

### Build

Run `pnpm build` to build the project. The build artifacts will be stored in the `dist/` directory.

You can also run `npx http-server dist` to serve the build files to preview the website.

### Lint

Run `pnpm lint` to lint the project to ensure the code quality. Run `pnpm lint:fix` to fix the linting issues. Of course, `husky` will run the linting automatically before each commit.

## Internationalization

This project supports both English and Chinese. The language of the website (defaults to English) will be determined by the users choice in the website, which is stored in the browser's local storage.

### Add a new text

1. Import `TranslateModule` in the component where you want to translate the text.

    ```typescript
   // xxx.component.ts
    import { TranslateModule } from 'src/translate/translate.module';
    ```

2. Add the `translate` Directive to the HTML element you want to translate.

    ```html
    <p translate>This is an example text.</p>
    ```
   
    > Note: Refer to [@ngx-translate/core](https://github.com/ngx-translate/core) for more usages.

3. Extract the text to the `src/assets/i18n/{language}.json` file by running `pnpm i18n:extract`. 

    Then you can find the extracted text in both the `src/assets/i18n/en.json` and `src/assets/i18n/zh.json` file.

    ```json
    {
      "This is an example text.": "This is an example text."
    }
    ```
   
4. Manually update the translation in the `src/assets/i18n/zh.json` file.

    ```json
    {
      "This is an example text.": "这是一个示例文本。"
    }
    ```

### Update the translation

If you just want to update the Chinese translation, you can directly modify the `src/assets/i18n/zh.json` file.

If you want to update the English translation, you need to modify the component's HTML file and run `pnpm i18n:extract` to extract the text again, then update the `src/assets/i18n/zh.json` file.

## Blog Maintenance

### Add a new blog post

1. Create a new markdown file `{title}.md` in the `community/articles` directory.
2. Add the following front matter to the markdown file, including the title, author, categories, release date, and languages.

    ```markdown
    ---
    authors:
      - 李劲松
    categories:
      - 技术探索
    date: 2024.08.22
    languages:
      - zh
    ---
    ```

   Please make sure the date is in the format `yyyy.MM.dd`, and the language is either `en` or `zh`.

3. Parse the articles and generate the blog metadata by running `pnpm parse`. The metadata will be stored in the `src/assets/metadata/` directory.
4. Wait for the dev server to reload, and you can preview the new blog post on your localhost website.
5. Commit the changes and push them to the repository.

### Internationalization

The blog post supports both English and Chinese. The language of the blog post will be determined by the `languages` field in the front matter of the markdown file.

If user chooses the Chinese language in the website, the Chinese blog post will be displayed; otherwise, the English blog post will be displayed.

## Users Maintenance

List of users who are using Apache Paimon are maintained in the `src/assets/users/` file.

### Add a new user

Firstly You should prepare a new image file with transparent background (png format best) and which color is in grayscale.

Then add the image file `xxx.png` in the `src/assets/users/` directory and add the `xxx.png` item in the `WhosusingComponent`.

Save the file and preview the page to make sure it looks well.

## Release Notes Maintenance

The release notes are maintained in the `community/docs/releases` directory.

### Add a new release note

1. Create a new markdown file `release-{version}.md` in the `community/docs/releases` directory.
2. Add the following front matter to the markdown file, including the title, type (always `release`), semantic version, release date.

    ```markdown
    ---
    title: "Release 0.9"
    type: release
    version: 0.9.0
    ---
    ```
3. Update the latest version in the `community/docs/downloads.md`.
4. Commit the changes and push them to the repository.
