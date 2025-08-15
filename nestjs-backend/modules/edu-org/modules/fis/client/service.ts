import {Injectable} from '@nestjs/common';
import {promisify} from 'util'
import * as fs from 'fs'

const fetch = require('node-fetch');
const xmlParse = require('xml2js').parseString;
const xmlParsePromise = require('xml2js').parseStringPromise;
const axios = require('axios').default;
const qs = require('querystring')

const readFile = promisify(fs.readFile)
const path = require('path')
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class EduFisClientService {
    constructor(
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async registerJobs() {

        const job = new CronJob(`1 * * * * *`, () => {

        })

        this.schedulerRegistry.addInterval('fis', async () => {

        })

        job.start()
    }

    async doJobs() {


        return []
    }

    async start() {


        return []
    }
}
