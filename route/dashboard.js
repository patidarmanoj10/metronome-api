'use strict'

const Router = require('express').Router
const router = new Router()

function queryEvents(req, res, next) {
    const logQuery = JSON.stringify(req.query).substring(req.config.queryLimit)
    req.logger.info(`Querying events: ${logQuery}`)

    req.model('Event').countAndFind(req.query)
        .skip(req.skip)
        .limit(req.limit)
        .sort(req.sort)
        .lean()
        .exec((err, events, count) => {
            if (err) { return next(err) }
            req.logger.verbose('Sending events to client')
            res.send({ events, count })
        })
}

router.get('/', queryEvents)

module.exports = router
