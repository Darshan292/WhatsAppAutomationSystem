const puppeteer = require('puppeteer');

async function search(text){
    const websiteUrl = Process.env.SEACHWEBSITE;
    const targetarea = Process.env.SEACHTARGETAREA
    const targetextract = Process.env.SEACHTARGETEXTRACT;
    const button = Process.env.SEACHBUTTON;
    const copy = Process.env.SEACHCOPY;
    let result;
    let browser;
    try{
        browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(targetarea,{visible:true});
        await page.type(targetarea, text);
        await page.click(button);
        await page.waitForSelector(targetextract);
        await page.waitForSelector(copy);
        const extractedtag = await page.evaluate(()=>{
            const divtag = document.querySelector(Process.env.SEACHTARGETEXTRACT)
            if(!divtag){
                return null;
            }
            const tags = Array.from(divtag.querySelectorAll('p'));
            return tags.map(p => p.textContent.trim());
        })
        result = extractedtag.join('\n')
    }catch(error){
        console.error('Error:', error.message);
    }finally{
        if(browser){
            browser.close();
        }
    }
    return result;
}
module.exports = {search}
