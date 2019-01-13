var express = require('express');
var router = express.Router();

// Health Check Probes
// https://console.bluemix.net/docs/node/healthcheck.html#healthcheck
// https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#define-a-liveness-command

// A liveness probe is used to indicate whether the process is to be restarted.
router.get('/', function(req, res, next) {
  res.json({ status: 'down' });
});


module.exports = router;
