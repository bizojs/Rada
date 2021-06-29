exports.RadaAPIPrefixEvent = class RadaAPIPrefixEvent {
    oldPrefix;
    newPrefix;
    member;
    guild;
    constructor(oldPrefix, newPrefix, member, guild) {
        this.oldPrefix = oldPrefix;
        this.newPrefix = newPrefix;
        this.member = member;
        this.guild = guild;
    }
}


