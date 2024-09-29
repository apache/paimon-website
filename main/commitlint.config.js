const fs = require('fs');
const commitEditMsg = '.git/COMMIT_EDITMSG';

const types = [
  'feat',
  'fix',
  'build',
  'ci',
  'docs',
  'perf',
  'refactor',
  'style',
  'test',
  'hotfix',
  'release',
  'chore',
  'revert'
];
const typeDesc = {
  feat: '    new features, new functions',
  fix: '     fix normal no-emergency bug',
  build: '   changes that affect the build system, version release or external dependencies',
  ci: '      changes to CI configuration or scripts',
  docs: '    changes to the document',
  perf: '    optimize related, such as improving performance and experience',
  refactor: 'code refactoring',
  style: '   changes to the code format',
  test: '    add new function tests or changes to the origin test module',
  hotfix: '  urgent need to fix the online bug',
  release: ' version release',
  chore: '   changes in the build process or the auxiliary tools',
  revert: '  revert to the previous version'
};

const exampleList = [
  'feat: add new features',
  'feat(features): add new features'
];

function parseMessage(message) {
  const PATTERN = /(\w*)(?:\((.*)\))?: (.*)$/;
  const header = message.split('\n')[0];
  const match = PATTERN.exec(header);
  if (match) {
    return {
      type: match[1] || null,
      scope: match[2] || null,
      subject: match[3] || null
    };
  }
  return null;
}

function getTypeEnumRule() {
  const messages = fs.readFileSync(commitEditMsg, { encoding: 'utf-8' });
  const myMessage = parseMessage(messages);
  if (myMessage) {
    const { type } = myMessage;
    if (type === 'hotfix' || type === 'release' || type === 'chore' || type === 'revert') {
      return [2, 'always', types];
    }
  }
  console.log('Please strictly follow the following rules, such as:');
  console.log(types.map(e => `${e}(optional): message ${typeDesc[e]}`));
  console.log('Examples:');
  exampleList.forEach(e => console.log(e));
  return [2, 'always', types.map(e => `${e}`)];
}

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 300],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'type-enum': getTypeEnumRule
  }
};
