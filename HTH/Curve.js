//GETS CARDS FROM https://api.hearthstonejson.com/v1/latest/enUS/cards.json

//DEFINE CONSTANTS
getNonCollectible = false;
allCards = "https://api.hearthstonejson.com/v1/latest/enUS/cards.json";
collCards = "https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json";

gotCards = false;

function callBack(data) {
	useData(data);
}

function useData(data) {
	//USED FOR DEBUGGING
	cards = data;
	gotCards = true;
	console.log("Cards Loaded")
}


var get = "";
get = getNonCollectible ? allCards : collCards;
$.get(get,callBack);