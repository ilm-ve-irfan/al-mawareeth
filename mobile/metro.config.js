// Expo Metro config for the npm-workspaces monorepo layout.
// Without this, expo-doctor flags the project for not extending
// "expo/metro-config", and Metro misses dependencies hoisted to the
// repo-root node_modules.
//
// Learn more: https://docs.expo.dev/guides/monorepos/

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the whole workspace so changes in sibling packages are picked up.
// Preserve Expo's defaults instead of replacing them.
config.watchFolders = [...(config.watchFolders ?? []), workspaceRoot];

// Resolve packages from the local node_modules first, then the hoisted
// root node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
