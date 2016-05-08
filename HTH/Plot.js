//PLOT THE DATA IN 'CARDS'

/*

THIS IS JUST A TEST / PROTOTYPE
IT HAS CRAP PROGRAMMING, DO NOT FEEL INSPIRED.

BUT IF YOUR INTERESTED IN MAKING A PROPER PROGRAM HIT ME UP:
retroverse21@icloud.com
(I dont actually use icloud, its an autoforward to protect my email XD)

*/


function game_init()
{
	gameScale = 40;
	gameOffset = [100,100];
	circleOffset = [50,50];
	circleScale = 5;
	showValues = true;
	
}

function game_draw(ctx) {
	
	//get zoom
	gameScale = Math.max(0,$("#zoom").val() * 1);
	
	//get circle
	circleScale = Math.max(0,$("#circle").val() * 1);
	
	
	ctx.save();
	ctx.translate(gameOffset[0],gameOffset[1]);
	
	//IF THE DATA IS RETURNED AS OF NOW
	if (gotCards) {
		
		//PLOT HEALTH+ATTACK
		if (document.getElementById("ha").checked)
		{
			//CREATE ARRAY OF CARD VALUES STUFF (INIT 0)
			var cardCount = [];
			for (var i=0;i<50;i++){
				cardCount[i] = [];
				for (var j=0;j<50;j++){
					cardCount[i][j] = 0;
				}
			}
			
			//SET COLOUR
			ctx.fillStyle = "black";
			
			//LOOP THROUGH CARDS AND DRAW THEM
			var i = cards.length;
			while (i--) {
				try {
				ctx.beginPath();
				cardCount[cards[i].cost][cards[i].attack+cards[i].health] ++;
				ctx.arc(cards[i].cost*gameScale+circleOffset[0],(cards[i].attack+cards[i].health)*gameScale+circleOffset[1],cardCount[cards[i].cost][cards[i].attack+cards[i].health]*circleScale,0,2*Math.PI);
				ctx.fill();
				}
				catch (e){}
			}
		}
		
		//DO THE SAME FOR JUST HEALTH
		if (document.getElementById("h").checked)
		{
			//CREATE ARRAY OF CARD VALUES STUFF (INIT 0)
			cardCount = [];
			for (var i=0;i<50;i++){
				cardCount[i] = [];
				for (var j=0;j<50;j++){
					cardCount[i][j] = 0;
				}
			}
			
			//SET COLOUR
			ctx.fillStyle = "red";
			
			//LOOP THROUGH CARDS AND DRAW THEM
			var i = cards.length;
			while (i--) {
				try {
				ctx.beginPath();
				cardCount[cards[i].cost][cards[i].health] ++;
				ctx.arc(cards[i].cost*gameScale+circleOffset[0],(cards[i].health)*gameScale+circleOffset[1],cardCount[cards[i].cost][cards[i].health]*circleScale,0,2*Math.PI);
				ctx.fill();
				}
				catch (e){}
			}
		}
		
		//DO THE SAME FOR JUST ATTACK
		if (document.getElementById("a").checked)
		{
			//CREATE ARRAY OF CARD VALUES STUFF (INIT 0)
			cardCount = [];
			for (var i=0;i<50;i++){
				cardCount[i] = [];
				for (var j=0;j<50;j++){
					cardCount[i][j] = 0;
				}
			}
			
			//SET COLOUR
			ctx.fillStyle = "blue";
			
			//LOOP THROUGH CARDS AND DRAW THEM
			var i = cards.length;
			while (i--) {
				try {
				ctx.beginPath();
				cardCount[cards[i].cost][cards[i].attack] ++;
				ctx.arc(cards[i].cost*gameScale+circleOffset[0],(cards[i].attack)*gameScale+circleOffset[1],cardCount[cards[i].cost][cards[i].attack]*circleScale,0,2*Math.PI);
				ctx.fill();
				}
				catch (e){}
			}
		}
		
		//GET CLOSEST CIRCLE TO MOUSE
		
	}
	
	
	//DRAW BORDER VALUES
	
	//ALONG SIDE
	ctx.fillStyle = "black";
	for (var i = 0;i<25;i++) {
		ctx.fillText(i,0,i*gameScale+circleOffset[1]+5)
	}
	
	//ALONG TOP
	for (var i = 0;i<40;i++) {
		ctx.fillText(i,i*gameScale+circleOffset[0],0)
	}
	
	//DRAW CIRCLE VALUES
	
	
	
	
	
	ctx.restore();
}