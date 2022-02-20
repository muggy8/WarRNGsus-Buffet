const randomAPIUrl = "https://qrng.anu.edu.au/wp-content/plugins/colours-plugin/get_one_hex.php"
const fetch = import("node-fetch")

module.exports = async function RNGsus(){
	const fetcher = await fetch
	const hex = await fetcher.default(
		`${randomAPIUrl}/?_=${Date.now()}`,
		{
			headers: {
				"method": 'GET',
				"Access-Control-Allow-Origin": "*"
			}
		}
	)

	return hex.text()
}

RNGsus.max = "ff"
RNGsus.min = "00"
