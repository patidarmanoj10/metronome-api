'use strict'

const async = require('async')
const Metronome = require('../metronome')
class ACCExporter extends Metronome {
  constructor(chain) {
    super(chain)
    this.db.model('Value').findOne({ key: 'bestBlock' })
      .then((value) => {
        console.log('value###', value)
      })
      .catch((error) => {
        console.log('errorrrrr', error)
      })
  }

  _init (bestBlock = this.config.exportStartBlock) {
    console.log('bestBlock$$$', bestBlock)
    bestBlock = this.config.exportStartBlock
    this.allEvents = this.metToken.getPastEvents('allEvents', { fromBlock: bestBlock, toBlock: 'latest' })
    this.newEvents = this.metToken.events.allEvents({ fromBlock: 'latest' })
  
    this.allEvents
      .then(events => {
        this.logger.info(`${events.length} historical events were received from ACC ${bestBlock}`)
  
        const accounts = {}
        console.log('events', events)
        events.forEach(e => {
          if (!this._isEventValid(e)) { return }
        })
  
        async.eachSeries(
          events,
          (event, cb) => this._processEvent(event, cb),
          err => this._onProcessEvents(err, events, accounts)
        )
      })
      .catch(err => this.logger.error(`Error receiving historical events: ${err}`))
  
    this.newEvents
      .on('data', event => {
        this.logger.info(`New event received with address: ${event.address}`)
  
        this._processEvent(event, err => {
          if (err) { return this.logger.error(err) }
  
          this.logger.info(`New event processed with address: ${event.address}`)
          this._saveBestBlock(event)
        })
      })
      .on('error', err => this.logger.error(`Error receiving new event: ${JSON.stringify(err)}`))
  
    this.logger.info(`ACC Exporter initialized, waiting for historical events from block ${bestBlock} ⏰`)
  }
}



module.exports = ACCExporter
