// Important HTML elements

//

// Classes/Objects
class BattleStats {
    constructor(hp, defense, resistance, attackPower) {
        this.HP = parseInt(hp);
        this.MaxHP = this.HP;
        this.Defense = parseInt(defense);
        this.Resistance = parseFloat(resistance);
        this.AttackPower = parseInt(attackPower);
    }

    damageHP(dmg, pierceDef, pierceRes) {   // Returns a number representing how much damage was dealth, returns null if unsuccessful
        if (this.HP <= 0)
            return null;

        let defenseEquation = parseInt(dmg - this.Defense);
        let resistanceEquation = parseFloat(1 - this.Resistance);
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

    healHP(amount, healPastMax) {   // Returns true if the entity was healed to or past max HP.
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
    constructor(name, dropRew) {
        this.Name = name;
        this.DropReward = dropRew;
        this.MoveCount = 0;

        this.MoveSet = [
            function () {
                console.log("Nothin\'");
            }
        ];

        this.MoveSequence = [0];
        this.IdleSprite = "./assets/img/noEnemy.png";
    }

    useTurn() {
        this.MoveSet[this.MoveSequence[this.MoveCount % this.MoveSequence.length]]?.();
        this.MoveCount++;
    }

    triggerDeath() {
        Player.Coins += this.DropReward
    }
}

let Player = {
    bStats: new BattleStats(100, 0, 0, 25),
    Coins: 0,
    Defending: false,

    AdditionalDEF: 20,     // Additional stats are applied when the player is defending
    AdditionalRES: 0
}

let enemy = new EnemyStats("Michael", 30);
enemy.MoveSet[0] = function () {
    console.log("Somethin\'")
}

enemy.useTurn();

console.log(`Player coins: ${Player.Coins}`);
enemy.triggerDeath();
console.log(`Player coins: ${Player.Coins}`);
//


// Functions
function playerTurn(option) // Returns true if the turn was successful, false otherwise
{
    /*
    option values:
    1 - Attack,
    2 - Defend,
    3 - Check,
    4 - Use consumable item,
    Other - Skip turn 
    */

    if (player.bStats.HP <= 0) {
        addMessageInOutput("Can\'t do this action because the player is dead.");
        return false;
    }

    switch (option) {
        case 1: // Attack
            break;
        case 2: // Defend
            break;
        case 3: // Check
            break;
        case 4: // Use consumable item, for now it heals 4HP everytime it's used
            break;
        default:
            addMessageInOutput("Skipped turn.");
            return true;
    }
}

function enemyTurn() {

}

function restartBattle() {
    player.HP = player.MaxHP;
}
//


// Event listeners

//


// Function calls

//