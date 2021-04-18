const express = require('express');
const {Client, Message} = require('discord.js');
const {DefaultRouter} = require('./common/DefaultRouter');
const Logger = require('../log');
const util = require('./common/util');
const { inspect } = require('util');
const json = JSON;
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
    class RadaAPI extends DefaultRouter {
        constructor(rada) {
            super(rada);
        }
         setup() {
                let rada = this.client;
                let api = this.api
                api.get('/mutual', (req, res) => {
                let user = req.query.id;
                if (user == null) {
                    res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a ?id=userid in your GET request")))
                } else if (user === "") {
                    res.status(400).send(json.stringify(new RadaResponse(-1, "error", "You must have a user id in your request. Not BLANK")))
                }

                    util.getMutuals(user, rada).then(m => {
                        if (m == null) {
                            res.status(400).send(json.stringify(new RadaResponse(-1, "error", `You must have a valid user id (${user} is not a valid user id)`)))
                        } else
                        res.status(200).send(json.stringify(m))
                    });
                });
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
             return this.api
        }
         shutdown() {
        super.shutdown();
        }

        }
        module.exports.RadaAPI = RadaAPI

