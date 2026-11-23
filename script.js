// Important HTML elements

// HTML ID's
let gameboxes = document.getElementsByClassName("gamebox")

let titleScreen = document.getElementById("TitleScreen");
let battleScreen = document.getElementById("BattleScreen");
let shopScreen = document.getElementById("ShopScreen");
let winScreen = document.getElementById("WinScreen");
let loseScreen = document.getElementById("LoseScreen");
let creditsScreen = document.getElementById("CreditsScreen");

let enemyContainer = document.getElementById("EnemyContainer");
let enemySlots = document.getElementsByClassName("enemySlot");

let playButton = document.getElementById("PlayButton");
let creditsButton = document.getElementById("CreditsButton");

let attackEnemyButton = document.getElementById("AttackEnemyButton");
let defendButton = document.getElementById("DefendButton");
let checkEnemyButton = document.getElementById("CheckEnemyButton");
let consumableItemButton = document.getElementById("ConsumableItemButton");
let skipTurnButton = document.getElementById("SkipTurnButton");

// HTML classes
let showTitle = document.getElementsByClassName("ShowTitle");
let showBattle = document.getElementsByClassName("ShowBattle");
let showShop = document.getElementsByClassName("ShowShop");
let showWin = document.getElementsByClassName("ShowWin");
let showLose = document.getElementsByClassName("ShowLose");
let showCredits = document.getElementsByClassName("ShowCredits");
//

// Classes/Objects, other variables and setting up the game
class BattleStats {
    constructor(hp, defense, resistance, attackPower) {
        this.HP = parseInt(hp);
        this.MaxHP = this.HP;
        this.Defense = parseInt(defense);
        this.Resistance = parseFloat(resistance);
        this.AttackPower = parseInt(attackPower);
    }

    DamageHP(dmg, pierceDef, pierceRes) {   // Returns a number representing how much damage was dealt, returns null if unsuccessful
        if (this.HP <= 0)
            return null;

        let defenseEquation;
        if (pierceDef)
            defenseEquation = parseInt(dmg);
        else
            defenseEquation = parseInt(dmg - this.Defense);

        let resistanceEquation;
        if (pierceRes)
            resistanceEquation = 1;
        else
            resistanceEquation = parseFloat(1 - this.Resistance);

        let dmgToInflict;

        if (defenseEquation <= 0 || resistanceEquation <= 0) // If defenseEquation is less than 0 that means that the amount of damage that will be inflicted is less than zero, the defense mechanic is used for reducing the amount of damage that will be inflicted to the entity, but it can't reduce it past 1.
            dmgToInflict = 1;
        else
            dmgToInflict = parseInt(defenseEquation * resistanceEquation);

        this.HP -= dmgToInflict;
        return dmgToInflict;
    }

    HealHP(amount, healPastMax) {   // Returns true if the entity was healed to or past max HP.
        if (this.HP >= this.MaxHP && !healPastMax) // Stops the entity from being healed if it's HP is greater than or equal to it's MaxHP while the healPastMax parameter is false
            return false;

        this.HP += amount;

        if (this.HP >= this.MaxHP && !healPastMax) {
            this.HP = this.MaxHP;
            return true;
        }
        else if (this.HP >= this.MaxHP && healPastMax && this.HP - amount < this.MaxHP) {
            return true;
        }

        return false;
    }
}

class EnemyStats {
    constructor(name, dropRew, moveFunctions, moveSeq, idleSpr) {
        this.Name = name;
        this.DropReward = dropRew;
        this.MoveCount = 0;

        if (typeof moveFunctions === 'object') {
            this.MoveSet = moveFunctions;
        }
        else {
            this.MoveSet = [
                function () {
                    console.log("Nothin\'");
                }
            ];
        }

        if (typeof moveSeq === 'object') {
            this.MoveSequence = moveSeq;
        }
        else {
            this.MoveSequence = [0];
        }

        if (typeof idleSpr === 'string' || idleSpr instanceof String)
            this.IdleSprite = idleSpr;
        else
            this.IdleSprite = "./assets/img/noEnemy.png";
    }

    UseTurn() {
        this.MoveSet[this.MoveSequence[this.MoveCount % this.MoveSequence.length]]?.();
        this.MoveCount++;
    }

    TriggerDeath() {
        Player.Coins += this.DropReward
    }
}

let Player = {
    BStats: new BattleStats(100, 0, 0, 25),
    Coins: 0,
    Defending: false,

    AdditionalDEF: 20,     // Additional stats are applied when the player is defending
    AdditionalRES: 0
}

let enemyArray = [
    {
        EStats: new EnemyStats(
            "Nothing",
            0,

            [
                function () {
                    console.log("Nothin\'");
                }
            ],
            [0],
            "./assets/img/noEnemy.png"
        ),

        BStats: new BattleStats(0, 0, 1, 0)
    },

    {
        EStats: new EnemyStats(
            "Knight",
            0,

            [
                function () {
                    console.log("Dah knight");
                }
            ],
            [0]
        ),

        BStats: new BattleStats(50, 10, 0, 15)
    }
];

let currentEnemies = [
    {},
    {},
    {},
    {}
];


for (let i = 0; i < currentEnemies.length; i++) {
    if (i % 2 == 0)
        currentEnemies[i] = _.cloneDeep(enemyArray[0]);
    else
        currentEnemies[i] = _.cloneDeep(enemyArray[1]);
}

enemyTurn();

//


// Functions
function showScreen(screenName) {   // Returns true if the screen change was successful, false otherwise
    for (let i = 0; i < gameboxes.length; i++) {
        gameboxes[i].style.display = 'none';
    }

    switch (screenName.toLowerCase()) {
        default:
            console.log(`SCREEN NOT FOUND! (Name: ${screenName})`);
            return false;
            break;

        case "title": case "titlescreen":
            titleScreen.style.display = 'flex';
            break;

        case "battle": case "battlescreen":
            battleScreen.style.display = 'flex';
            break;

        case "shop": case "shopscreen":
            shopScreen.style.display = 'flex';
            break;

        case "win": case "winscreen": case "w":
            winScreen.style.display = 'flex';
            break;

        case "lose": case "losescreen": case "l":
            loseScreen.style.display = 'flex';
            break;

        case "credits": case "creditsscreen":
            creditsScreen.style.display = 'flex';
            break;
    }

    return true;
}

function playerTurn(option) // Returns true if the turn was used, false otherwise
{
    /*
    option values:
    1 - Attack,
    2 - Defend,
    3 - Check,
    4 - Use consumable item,
    Other - Skip turn 
    */

    if (Player.BStats.HP <= 0) {
        addMessageInOutput("Can\'t do this action because the player is dead.");
        return false;
    }

    switch (option) {
        case 1: // Attack
            // The player picks an enemy from the gamebox and it will be damaged
            break;
        case 2: // Defend
            // Increases the players defense and/or resistance for this move temporarily
            break;
        case 3: // Check
            // The player picks an enemy from the gamebox and its stats will be displayed, this doesn't use the players turn
            break;
        case 4: // Use consumable item
            // A menu will appear where the players consumable items will be displayed, here the player can pick an item to use
            break;
        default:
            return true;
    }
}

function enemyTurn() {
    for (let i = 0; i < currentEnemies.length; i++) {
        currentEnemies[i].EStats.UseTurn?.();
    }
}

function restartBattle() {
    Player.HP = Player.BStats.MaxHP;

    for (let i = 0; i < currentEnemies.length; i++) {
        currentEnemies[i].BStats.HP = currentEnemies[i].BStats.MaxHP;
        currentEnemies[i].EStats.MoveCount = 0;
    }
}
//


// Event listeners

for (let i = 0; i < showTitle.length; i++) {
    showTitle[i].addEventListener("click", function () {
        showScreen("title");
    });
}

for (let i = 0; i < showBattle.length; i++) {
    showBattle[i].addEventListener("click", function () {
        showScreen("battle");
    });
}

for (let i = 0; i < showShop.length; i++) {
    showShop[i].addEventListener("click", function () {
        showScreen("shop");
    });
}

for (let i = 0; i < showWin.length; i++) {
    showWin[i].addEventListener("click", function () {
        showScreen("win");
    });
}

for (let i = 0; i < showLose.length; i++) {
    showLose[i].addEventListener("click", function () {
        showScreen("lose");
    });
}

for (let i = 0; i < showCredits.length; i++) {
    showCredits[i].addEventListener("click", function () {
        showScreen("credits");
    });
}
//


// Function calls
showScreen("title");
//