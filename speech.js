const puppeteer = require('puppeteer');

async function speech(lang, topic, word_num){
    const websiteUrl = Process.env.SPEECHWEBSITE;
    const targettopic = Process.env.SPEECHTARGETTOPIC;
    const targetdiv = Process.env.SPEECHTARGETDIV;
    const button = Process.env.SPEECHBUTTON;
    const langselect = Process.env.SPEECHLANGSELECT;
    let speechcontent;
    let browser;
    try{
        browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(targettopic);
        await page.type(targettopic,topic+" within "+word_num+" words");
        await page.waitForSelector(langselect);
        await page.select(langselect,lang)
        await page.click(button);
        await page.waitForTimeout(6000);
        await page.waitForSelector(targetdiv, { visible: true});
        speechcontent = await page.$eval(targetdiv, (element) => element.innerHTML);
    }catch(error){
        console.error('Error:', error.message);
    }finally{
        if(browser){
            browser.close();
        }
    }
    return speechcontent;

}

module.exports = {speech};
