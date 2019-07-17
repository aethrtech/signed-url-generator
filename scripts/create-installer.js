const exec = require('child_process').exec,
fs = require('fs'),
join = require('path').join,
format = require('util').format,
os = require('os')

const NUGET_EXE = path.resolve(__dirname, '..', 'vendor', 'nuget.exe');
const SYNC_RELEASES_EXE = path.resolve(__dirname, '..', 'vendor', 'SyncReleases.exe');
const UPDATE_EXE = path.resolve(__dirname, '..', 'vendor', 'Update.exe');
const UPDATE_COM = path.resolve(__dirname, '..', 'vendor', 'Update.com');
const NUSPEC_TEMPLATE = path.resolve(__dirname, '..', 'template.nuspec');

module.exports = function createInstaller(){



}