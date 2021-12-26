const Discord = require("discord.js")
const client = new Discord.Client()
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function input(question) {
    return new Promise((resolve, reject) => {
        rl.question(`\x1b[33m[*] \x1b[0m${question}`, (answer) => resolve(answer) );
    });
}
console.info = (str) => console.log(`\x1b[33m[*] \x1b[0m${str}`)
console.success = (str) => console.log(`\x1b[32m[+] \x1b[0m${str}`)
console.error = (str) => console.log(`\x1b[31m[-] \x1b[0m${str}`)


async function start() {
    console.clear()
    console.success("Script started")
    let token = await input("Enter authorization token: ")
    checkToken(token)
}

async function checkToken(token) {
    console.success(`Token checking.. [${token}]`)
    if(token.length!=59) {
        console.error("Invalid token!")
        console.info("Script shutdown.")
        process.exit()
    }
    client.login(token).catch(() => {
        console.error("Invalid token!")
        console.info("Script shutdown.")
        process.exit()
    }).then(async () => {
        let command = await input("Trigger command: ")
        let delay = await input("Message delete delay (milliseconds): ")
        let working = false;
        client.on("message", async (message) => {
            if(message.content == command && message.author.id == client.user.id) {
                if(message.guild) return console.error(`Guild cleaning is not supported.`)
                let chname = ""
                if(message.channel.type=="dm") chname = message.channel.recipient.username
                else if (message.channel.type="group") chname = message.channel.recipients.map(x=>x.username).join(", ")
                console.info(`100 message fetching in '${message.channel.recipient.username}'.`)
                let messages = await message.channel.fetchMessages({limit:100})
                messages=[...messages.filter(x=>x.author.id==client.user.id)]
                console.info(`100 message deleting in '${chname}'.`)
                messages.forEach((msg,index,array) => {
                    setTimeout(() => {
                        msg[1].delete()
                    },delay * index)
                })
            }
        })
    })
}

start()