const express = require ('express')
const router = express.Router();
const puppeteer = require('puppeteer');
router.post('/', async(req,res) => {
    try
    {
        
        const contentToCapture = req.body.content;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(contentToCapture);
        const pdfBuffer = await page.pdf();
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Cryptex.pdf');
        res.send(pdfBuffer);

    }
    catch (error)
    {
        console.log('error occured: ' , error) ;
        res.status(500).send('Internal Server Error');
    }
})
module.exports=router;