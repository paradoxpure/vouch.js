const {
  Message,
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const userModel = require("../../modals/vouches");
const blackModel = require("../../modals/blacklisted")
const vouchesModel = require("../../modals/vouch");
const tokenModel = require("../../modals/users");
const scamModel = require("../../modals/scammer")
const ee = require("../../settings/embed.json");
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');
const ms = require('ms');


module.exports = {
  name: "vouch",
  aliases: ["rep"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const timeSpan = ms('0 days')

    const createdAt = new Date(message.author.createdAt).getTime();

    let diffrence = Date.now() - createdAt;

    if(diffrence < timeSpan) {
      await message.react("<:icons_Wrong:1100457846950346854>");
      let embed = client.functions.failEmbed(
        "Failed!",
        "Minimum Account Age to vouch is 90days!"
      );
      return message.channel.send({ embeds: [embed] });
      
    }
  
    

    const vouchCooldown = new CommandCooldown('vouch', ms('10s'))
    const userCooldowned = await vouchCooldown.getUser(message.author.id);

    if(userCooldowned) { 
      const timeLeft = msToMinutes(userCooldowned.msLeft, false); // False for excluding '0' characters for each number < 10
      message.react("<:icons_Wrong:1100457846950346854>")
      message.reply(`You need to wait ${ timeLeft.seconds + ' seconds'} before running command again!`);
    } else {

      await vouchCooldown.addUser(message.author.id);



    if (!args[0]) {
      await message.react("<:icons_Wrong:1100457846950346854>");
      let embed = client.functions.failEmbed(
        "Failed!",
        "Use the correct command!\n`+rep <user> comment`"
      );
      return message.channel.send({ embeds: [embed] });
    }

    let user = args.slice(0).join(" ")

    const regex = /(?<id>[0-9]{18})/i;

    let con = user.match(regex)

    let userid = con.groups.id;
           
    const member = client.users.cache.get(userid)
    if(!member) {
      let membed = client.functions.failEmbed("Failed", `<:icons_Wrong:1100457846950346854>Unable to find the user.`)
      return message.channel.send({embeds: [membed]})
    }

    let deek = await scamModel.findOne({userID: userid});
    if(deek) {
      await message.react("<:icons_Wrong:1100457846950346854>")
      await message.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setThumbnail(member.displayAvatarURL({ dynamic: false, size: 64, format: 'png' }))
        .setTitle(`${member.tag}'s info`)
        .setDescription(`You can't vouch this user for one of these reasons ->
- The user is marked as scammer.
- The user is blacklisted from the bot.`)
        .setFooter({text: ''})
        .setTimestamp()
      ]})
      return;
    }
      let dick = await blackModel.findOne({userID: userid});
    if(dick) {
      await message.react("<:icons_Wrong:1100457846950346854>")
      await message.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setThumbnail(member.displayAvatarURL({ dynamic: false, size: 64, format: 'png' }))
        .setTitle(`${member.tag}'s info`)
        .setDescription(`You can't vouch this user for one of these reasons ->
- The user is marked as scammer.
- The user is blacklisted from the bot.`)
        .setFooter({text: ''})
        .setTimestamp()
      ]})
      return;
    }

    if(member.id === message.author.id) {
      await message.react("<:icons_Wrong:1100457846950346854>")
      await message.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
       
        
        .setDescription("You cannot vouch yourself!")
       .setTimestamp()
      ]})
      return;
    }

    let data = await userModel.findOne({ userID: userid });
    if (!data) {
      await new userModel({
        userID: userid,
        pen_vouches: 0,
        app_vouches: 0,
        dec_vouches: 0,
        unreps: 0,
        veri_vouches: 0,
        overall_vouches: 0,
      }).save();
    }
    let hi = await userModel.findOne({ userID: userid });
    let randNum = client.functions.randNum();

    if (!args[1]) {
      await message.react("<:icons_Wrong:1100457846950346854>");
      let embed = client.functions.failEmbed(
        "Failed!",
        "Use the correct command!\n`+rep <user> comment`"
      );
      return message.channel.send({ embeds: [embed] });
    }


    


    let dick1 = await blackModel.findOne({userID: userid});
    if(dick1) {
      await message.react("<:icons_Wrong:1100457846950346854>")
      await message.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setThumbnail(member.displayAvatarURL({ dynamic: false, size: 64, format: 'png' }))
        .setTitle(`${member.tag}'s info`)
        .setDescription(`You can't vouch this user for one of these reasons ->
- The user is marked as scammer.
- The user is blacklisted from the bot.`)
        .setFooter({text: ''})
        .setTimestamp()
      ]})
      return;
    }
      

    await message.react("<:icons_colorserververified:1100457056638607561>");
    let embedOne = new MessageEmbed()
      .setTitle("Vouch System")
     .setDescription(
        `Successfully vouched`
      )
      .setColor("2F3136")
      .setFooter({ text: "Made by Him"});

      

     //let embedOne = client.functions.successEmbed("Success!", `You gave \`${user.tag}\` a positive vouch.`)


    let newVouchCount = hi.pen_vouches + 1;
    let over = hi.overall_vouches + 1;

    
    //console.log(newVouchCount, over)

    // let true = { overall_vouches: over }
    await userModel.findOneAndUpdate(
      { userID: userid },
      { pen_vouches: newVouchCount }
    );
    await userModel.findOneAndUpdate(
      { userID: userid },
      { overall_vouches: over }
    );

    let embedTwo = new MessageEmbed()
      .setTitle("Vouch Notification System")
     .setDescription(
        `You have recieved a \`Positive\` vouch from \`${message.author.tag}\`. The ID of this vouch is \`${randNum}\``
      )
      .setColor("2F3136")
      .setFooter({ text: "Made by Him"});

    // let embedTwo = client.functions.successEmbed("Success!", `You got a \`positive\` vouch from \`${message.author.tag}\` the vouch number is \`${randNum}\` and is waiting to be reviewed by our staff! `)
        try {
   await member.send({ embeds: [embedTwo] });
}
catch(err) {
     console.log("cant send to this user missing permission")
  
}
       
    let embedThree = new MessageEmbed()
      .setAuthor({
        name: "Vouch Information"
      })
      .setDescription(
        `**__New Positive Vouch__**\n\n**Vouch ID:** \`${randNum}\`\n**Vouched User**: \`${
          member.tag
        } (${member.id})\`\n**Vouched By**: \`${
          message.author.tag
        } (${
          message.author.id
        })\`\n**Comment**: \`${args
          .slice(1)
          .join(" ")}\``
      )
      .setFooter({ text: "Legit Bot"})
      .setColor("2F3136");

    let ch = "1100454864389144689";
    let cha = client.channels.cache.get(ch);
        try {
  await cha.send({ embeds: [embedThree] });
}
catch(err) {
  console.log("cant send to this channel missing permission")
    await member.send({content: "Cant send message to the channel. Missing Permissions"});
}
    

    let daata = await new vouchesModel({
      userID: userid,
      userTAG: member.tag,
      vouchNum: randNum,
      comment: args.slice(1).join(" "),
      vouchAuthor: `${message.author.tag} (${message.author.id})`,
      Status: "Pending",
    });
    await daata.save();
  }
  },
};
