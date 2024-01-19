// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Apache Paimon Incubating',
  tagline: 'Streaming data lake platform with high-speed data \n ingestion, changelog tracking and efficient real-time \n analytics.',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://paimon.apache.org/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'apache', // Usually your GitHub org/user name.
  projectName: 'Paimon', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },

    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: true,
      },
      image: 'img/hero.jpg',
      navbar: {
        title: 'Apache Paimon',
        logo: {
          alt: 'Apache Paimon Logo',
          src: 'img/paimon.svg',
        },
        items: [

          {to: '/', label: 'Document', position: 'left'},
          {to: '/', label: 'Github', position: 'left'},
          {to: '/', label: 'Who\'s Using', position: 'left'},
          {to: '/', label: 'Releases', position: 'left'},
          {
            type: 'dropdown',
            label: 'Community',
            position: 'left',
            items: [
              {
                label: 'How to Contribute',
                href: '/',
              },
              {
                label: 'Team',
                href: '/',
              },
            ],
          },
          {to: '/', label: 'Security', position: 'left'},
          {
            type: 'dropdown',
            label: 'ASF',
            position: 'left',
            items: [
              {
                label: 'Foundation',
                href: 'https://www.apache.org/',
              },
              {
                label: 'License',
                href: 'https://www.apache.org/licenses/',
              },
              {
                label: 'Events',
                href: 'https://www.apache.org/events/current-event',
              },
              {
                label: 'Security',
                href: 'https://www.apache.org/security/',
              },
              {
                label: 'Sponsorship',
                href: 'https://www.apache.org/foundation/sponsorship.html',
              },
              {
                label: 'Thanks',
                href: 'https://www.apache.org/foundation/thanks.html',
              },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            html: `
            <div style="display: flex; align-items: flex-start;">
              <a href="https://www.example.com" target="_blank" rel="noreferrer noopener">
                <img src="img/apache-incubator.svg" alt="apache-incubator" style="margin-right: 10px;">
              </a>
              <div style="max-width: 900px;">
                <p style="text-align: left;">Apache Paimon is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF。</p>
              </div>
            </div>
 `,
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Apache Software Foundation. Apache Paimon, Paimon, and its feather logo are trademarks of The Apache Software Foundation.`,
      },
    }),
};

export default config;

