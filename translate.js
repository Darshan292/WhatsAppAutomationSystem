const puppeteer = require('puppeteer');

async function translate(to,text){
  const websiteUrl = Process.env.TRANSLATEWEBSITE+to; // Replace with the actual URL
  const targetSpanSelector = Process.env.TRANSLATESPANSELECTOR; // Replace with the actual selector
  const targettextarea = Process.env.TRANSLATETEXTAREA;
  let targetDataArray=[];
  let browser
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(targettextarea);
    await page.type(targettextarea, text);
    await page.waitForTimeout(2000);
    await page.waitForSelector(targetSpanSelector,{visible:true});
    targetDataArray = await page.$$eval(targetSpanSelector, spans => spans.map(span=>span.innerHTML));
    targetData = targetDataArray.join(' ');
  }catch(error){
    console.error('Error:', error.message);
  }finally{
    if(browser){
      browser.close();
    }
  }
  return targetData;
}

module.exports = {translate};





