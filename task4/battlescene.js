/**
 * Created by andrey on 06.05.2022.
 */

var BattleScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.battle = new Battle();

        this.addBackground();
        this.addBalance();

        for (var i = 0; i < 3; i++) {
            this.solderView = new SolderView(this.battle.solders[i]);
            this.solderView.setPosition(this.width / 2 - this.width / 6 + 100 * (i % 2), this.height / 2 + (-150 * (i - 1)));
            this.addChild(this.solderView);

            this.enemyView = new SolderView(this.battle.enemies[i]);
            this.enemyView.setPosition(this.width / 2 + this.width / 6 - 100 * (i % 2), this.height / 2 + (-150 * (i - 1)));
            this.addChild(this.enemyView);
        }

        this.addBoosterButton();

        cc.audioEngine.playMusic(resources.battle_music, true);
        cc.audioEngine.setMusicVolume(0.5);

        this.animation = sp.SkeletonAnimation.create(resources.battle_versus_json, resources.battle_atlas);
        this.animation.setAnimation(0, "animation");
        this.animation.setCompleteListener(this.animation.removeFromParent);

        this.animation.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.animation);

        this.battle.onStart = function () {
            this.boosterButton.setEnabled(true);
        }.bind(this);
        this.battle.finish = this.finishAnimation.bind(this);
        this.battle.onUpdateBalance = this.updateBalance.bind(this);
    },

    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },

    addBalance: function () {
        this.balance = new cc.LabelTTF(this.battle.gold, resources.marvin_round.name, 70, cc.TEXT_ALIGNMENT_CENTER);
        this.balance.setPosition(this.width - 150, this.height - 100);
        this.addChild(this.balance);
    },

    updateBalance: function() {
        this.balance.setString(this.battle.gold);
    },

    addBoosterButton: function () {
        this.boosterButton = new BoosterView(function () {
            this.battle.useBooster();
        }.bind(this));
        this.boosterButton.setPosition(this.width / 2, this.height / 2 - this.height / 3);
        this.addChild(this.boosterButton);  
    },

    finishAnimation: function (isVictory) {
        this.animation = sp.SkeletonAnimation.create(resources.battle_victory_json, resources.battle_atlas);
        this.animation.setAnimation(0, "animation");
        this.animation.setCompleteListener(this.animation.removeFromParent);

        this.animation.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.animation);

        var text = isVictory ? "VICTORY" : "WASTED";
        var label = new cc.LabelTTF(text, resources.marvin_round.name, 130, cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(this.width / 2, this.height / 2 + 50);
        label.setVisible(false);
        label.setAnchorPoint(0.5, 0.8);
        label.runAction(new cc.Sequence(
            new cc.DelayTime(0.25),
            new cc.Show(),
            new cc.DelayTime(0.5),
            new cc.ScaleTo(1.6, 1.15)
        ));
        this.addChild(label);
    }
});