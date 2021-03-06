const process = require('process');
const pidusage = require('pidusage');

const Controller = require('@conga/framework').Controller;

/**
 * @Route("/_conga/api/dashboard")
 */
module.exports = class DashboardController extends Controller {

    /**
     * @Route("/stats", methods=['GET'])
     */
    stats(req, res) {

        pidusage(process.pid, (err, stat) => {
            res.return({
                cpu: stat.cpu,
                memory: stat.memory
            });
        });
    }

}
