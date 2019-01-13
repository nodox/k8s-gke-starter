const fs = require('fs-extra')
const { spawnSync } = require('child_process')

const deployHandler = (argv) => {
  const OLD_IMAGE = argv.OLD_IMAGE
  const OLD_VERSION = OLD_IMAGE.split(":")[1]

  const NEW_IMAGE = argv.NEW_IMAGE
  const NEW_VERSION = NEW_IMAGE.split(":")[1]
  
  let deployment = fs.readJsonSync('./infra/deployment.json')
  deployment.metadata.name = `express-app-${NEW_VERSION}`
  deployment.spec.selector.matchLabels.version = NEW_VERSION
  deployment.spec.template.metadata.labels.version = NEW_VERSION
  deployment.spec.template.spec.containers[0].image = NEW_IMAGE
  
  let service = fs.readJsonSync('./infra/service.json')
  service.spec.selector.version = NEW_VERSION

  fs.writeJsonSync('./infra/service.json', service, { spaces: 4 })
  fs.writeJsonSync('./infra/deployment.json', deployment, { spaces: 4 })

  let msg

  msg = spawnSync(`kubectl apply -f ./infra/deployment.json`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  // wait until rollout successful  
  msg = spawnSync(`kubectl rollout status deployment/express-app-${NEW_VERSION}`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  // swap to new service
  msg = spawnSync(`kubectl apply -f ./infra/service.json`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })


  // delete the older version
  msg = spawnSync(`kubectl delete deployment/express-app-${OLD_VERSION}`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  if(msg.status === 0) {
    console.log(`\n
      The new version is live, with image: ${NEW_IMAGE}.
    `)
  } else {
    console.log(`
      There was an error with deployment of ${NEW_IMAGE}. \n
      Please make sure you provided a valid path to the repository of your image and try again.
    `)
  }
}


module.exports = {
  deployHandler,
}
