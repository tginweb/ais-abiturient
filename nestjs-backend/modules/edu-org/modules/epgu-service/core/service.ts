import {Injectable} from '@nestjs/common';
import * as xmlParseProcessors from 'xml2js/lib/processors'
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

const fetch = require('node-fetch');
const xmlParse = require('xml2js').parseString;
const xmlParsePromise = require('xml2js').parseStringPromise;
const axios = require('axios').default;
const qs = require('querystring')

@Injectable()
export class EduEpguService {

    public connectionsSchema = {}
    public connectionType = 'prod'
    public orgRequisites = {
        Ogrn: '1023801756120',
        Kpp: '381201001'
    }

    constructor() {
        this.connectionsSchema = {
            test: {
                server: '85.142.162.22',
                port: 8100,
                tokenInfoPrefix: 'token/no-certificate/'
            },
            prod: {
                server: '10.3.60.3',
                port: 8100,
                tokenInfoPrefix: 'token/',
                proxy: true
            }
        }
    }

    getCampaingUid(): any {
        return this.connectionType === 'prod' ? 'bd08cb0c-1436-4e47-be4a-b0cd29fc4e2d' : 'd594ad52-1aa3-4443-b973-6a9c355dd128'
    }

    getDirUidSpec(): any {
        return this.connectionType === 'prod' ? '36a91ebe-d4dd-4f04-8b5d-1a943ad174a6' : '36a91ebe-d4dd-4f04-8b5d-1a943ad174a6'
    }

    getDirUidBak(): any {
        return this.connectionType === 'prod' ? 'a6dd16c6-2176-451a-af43-e418aaba421d' : '66303a57-7b8d-44ee-b0e5-cf4b2e33b4e6'
    }

    async getDirUid(admission: EduAdmissionModel) {
        switch (admission.clevel) {
            case 1: return this.getDirUidSpec();
            case 2: return this.getDirUidBak();
        }
    }

    getConnectionSchema(): any {
        return this.connectionsSchema[this.connectionType]
    }

    makeRequestUrl(method): string {
        const options = this.getConnectionSchema()
        return 'http://' + options.server + ':' + options.port + '/api/' + method
    }

    async getTokenInfoQueue(queueName): Promise<any> {
        const options = this.getConnectionSchema()
        return await this.makeRequest(options.tokenInfoPrefix + queueName + '/info', {}, 'json', true)
    }

    async getTokenInfo(queueName, idJwt, token = null): Promise<any> {
        const options = this.getConnectionSchema()

        if (!token) {
            const token = {
               // "Action": "GetMessage",
               // "IdJwt": parseInt(idJwt),
               // ...this.orgRequisites,
            }
            //token = await this.tokenGenerate(tokenData, null)
        }

        return await this.makeRequest('token/own/get', {IdJwt: idJwt}, 'json', false)
    }

    async tokenNew(token, meta = {}): Promise<any> {
        return await this.makeRequest('token/new', {Token: token}, 'json', false, meta)
    }

    async tokenDespatchGet(idJwt = 0, meta = {}): Promise<any> {
        return await this.makeRequest('token/despatch/get', {IdJwt: idJwt}, 'json', false, meta)
    }

    async fileGet(fui): Promise<any> {
        const res: any = await this.makeRequest('file/get', {Fui: fui}, 'json', false)

        if (res && res.Base64) {
            const fileContent = Buffer.from(res.Base64, 'base64')
            const fileExt = res.Extension
            console.log([fileContent.length, res.Extension], 'Downloaded file [length,ext]')
            return {
                content: fileContent,
                ext: fileExt
            }
        }
    }

    async getMessage(queue, idJwt): Promise<any> {

    }

    async makeRequest(method, body, responseFormat = 'json', attachRequisites = false, meta = {}): Promise<any> {

        const options = this.getConnectionSchema()

        console.log('Make epgu request ' + this.makeRequestUrl(method), meta)

        if (attachRequisites) {
            body = {
                ...body,
                ...this.orgRequisites
            }
        }

        let response

        if (!options.proxy) {

            let bodyString = JSON.stringify(body)

            if (bodyString.match(/SIGNED/)) {
                //bodyString = bodyString.replace(/SIGNED/, 'zzz')
            }


            response = await fetch(this.makeRequestUrl(method), {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'session_key': 'skey+22f0390417f30d1a00e7586622f8ff55d01bdbab+2023-06-20_01-23'
                }
            })

        } else {
            response = await this.makeProxyRequest('epgu-send', {
                url: this.makeRequestUrl(method),
                body: body,
                async: meta['async']
            });
            return response
        }

        if (!response)
            return false

        const data = await response.text();

        console.log(data, 'EPGU response')

        switch (responseFormat) {
            case 'json':

                break;
            case 'xml':
                break;
        }

        let res

        if (data) {

            try {
                res = JSON.parse(data)

                if (res && res.error) {

                }
            } catch (e) {
                res = await xmlParsePromise(data, {
                    explicitArray: false,
                    valueProcessors: [
                        function (str) {
                            if (!isNaN(str)) {
                                if (str.toString().charAt(0) === '0') return str
                                str = str % 1 === 0 ? parseInt(str, 10) : str;
                            }
                            return str;
                        },
                        xmlParseProcessors.parseBooleans
                    ],
                    parseBooleans: true,
                    parseNumbers: true
                })
            }

        }

        return res
    }

    async makeProxyRequest(type, data, async = false) {

        const job = {
            type: type,
            data: data
        }

        const res = await this.sendToPhp('POST', 'https://www.vsp.ru/abit/server/server.php', {
            op: 'job-add-sync',
            job: JSON.stringify(job),
            async: async ? 1 : null
        })

        //console.log(res, 'Proxy res')

        return res && res.success ? res.result : null
    }

    async tokenGenerate(tokenHeader, tokenPayload = null, attachReq = true) {

        const tokenHeaderExt = {
            ...tokenHeader,
            ...(attachReq ? this.orgRequisites : {})
        }

        const tokenHeaderStr = await Buffer.from(JSON.stringify(tokenHeaderExt)).toString('base64')

        let tokenPayloadStr = ''

        //console.log(tokenHeaderExt)

        if (tokenPayload) {
            //const iconv = require('iconv-lite');
            //tokenPayload = iconv.encode(iconv.decode(new Buffer(tokenPayload, 'binary'), 'utf8'), 'win1251')
            tokenPayloadStr = tokenPayload ? await Buffer.from(tokenPayload).toString('base64') : ''
        }

        const tokenSignature = await this.tokenSign(tokenHeaderStr + '.' + tokenPayloadStr)

        const tokenParts = [
            tokenHeaderStr,
            tokenPayloadStr,
            tokenSignature
        ]

        return tokenParts.join('.')
    }

    async tokenSignRemote(content) {
        return await this.makeProxyRequest('sign', content)
    }

    async tokenSign(content) {
        return this.connectionType === 'test' ? await this.makeProxyRequest('sign', content) : 'SIGNED'
    }

    async responsePayloadToJson(content) {
        return await xmlParsePromise(content, {
            explicitArray: false,
            //explicitChildren: true,
            valueProcessors: [
                function (str) {
                    if (!isNaN(str)) {
                        if (str.toString().charAt(0) === '0') return str
                        str = str % 1 === 0 ? parseInt(str, 10) : str;
                    }
                    return str;
                },
                xmlParseProcessors.parseBooleans
            ],
            parseBooleans: true,
            parseNumbers: true
        })
    }

    async responseTokenDecode(content) {

        const [headerEnc, payloadEnc] = content.split('.')
        const headerJson = Buffer.from(headerEnc, 'base64').toString()
        const headerObj = await JSON.parse(headerJson)
        let payloadXml = Buffer.from(payloadEnc, 'base64').toString()

        const file: any = {}

        payloadXml = payloadXml.replace(/<(Base64|Base64File)>(.+?)<\/(Base64|Base64File)>/g, function (match, p1, content, p2, offset, input_string) {
            file.content = content
            return "<FileData>FILEDATA</FileData>";
        })

        payloadXml.replace(/<FileType>(.+?)<\/FileType>/g, function (match, content, offset, input_string) {
            file.type = content
            return "<FileType>" + content + "</FileType>";
        })

        return {
            header: headerObj,
            payloadXml: payloadXml,
            file: file
        }
    }

    async sendToPhp(method, url, params) {

        let $headers = {};
        $headers['Content-Type'] = 'application/x-www-form-urlencoded';

        try {
            let {data} = await axios.post(
                url,
                qs.stringify(params),
                {
                    headers: $headers
                }
            )

            return data

        } catch (e) {

            console.log(e)
        }

        return false
    }
}
