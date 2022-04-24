const AutoGitUpdate = require('auto-git-update');

const config = {
    repository: 'https://github.com/brandoge91/banPanel',
    fromReleases: false,
    ignoreFiles: ['src/config.ts'],
}

const updater = new AutoGitUpdate(config);



updater.autoUpdate();