import axios from 'axios';
import cheerio from 'cheerio';


export class bookingsHotelScraper {
	async scrapeHotel(url: string) {
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);

		const hotelName = $('.d2fee87262.pp-header__title').text().trim();
		console.log("Hotel Name : ", hotelName);

		const hotelStars = $('.fbb11b26f5.e23c0b1d74').find('span').length;
		console.log("Rating : ", hotelStars);

		const hotelAddress = $('.hp_address_subtitle.js-hp_address_subtitle.jq_tooltip').text().trim();
		console.log("Address : ", hotelAddress);


		const popularFacilitiesdiv = $('.e5e0727360');
		const mostPopularFacilites = popularFacilitiesdiv.find('.db312485ba').text();
		console.log("Most popular faculites : ", mostPopularFacilites);

		const houseRules = $('#hotelPoliciesInc').text().replace(/^\s+|\s+$/gm, ' ');
		console.log("House rules : ", 
		houseRules);
	}
}

async function main() {
	const scraper = new bookingsHotelScraper();
	await scraper.scrapeHotel("https://www.booking.com/hotel/at/motel-one-wien-westbahnhof.en-gb.html");
}

main();