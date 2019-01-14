const fs = require('fs-extra')
const { spawnSync } = require('child_process')

const updateServiceResource = (filepath, version) => {
  let service = fs.readJsonSync(filepath)

  service.spec.selector.version = version

  fs.writeJsonSync(filepath, service, { spaces: 4 })
}

const createDeploymentResource = (filepath, image, version) => {
  let deployment = fs.readJsonSync(filepath)

  deployment.metadata.name = `express-app-${version}`
  deployment.spec.selector.matchLabels.version = version
  deployment.spec.template.metadata.labels.version = version
  deployment.spec.template.spec.containers[0].image = image

  fs.writeJsonSync(filepath, deployment, { spaces: 4 })
}

const deployHandler = (argv) => {
  const OLD_IMAGE = argv.OLD_IMAGE
  const OLD_VERSION = OLD_IMAGE.split(":")[1]

  const NEW_IMAGE = argv.NEW_IMAGE
  const NEW_VERSION = NEW_IMAGE.split(":")[1]

  updateServiceResource('./infra/service.json', NEW_VERSION)
  createDeploymentResource('./infra/deployment.json', NEW_IMAGE, NEW_VERSION)

  let msg

  // create the new Deployment resource
  // TODO: move into separate function for testability
  msg = spawnSync(`kubectl apply -f ./infra/deployment.json`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  // wait until rollout is successful  
  // TODO: move into separate function for testability
  msg = spawnSync(`kubectl rollout status deployment/express-app-${NEW_VERSION}`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  // swap the Service label to point to the new Deployment
  // TODO: move into separate function for testability
  msg = spawnSync(`kubectl apply -f ./infra/service.json`, {
    cwd: process.cwd(),
    shell: true,
    stdio: `inherit`,
    env: process.env,
  })

  // delete the old Deployment resource
  // TODO: move into separate function for testability
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
  updateServiceResource,
  createDeploymentResource,
}