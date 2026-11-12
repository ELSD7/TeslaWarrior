// Important HTML elements

//

// Classes/Objects and other globals
class BattleStats {
    constructor(hp, defense, resistance, attackPower) {
        this.HP = parseInt(hp);
        this.MaxHP = this.HP;
        this.Defense = parseInt(defense);
        this.Resistance = parseFloat(resistance);
        this.AttackPower = parseInt(attackPower);
    }

    DamageHP(dmg, pierceDef, pierceRes) {   // Returns a number representing how much damage was dealth, returns null if unsuccessful
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

        if (defenseEquation <= 0) // If defenseEquation is less than 0 that means that the amount of damage that will be inflicted is less than zero, the defense mechanic is used for reducing the amount of damage that will be inflicted to the entity, but it can't reduce it past 1.
            dmgToInflict = 1;
        else if (resistanceEquation <= 0) // resistanceEquation isn't supposed to be less than 0 in any case so I put this check just in case.
            dmgToInflict = 0;
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

//


// Function calls

//