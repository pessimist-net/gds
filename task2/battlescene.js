/**
 * Created by andrey on 06.05.2022.
 */

var BattleScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.battle = new Battle();

        this.addBackground();

        this.solderView = new SolderView(this.battle.solder);
        this.solderView.setPosition(this.width / 2 - this.width / 6, this.height / 2);
        this.addChild(this.solderView);

        this.enemyView = new SolderView(this.battle.enemy);
        this.enemyView.setPosition(this.width / 2 + this.width / 6, this.height / 2);
        this.addChild(this.enemyView);

        this.addAttackButton();

        cc.audioEngine.playMusic(resources.battle_music, true);
        cc.audioEngine.setMusicVolume(0.5);

        this.animation = sp.SkeletonAnimation.create(resources.battle_versus_json, resources.battle_atlas);
        this.animation.setAnimation(0, "animation");
        this.animation.setCompleteListener(this.animation.removeFromParent);

        this.animation.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.animation);
    },

    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },

    addAttackButton: function () {
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.attackButton = new ccui.Button('#button.png', '#button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.attackButton.setScale9Enabled(true);
        this.attackButton.setContentSize(180, 70);
        this.attackButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.attackButton.setPosition(this.width / 2, this.height / 2 - this.height / 3);
        this.addChild(this.attackButton);

        this.attackButton.setTitleText("ATTACK");
        this.attackButton.setTitleFontSize(35);
        this.attackButton.setTitleFontName(resources.marvin_round.name);
        this.attackButton.setEnabled(false);

        this.attackButton.addClickEventListener(function () {
            if (!this.battle.running) {
                console.log("wait start");
                return;
            }

            if (this.attackTimeout) {
                return;
            }

            this.attackButton.setEnabled(false);
            this.battle.solder.attack(this.battle.enemy);
            this.attackTimeout = setTimeout(function () {
                this.attackButton.setEnabled(true);
                delete this.attackTimeout;
            }.bind(this), 1000);
        }.bind(this));
    },

    finishAnimation: function (isVictory) {
        this.animation = sp.SkeletonAnimation.create(resources.battle_victory_json, resources.battle_atlas);
        this.animation.setAnimation(0, "animation");
        this.animation.setCompleteListener(this.animation.removeFromParent);

        this.animation.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.animation);

        var text = isVictory ? "VICTORY" : "WASTED";
        var label = new cc.LabelTTF(text, "MarvinRound", 130, cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(this.width / 2, this.height / 2 + 20);
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