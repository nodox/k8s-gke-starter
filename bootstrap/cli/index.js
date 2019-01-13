#!/usr/bin/env node
const yargs = require('yargs')
const { deployHandler } = require('./core')

yargs
  .command({
    command: 'deploy <OLD_IMAGE> <NEW_IMAGE>',
    aliases: [],
    desc: 'Start a zero-downtime deploy to Kubernetes cluster replacing <old_image> with <new_image>',
    handler: deployHandler,
  })
  .demandCommand()
  .help()
  .wrap(72)
  .argv
