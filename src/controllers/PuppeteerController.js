const puppeteer = require('puppeteer');

module.exports = {
    async twitterLogin(req, res, next) {
		try {
            const { params } = req.body;
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('https://twitter.com/login', {
				waitUntil: 'networkidle2',
            });
			
			// await page.waitForTimeout(5000);
			// const teste = await page.evaluate(() => {
			// 	const teste = document.querySelector('input[name="session[username_or_email]"]');
			// 	return teste;
			// });
			// console.log(teste)

            // write in input
			await page.waitForTimeout(2000);
            await page.click('input[name="session[username_or_email]"]');
			await page.keyboard.sendCharacter(params.username);

			await page.waitForTimeout(2000);

            await page.click('input[name="session[password]"]');
			await page.keyboard.sendCharacter(params.password);
            // submit login
            await page.keyboard.press('Enter');

			await page.waitForTimeout(1000);
			await page.screenshot({path: 'example.png'});

            await browser.close();

			return res.send("testado");
		} catch (error) {
			next(error);
		} return null;
    },
}