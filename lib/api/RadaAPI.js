const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, Message } = require('discord.js');
const { DefaultRouter } = require('./common/DefaultRouter');
const Logger = require('../log');
const util = require('./common/util');
const { inspect } = require('util');
const json = JSON;
const os = require('os');
const ws = require('ws'); // Websocket support, (Later on V2)
class RadaResponse {
    op;
    type;
    message;
    constructor(op, type, message) {
        this.op = op;
        this.type = type;
        this.message = message;
    }
}
class RadaAPIMember {
    member;
    roles;
    presence;
    permissions;
    settings;
    constructor(member, roles, presence, permissions, settings) {
        this.member = member;
        this.roles = roles;
        this.presence = presence;
        this.permissions = permissions;
        this.settings =  settings;
    }
}
class RadaAPIStats {
    os;
    cpu;
    cpuAvg;
    mem;
    users;
    usersCached;
    guilds;
    constructor(os, cpu, cpuAvg, mem, users, usersCached, guilds) {
        this.os = os;
        this.cpu = cpu;
        this.cpuAvg = cpuAvg;
        this.mem = mem;
        this.users = users;
        this.usersCached = usersCached;
        this.guilds = guilds;
    }
}
class RadaAPI extends DefaultRouter {
    constructor(rada) {
        super(rada);
    }
    setup() {
        let rada = this.client;
        let api = this.api
        api.use(bodyParser.urlencoded({ extended: true }));
        api.use(bodyParser.json());
        api.use(bodyParser.raw());
        api.use(express.json());
        api.use(cors());

        api.get('/test', (req, res) => {
            res.status(200).send("true");
        })

        api.post('/mutual', (req, res) => {
            let mutuals = util.getMutuals(req.body, rada)
            res.status(200).send(json.stringify(mutuals))
        });

        api.get('/prefix', async (req, res) => {
            let guild = req.query.id;
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let settings = await util.getPrefix(rada, guild)
            res.status(200).send(json.stringify(settings))
        })

        api.post('/setprefix', async (req, res) => {
            let guild = req.query.id;
            let newPrefix = req.query.newPrefix;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!newPrefix) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &newPrefix=prefix in your POST request")))
            }
            let updated = util.setPrefix(rada, guild, newPrefix)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.post('/setautorole', async (req, res) => {
            let guild = req.query.id;
            let roleID = req.query.rid;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!roleID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &rid=roleid in your POST request")))
            }
            let updated = util.setAutorole(rada, guild, roleID)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/antilink', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let antilink = util.getAntilink(rada, guildID)
            res.status(200).send(json.stringify(antilink))
        })
        api.post('/toggleantilink', async (req, res) => {
            let guild = req.query.id;
            let updated = req.query.updated;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!updated) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &updated=option in your POST request")))
            }
            let toggled = util.setAntilink(rada, guild, updated)
            toggled ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/logs', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let logs = util.getLogs(rada, guildID)
            res.status(200).send(json.stringify(logs))
        })

        api.post('/setlogs', async (req, res) => {
            let guild = req.query.id;
            let cid = req.query.cid;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!cid) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &cid=channelid in your POST request")))
            }
            let updated = util.setLogs(rada, guild, cid)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/votechannel', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let votechannel = util.getVoteChannel(rada, guildID)
            res.status(200).send(json.stringify(votechannel))
        })
        api.post('/setvotechannel', async (req, res) => {
            let guild = req.query.id;
            let cid = req.query.cid;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!cid) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &cid=channelid in your POST request")))
            }
            let updated = util.setVoteChannel(rada, guild, cid)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/welcomechannel', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let welcomechannel = util.getWelcomeChannel(rada, guildID)
            res.status(200).send(json.stringify(welcomechannel))
        })
        api.post('/setwelcomechannel', async (req, res) => {
            let guild = req.query.id;
            let cid = req.query.cid;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!cid) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &cid=channelid in your POST request")))
            }
            let updated = util.setWelcomeChannel(rada, guild, cid)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/welcomemessage', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let welcomemessage = util.getWelcomeMessage(rada, guildID)
            res.status(200).send(json.stringify(welcomemessage))
        })
        api.post('/setwelcomemessage', async (req, res) => {
            let guild = req.query.id;
            let msg = req.body.msg;
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!msg) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a msg body in your POST request")))
            }
            let updated = await util.setWelcomeMessage(rada, guild, msg)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/leavemessage', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let leavemessage = util.getLeaveMessage(rada, guildID)
            res.status(200).send(json.stringify(leavemessage))
        })
        api.post('/setleavemessage', async (req, res) => {
            let guild = req.query.id;
            let msg = req.body.msg
            let authHeader = req.headers.authorization
            if (!authHeader || authHeader === 'undefined') {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            let validUser = await util.verifyUser(authHeader.split(' ')[1])
            if (!validUser) {
                res.status(401).send(json.stringify(new RadaResponse(-1, "error", "401: Unauthorized")))
            }
            if (!guild) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your POST request")))
            }
            if (!msg) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a &msg=message in your POST request")))
            }
            let updated = await util.setLeaveMessage(rada, guild, msg)
            updated ? res.status(200).send("true") : res.status(400).send("false")
        })

        api.get('/autorole', (req, res) => {
            let guildID = req.query.id;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=guildid in your GET request")))
            }
            let autorole = util.getAutorole(rada, guildID)
            res.status(200).send(json.stringify(autorole))
        })

        api.get('/channels', (req, res) => {
            let guildID = req.query.gid;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "Your request query is invalid. Format: ?gid=guildID")))
            }
            let channels = util.getChannels(rada, guildID)
            res.status(200).send(json.stringify(channels))
        })

        api.get('/roles', (req, res) => {
            let guildID = req.query.gid;
            if (!guildID) {
                res.status(400).send(json.stringify(new RadaResponse(-1, "error", "Your request query is invalid. Format: ?gid=guildID")))
            }
            let roles = util.getRoles(rada, guildID)
            res.status(200).send(json.stringify(roles))
        })

        api.get('/guild', (req, res) => {
            let guildID = req.query.id;
            if (guildID == null) {
                res.status(400).send(json.stringify(new RadaResponse(-2, "error", "You must have a ?id=guildid in your GET request")))
            } else if (guildID === "") {
                res.status(400).send(json.stringify(new RadaResponse(-2, "error", "You must have a guild id in the request. Not BLANK")))
            }
            let bool = rada.guilds.cache.find(g => g.id === guildID)
            if (!bool) {
                res.status(200).send("false")
            } else if (bool) {
                res.status(200).send("true")
            }
        });

        /**
        * ***Endpoint*** That provides a Boolean return of (`true`/`false`)
        *
        * **URI** /permission?uid=exampleUserID&gid=exampleGuildID
        * @param gid The guild id needed
        * @param uid The user id needed
        * @returns Boolean
        */
        api.get('/permission', (req, res) => {
            let guildID = req.query.gid;
            let userID = req.query.uid;
            if (guildID == null && userID == null || guildID === "" && userID === "" || guildID == null || userID == null) {
                res.status(400).send(json.stringify(new RadaResponse(-3, "error", "You must have BOTH a valid guildid (?gid=GUILDID) AND a valid userid (&uid=USERID)")))
            }
            util.getUser(userID, rada).then(u => {
                if(u == null) {
                    res.status(400).send(json.stringify(new RadaResponse(-3, "error", `You must have a valid user id (${userID} is not a valid user id)`)))
                } else {
                    let guild = rada.guilds.cache.find(g => g.id === guildID)
                    if (guild === undefined) {
                        res.status(400).send(json.stringify(new RadaResponse(-3, "error", `That is not a valid guild id`)))
                    }
                    guild.members.fetch(u).then(m => {
                        if (m.hasPermission("ADMINISTRATOR") || m.hasPermission("MANAGE_GUILD")) {
                            res.status(200).send("true")
                        } else
                            res.status(200).send("false")
                    })
                }
            })
        });

        api.get('/member', async (req, res) => {
            let guildID = req.query.gid;
            let userID = req.query.uid;
            if (guildID == null && userID == null || guildID === "" && userID === "" || guildID == null || userID == null) {
                res.status(400).send(json.stringify(new RadaResponse(-3, "error", "You must have BOTH a valid guildid (?gid=GUILDID) AND a valid userid (&uid=USERID)")))
            }
            await util.getUser(userID, rada).then(async u => {
                if(u == null) {
                    res.status(400).send(json.stringify(new RadaResponse(-3, "error", `You must have a valid user id (${userID} is not a valid user id)`)))
                } else {
                    let guild = rada.guilds.cache.find(g => g.id === guildID)
                    if (guild === undefined) {
                        res.status(400).send(json.stringify(new RadaResponse(-3, "error", `That is not a valid guild id`)))
                    }
                    /*
                    * Needs to have 2 fetch methods to both grab the pre member and post member from cache so it can grab MongoDB on first request
                    */
                    guild.members.fetch(u)
                    guild.members.fetch(u).then(m => {
                        let settings;
                        settings = util.getSettingsForMember(m.id, guild)
                        let member = new RadaAPIMember(m, m.roles.cache, m.presence, m.permissions.toArray(), settings)
                        res.status(200).send(json.stringify(member))
                    })
                }
            })
        });

        api.delete('/warn/delete/:warn', (req, res) => {
            let id = req.params.warn;
            let gid = req.query.gid;
            let items = rada.guilds.cache.get(gid).members.cache.first().settings.items;
            console.log(inspect(items, {depth: 5}))
        });

        api.get('/warnings', async (req, res) => {
            let gid = req.query.id;
            let warnings = [];
            rada.guilds.cache.get(gid).members.fetch()
            rada.guilds.cache.get(gid).members.fetch().then(members => {
                members.forEach(m => warnings.push({user: m.user.tag, warnings: m.settings.get(m.id, 'warnings', [])
                    .filter(w => w.guild_id === gid)}))
                res.status(200).send(warnings)
            })
        })

        api.get('/stats', async (req, res) => {
            let total = rada.guilds.cache.reduce((a, c) => a + c.memberCount, 0);
            let cached = this.client.guilds.cache.reduce((a, c) => a + c.members.cache.size, 0);
            let percent = (cached / total * 100).toFixed(0) + '%';
            let operatingSystem = `${process.platform === 'linux' ? 'Ubuntu 18.04' : 'Windows 10'} ${process.arch}`;
            let cpuModel = os.cpus()[0].model;
            let cpuAvg = os.loadavg()[0].toFixed(1)
            let mem =`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) > 1024 ? `${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`}`
            let users = total.toLocaleString();
            let usersCached = cached.toLocaleString()
            let guilds = rada.guilds.cache;
            let stats = new RadaAPIStats(operatingSystem, cpuModel, cpuAvg, mem, users, usersCached, guilds.size);
            res.status(200).send(stats)
        });

        return this.api
    }
    shutdown() {
        super.shutdown();
    }
}
module.exports.RadaAPI = RadaAPI    