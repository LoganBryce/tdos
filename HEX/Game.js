/* NOTES
	HEX.html by Ewan Breakey 

	The goal is to draw a line across/down the screen before your opponent.

	player 1 (RED) goes ACROSS the page
					&
	player 2 (BLUE) goes DOWN the page
*/

//YOU WILL OVERRIDE THESE, THEY MUST RETURN AN ARRAY WITH 2 INTEGERS BETWEEN 0 & 10
function player1_turn()
{
	var x = Math.round(Math.random()*(gridSize-1));
	var y = Math.round(Math.random()*(gridSize-1));
	return hex(x,y);
}

function player2_turn()
{
	var x = Math.round(Math.random()*(gridSize-1));
	var y = Math.round(Math.random()*(gridSize-1));
	return hex(x,y);
}


/*GAME DEFINITIONS*/
function game_title(){return 'HEX';}
function game_background(){return 'black';}
function game_wbackground(){return 'black';}
function game_width(){return 1130;}
function game_height(){return 760;}

/*GAME EVENTS*/
function game_init(game){
	
	//GRID CONSTANTS
	gridSize = 11;
	gridRes = 64;
	gridPad = 10;
	gridOff = 2;
	
	//DEBUG CONSTANTS
	showConnectionValues = false;
	saturateColours = false;
	customScriptLeft = true;
	customScriptRight = true;
	
	//COLOUR CONSTANTS
	blank = '#3D3D3D';
	red = '#E52D3D';
	blue = '#655DE2';
	redSat = '#FF0000';
	blueSat = '#0000FF';
	
	//DYNAMIC
	turn = 0;
	turnCount = 0;
	attemptCount = 0;
	gameStopped = 0;
	willDisplayEnd = '';
	validated = false;
	
	//AI DEBUGGING
	traceHex = {x: -1,y: -1,colour: 'black'};
	
	//SET COLOURS
	color = '#3D3D3D';
	window.document.getElementById("title").style = "color:"+color+";";
	window.document.getElementById("left-title").style = "color:"+color+";";
	window.document.getElementById("right-title").style = "color:"+color+";";
	window.document.getElementById("right").style = "background-color:"+color+";";
	window.document.getElementById("left").style = "background-color:"+color+";";
	
	//CREATE AND POPULATE GRID (STORES WHO OWNS A HEX)
	grid = create2dArray(gridSize);
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			grid[x][y] = 0;
		}
	}
	
	//CREATE AND POPULATE ANOTHER GRID (STORES WHETHER A HEX IS CONNECTED)
	cgrid = create3dArray(gridSize);
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			cgrid[x][y][0] = 0;
			cgrid[x][y][1] = 0;
		}
	}
	
	
	//INITIALIZE SPRITES
	init_sprites();
}

function init_sprites()
{
	//DEFINE HEX SPRITE
	sHex = new Image();
	sHex.src = "Hex.png"
}

function clear()
{
	//FOR EACH HEX
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			//SET TO BLANK
			grid[x][y] = 0;
		}
	}	
	
	
}

function game_turns()
{
	
	var success = false; //BOOL - DID THE PLAYER CHOOSE A LEGITIMATE HEX?
	var hex = new Array();
	
	hex[0] = 0;
	hex[1] = 0;
	
	//VALIDATE
	validated = true;
	
	//WHO'S TURN IS IT?
	if (turn == 0)
	{
		//FUNCTION DECIDES WHICH PEICE
		hex = player1_turn();
	}
	
	if (turn == 1)
	{
		hex = player2_turn();
	}
	
	//UNVALIDATE
	validated = false;
	
	//GET RETURNED VALUES
	var xx = hex[0];
	var yy = hex[1];
	
	//WAS IT LEGIT MOVE?
	if ((hex[0] >= 0 && hex[1] >= 0) && (hex[0] < gridSize && hex[1] < gridSize))
	{
		//IS IT NOT TAKEN?
		if (grid[xx][yy] == 0)
		{
			grid[xx][yy] = turn+1;
			success = true;
		}
		
		//IF PLAYER CLAIMED A HEX
		if (success)
		{
			//SWAP TURNS
			turn = turn == 1 ? 0 : 1;
			turnCount++;
		}
	}
	
	attemptCount++;
}

function game_update_connections_ext(board,cboard,auth)
{
	//MAKE SURE EDGES ARE SET
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			var check = -1;
			//CHECKING HORIZONTAL OR VERTICAL?
			if (board[x][y] == 1)
			{var check = x;}
			if (board[x][y] == 2)
			{var check = y;}
		
			//WE HAVE A VALUE TO CHECK
			if (check != -1)
			{
				//OK, CHECK CONNECTED TO EITHER SIDE
				cboard[x][y][0] = (check == 0) ? 1 : cboard[x][y][0];
				cboard[x][y][1] = (check == gridSize - 1) ? 1 : cboard[x][y][1];
			}
		}
	}
	
	// FOR EACH HEX
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			for (var e=0;e<2;e++) //FOR BOTH EDGES
			{
				if (board[x][y] != 0) // ARE WE COLOURED?
				{
					if (cboard[x][y][e]) // ARE WE CONNECTED TO THAT EDGE
					{
						// FOR ALL HEX'S IN A GRID AROUND US
						for (var i=-1;i<2;i++)
						{
							for (var j=-1;j<2;j++)
							{
								if ((x+i >= 0 && x+i < gridSize) && (y+j >= 0 && y+j < gridSize) && (i != j)) // ARE WE INSIDE GRID AND NOT A CORNER OR CENTER?
								{
									if (board[x+i][y+j] == board[x][y] && cboard[x+i][y+j][e] != 1) // IS OUR NEIGHBOUR OUR COLOUR AND ARE THEY NOT ALREADY SET?
									{
										// SET VALUE!
										cboard[x+i][y+j][e] = 1;
										
										if (cboard[x+i][y+j][e == 0 ? 1 : 0] && !gameStopped)
										{
											if(auth){if (board[x][y] != 0){gameStopped = true;log("STOPPED GAME W/ VAL: " + board[x][y]);}}
											return board[x][y];
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 0;
}

function game_update_connections()
{
	var win = game_update_connections_ext(grid,cgrid,true);
	var col = blank;
	if (win == 1)
	{
		//PLAYER 1 WON
		log("RED WON!");
		col = red;
	}
	if (win == 2)
	{
		log("BLUE WON!");
		//PLAYER 2 WON
		col = blue;
	}
	if (win != 0){
		document.getElementById("title").style = "color: "+col+";";
		document.getElementById("left-title").style = "color: "+col+";";
		document.getElementById("right-title").style = "color: "+col+";";
		document.getElementById("left").style = "background-color: "+col+";";
		document.getElementById("right").style = "background-color: "+col+";";
	}
}

function game_loop()
{
	//IF SOMEONE HASN'T ALREADY WON
	if (!gameStopped)
	{
		//IF NOT HOLDING THE PAUSE KEY, TAKE TURN
		if (!getKey("p")){game_turns();}
		
		//UPDATE HEX CONNECTIONS
		game_update_connections();
	}
	//RESTART GAME IF USER PRESSES R
	if (getKeyPressed("r")){console.clear();game_init();}
}

function game_draw_hexs(ctx)
{
	//FOR EACH GRID SPOT
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			//WHERE IS HEX? CONSIDER PADDING AND OFFSET PLUS SKEWING TO MAKE A RHOMBUS
			var xx = (gridOff + (x*(gridRes+gridPad)))+y*(gridRes/2);
			var yy = (gridOff + (y*(gridRes+(1/2*gridPad))));
			var colour = blank;
			
			//WHICH COLOUR?
			colour = grid[x][y]==0 ? blank : grid[x][y]==1 ? red : blue;
			//SATURATE?
			if (saturateColours)
			{
				if (colour == red){colour = cgrid[x][y][0]+cgrid[x][y][1] > 0 ? redSat : colour;}
				if (colour == blue){colour = cgrid[x][y][0]+cgrid[x][y][1] > 0 ? blueSat : colour;}
			}
			
			//ARE WE THE TRACE HEX?
			if (traceHex.x == x && traceHex.y == y && !gameStopped)
			{
				colour = traceHex.colour;
			}
			
			//DRAW HEX
			ctx.drawImage(sHex,xx,yy);
			//COLOUR HEX
			ctx.globalCompositeOperation = "multiply";
			ctx.fillStyle=colour;
			ctx.fillRect(xx,yy,gridRes,gridRes);
			ctx.globalCompositeOperation = "source-over";
			
			//DRAW CONNECTION DEBUG TEST?
			if (showConnectionValues)
			{
			ctx.fillStyle='black';
			ctx.fillText(cgrid[x][y][0].toString()+cgrid[x][y][1].toString(),xx+(gridRes/2),yy+(gridRes/2));
			}
		}
	}
}

function game_draw(ctx,game){
	
	game_loop();
	game_draw_hexs(ctx);
	
	//DISPLAY END MESSAGE IF NECESSARY
	if (willDisplayEnd != "")
	{
		alert(willDisplayEnd);
		willDisplayEnd = "";
	}
}