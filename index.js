require('dotenv').config();
const { translate } = require('./translate');
const { speech } = require('./speech');
const { search } = require('./search')
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy:new LocalAuth({
        dataPath:"sessiondetails"
    })
});


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async(message) => {
    if(message.from === Process.env.GROUP){
        let text, translated_text
        switch(true){
            case message.body.startsWith('Translate to kannada') :
                console.log("Message from group :",message.body)
                text = message.body.substring(21).trim();
                console.log("Translating text is :",text)
                translated_text=await translate("kn",text)
                await message.reply("Here is your translated text:\n"+translated_text)
                break;

            case message.body.startsWith('Translate to english') :
                console.log("Message from group :",message.body)
                text = message.body.substring(21).trim();
                console.log("Translating text is :",text)
                translated_text=await translate("en",text)
                await message.reply("Here is your translated text:\n"+translated_text);
                break;

            case message.body.startsWith('Translate to hindi') :
                console.log("Message from group :",message.body)
                text = message.body.substring(19).trim();
                console.log("Translating text is :",text)
                translated_text=await translate("hi",text)
                await message.reply("Here is your translated text:\n"+translated_text);
                break;

            case message.body.startsWith('Speech') :
                const topic_array = message.body.match(/Speech\n(.+?)\n/);
                const topic = topic_array[1];
                const lang_array = message.body.match(/\n(.+?)\n(?!.*\n)/);
                const lang = lang_array[1];
                const word_array = message.body.match(/\n(.+?)$/);
                const word_num = word_array[1]
                const speech_content = await speech(lang,topic,word_num);
                console.log("Speech is:",speech_content)
                await message.reply("Here is your speech:\n"+speech_content);
                break;
            
            case message.body.startsWith('Search'):
                const prompt = message.body.substring(7).trim();
                console.log("Searching for: ", prompt);
                const searchresult = await search(prompt);
                console.log(searchresult)
                await message.reply(searchresult);
                break;
            default:
                break;
        }
    }
});
 

client.initialize();
