const randomAPIUrl = "https://qrng.anu.edu.au/wp-content/plugins/colours-plugin/get_one_hex.php"
const fetch = import("node-fetch")

module.exports = async function RNGsus(desiredLength = 2){
	const fetcher = await fetch

	let hex = ""

	while(hex.length < desiredLength){
		let hexByte = await fetcher.default(
			`${randomAPIUrl}/?_=${Date.now()}`,
			{
				headers: {
					"method": 'GET',
					"Access-Control-Allow-Origin": "*"
				}
			}
		)

		const hextText = await hexByte.text()
		hex = hex + hextText
	}

	hex = hex.substring(0, desiredLength)

	return parseInt(await hex, 16)
}
// gernerate random number between 0 and 255
