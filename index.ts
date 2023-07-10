import axios from 'axios';
import cheerio from 'cheerio';
import { MongoClient } from 'mongodb';

export class bookingsHotelScraper {
	async scrapeHotel(url: string) {
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);

		const hotelName = $('.d2fee87262.pp-header__title').text().trim();
		console.log("Hotel Name : ", hotelName);
		const hotelNameData = hotelName.split(' ').map(element => $(element).html());

		const hotelStars = $('.fbb11b26f5.e23c0b1d74').find('span').length;
		console.log("Rating : ", hotelStars);
		const hotelStarsData = hotelStars;


		const hotelAddress = $('.hp_address_subtitle.js-hp_address_subtitle.jq_tooltip').text().trim();
		console.log("Address : ", hotelAddress);
		const hotelAdressData = hotelAddress.split(' ').map(element => $(element).html());


		const popularFacilitiesdiv = $('.e5e0727360');
		const mostPopularFacilites = popularFacilitiesdiv.find('.db312485ba').text();
		console.log("Most popular faculites : ", mostPopularFacilites);
		const mostPopularFacilitesData = mostPopularFacilites.split(' ').map(element => $(element).html());


		const houseRules = $('#hotelPoliciesInc').text().replace(/^\s+|\s+$/gm, ' ');
		console.log("House rules : ", houseRules);
		const houseRulesData = houseRules.split(' ').map(element => $(element).html());

		const uri = 'mongodb://localhost:27017';
	const client = new MongoClient(uri);
	try {
		await client.connect();
		const db = client.db('bookingsdatabase');
		const collection = db.collection('housings.crawled');

//		await collection.insertMany(hotelNameData);
		await collection.insertMany(hotelStarsData);
//		await collection.insertMany(hotelAdressData);
//		await collection.insertMany(mostPopularFacilitesData);
//		await collection.insertMany(houseRulesData);

		console.log('Data stored in mongoDB successfully!');
	} catch (error) {
		console.log('Error storing data in MongoDB', error);
	} finally {
		client.close();
	}

	}
}

async function main() {
	const scraper = new bookingsHotelScraper();
	await scraper.scrapeHotel("https://www.booking.com/hotel/at/motel-one-wien-westbahnhof.en-gb.html");
}

main();