/**
 * Created by andrey on 08.05.2022.
 */

var Battle = function () {
    this.gold = 100;

    this.solders = [];
    this.enemies = [];
    for (var i = 0; i < 3; i++) {
        this.solders.push(new Solder('solder'));
        this.enemies.push(new Solder('enemy'));
    }

    setTimeout(this.start.bind(this), 3000);

    this.onStart = function () {};
    this.finish = function () {};
    this.onUpdateBalance = function () {};
};

Battle.prototype.start = function () {
    this.running = true;

    console.log("Started!");
    this.onStart();

    this.interval = setInterval(this.run.bind(this), 100);
};

Battle.prototype.useBooster = function () {
    var cost = 50;
    if (this.gold < cost) {
        return;
    }

    this.gold -= cost;
    var solder = this.solders.reduce(function (prev, cur) {
        return prev.hp < cur.hp ? prev : cur;
    });
    solder.takeDamage(-50);
    this.onUpdateBalance();
};

Battle.prototype.run = function () {
    var aliveSolders = this.solders.filter((solder) => solder.isAlive());
    var aliveEnemies = this.enemies.filter((enemy) => enemy.isAlive());
    if (aliveSolders.length <= 0 || aliveEnemies.length <= 0) {
        this.stop();
        return;
    }

    if (!this.nextSolderAttack) {
        this.nextSolderAttack = Date.now() +
            Math.random() * (Battle.SOLDER_INTERVAL[1] - Battle.SOLDER_INTERVAL[0]) + Battle.SOLDER_INTERVAL[0];
    }

    if (Date.now() > this.nextSolderAttack) {
        aliveSolders[Math.floor(Math.random() * 10 % aliveSolders.length)].attack(aliveEnemies[Math.floor(Math.random() * 10 % aliveEnemies.length)]);
        delete this.nextSolderAttack;
    }

    aliveSolders = aliveSolders.filter((solder) => solder.isAlive());
    aliveEnemies = aliveEnemies.filter((enemy) => enemy.isAlive());
    if (aliveSolders.length <= 0 || aliveEnemies.length <= 0) {
        this.stop();
        return;
    }

    if (!this.nextEnemyAttack) {
        this.nextEnemyAttack = Date.now() +
            Math.random() * (Battle.ENEMY_INTERVAL[1] - Battle.ENEMY_INTERVAL[0]) + Battle.ENEMY_INTERVAL[0];
    }

    if (Date.now() > this.nextEnemyAttack) {
        aliveEnemies[Math.floor(Math.random() * 10 % aliveEnemies.length)].attack(aliveSolders[Math.floor(Math.random() * 10 % aliveSolders.length)]);
        delete this.nextEnemyAttack;
    }
};

Battle.prototype.stop = function () {
    this.finish(this.solders.some((solder) => solder.isAlive()));
    this.running = false;

    console.log("Stopped!");

    clearInterval(this.interval);
};

Battle.SOLDER_INTERVAL = [1000, 3000];
Battle.ENEMY_INTERVAL = [2000, 3000];
