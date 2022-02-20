let rng = require("./random-async.js")
let { chooseBasedOnConfig, generateOrder } = require("./generator.js")

rng(5).then(console.log)

async function traderBot(){
	let decisionConfigsOrCommand = await generateOrder()

	while(typeof decisionConfigsOrCommand != "function"){
		let decision = await chooseBasedOnConfig(decisionConfigsOrCommand)
		decisionConfigsOrCommand = await generateOrder(decision)
	}

	decisionConfigsOrCommand(traderBot)
}

traderBot()
