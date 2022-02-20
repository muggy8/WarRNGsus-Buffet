/*
	{
		buy?: {
			target: "id of crypto / stock",
			amount: int // number of cents up to a cap defined in input
		},
		sell?: {
			target: "id of crypto / stock in portfolio",
			amount: double // from 0 to 1meaning percentage to sell
		},
		timeout: int // number of seconds to wait before executing this whole thing again (galaxy brain)
	}
*/

function generateOrder(){
	// step 1: decide if we buy or sell
	// step 2: based on step 1, we decide which item to buy or sell
	// step 3: based on step 2, decide how much we buy or sell

	// step 4: decide how long to slep

	// when called, we return a configuration to the parent to decide how to random and then the parent function will call us with the decided results
	stages.currentStep = stages.currentStep || stages.decideAction

	const args = Array.from(arguments)

	const randomConfigs = stages.currentStep.apply(this, args)

	return randomConfigs
}

const stages = {
	currentStep: undefined,
	command: undefined,
	decideAction: async function(decision){
		if (!decision){
			return [
				stages.decideItemToBuy,
				stages.decideItemToSell,
			]
		}

		stages.currentStep = decision
		return stages.currentStep()
	},
	decideItemToSell: async function(itemToSell){
		if (!itemToSell){
			stages.command = new Command()
			stages.command.setAction(stages.command.sellAction)
			// todo: hit portfolio api to get a list of current owned portfolio and return it as the config

			return
		}

		stages.command.setTarget(itemToSell)
		stages.currentStep = decideHowMuchToSell
		return stages.currentStep()
	},
	decideHowMuchToSell: async function(decidedAmount){
		if (!decidedAmount){
			// todo: hit portfolio api see how much we have of the current crypto we have and then return a config of how much to sell of that crypto. if we have no crypto in our current portfolio. we should go to the other branch and set up buys.

			return
		}

		stages.command.setAmount(decidedAmount)
		stages.currentStep = stages.decideHowLongToWait
		return stages.currentStep()
	},
	decideItemToBuy: async function(itemToBuy){
		if (!itemToBuy){
			stages.command = new Command()
			stages.command.setAction(stages.command.buyAction)
			// todo: hit exchange api to get a list of avalable stuff to buy and return it as the config
		}

		stages.command.setTarget(itemToBuy)
		stages.currentStep = decideHowMuchToBuy
		return stages.currentStep()
	},
	decideHowMuchToBuy: async function(decidedAmount){
		if (!decidedAmount){
			// todo: hit portfolio api see how much money we currently have and generate a random number of money to buy based the lower between our upper buy limit or our current money. if we have no money we should invalidate this to to another branch of the decision setup

			return
		}

		stages.command.setAmount(decidedAmount)
		stages.currentStep = stages.decideHowLongToWait
		return stages.currentStep()
	},
	decideHowLongToWait: async function(waitDuration){
		if (!waitDuration){
			// return a config of allowed wait duration based on our global configs
			return
		}

		stages.currentStep = undefined
		stages.command.setTimeout(waitDuration)
		const execCommnad = stages.command.execute
		stages.command = undefined
		return execCommnad
	}
}

async function chooseBasedOnConfig(randomnessConfig){
	// todo: generate random number based on randomnessConfig and return it to the caller
}

function Command(action, target, amount, setTimeout){
	this.action = action
	this.targe = target
	this.amount = amount
	this.setTimeout = setTimeout

	this.execute = command.prototype.execute.bind(this)
}

command.prototype.setAction = function(action){
	this.action = action
}

command.prototype.setTarget = function(target){
	this.target = target
}

command.prototype.setAmount = function(amount){
	this.amount = amount
}

command.prototype.setTimeout = function(timeout){
	this.timeout = timeout
}

command.ptotoype.buyAction = async function(target, amount){
	// todo: the rest of this function
}

command.prototype.sellAction = async function(target, amount){
	// todo: also the rest of this function
}

command.prototype.execute = async function(callback){
	setTimeout(callback, this.timeout)
	return this.action(this.target, this.amount)
}

/*
	await generateOrder() -> config

	loop until we get a command:
		await chooseBasedOnConfig(newConfig or config) -> result
		await generateOrder(result) -> newConfig or command

	await execute command
*/

module.exports = {
	chooseBasedOnConfig,
	generateOrder,
	Command
}
