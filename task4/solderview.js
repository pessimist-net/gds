/**
 * Created by andrey on 08.05.2022.
 */

var SolderView = cc.Node.extend({
    ctor: function (solder) {
        this._super();

        this.solder = solder;

        this.animation = sp.SkeletonAnimation.create(resources[solder.type + solder.code + '_json'], resources.battle_atlas);
        this.animation.setAnimation(0, "idle", true);
        this.addChild(this.animation);

        var scaleValue = 0.3;
        this.healthBarBg = new cc.Scale9Sprite("progress_background.png");
        this.healthBarBg.setContentSize(300, 100);
        this.healthBarBg.setAnchorPoint(0, 0.5);
        this.healthBarBg.setPosition(-150 * scaleValue, 150);
        this.healthBarBg.setScale(scaleValue);
        this.addChild(this.healthBarBg);

        this.healthBar = new cc.Scale9Sprite("progressbar.png");
        this.healthBar.setContentSize(300, 100);
        this.healthBar.setAnchorPoint(0, 0.5);
        this.healthBar.setPosition(-150 * scaleValue, 150);
        this.healthBar.setScale(scaleValue);
        this.addChild(this.healthBar);

        if (solder.type === 'solder') {
            this.animation.setScaleX(-1);
        }

        solder.onTakeDamageAnimation = this.onTakeDamage.bind(this);
        solder.onAttackAnimation = this.onAttack.bind(this);
        solder.onDieAnimation = this.onDie.bind(this);
    },

    onDie: function() {
        this.animation.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.ToggleVisibility()
        ));

        this.healthBarBg.removeFromParent();
        this.healthBar.removeFromParent();
    },

    onAttack: function() {
        this.animation.setAnimation(0, "attack", false);
        this.animation.setCompleteListener(function() {
            this.animation.setAnimation(0, "idle", true);
        }.bind(this));

        cc.audioEngine.playEffect(resources['battle_' + this.solder.type + '_effect'], false);
    },

    onTakeDamage: function (takenDamage) {
        this.hpDelta = new cc.LabelTTF(-takenDamage, resources.marvin_round.name, 28, cc.TEXT_ALIGNMENT_CENTER);
        this.hpDelta.setPositionX(50);
        this.addChild(this.hpDelta);
        this.hpDelta.setColor(new cc.Color(0, 255, 255, 255));
        this.hpDelta.runAction(new cc.Sequence(
            new cc.MoveBy(1, new cc.Point(0, 50)),
            new cc.RemoveSelf()
        ));

        this.animation.runAction(new cc.Sequence(
            new cc.FadeTo(0.3, 140),
            new cc.FadeTo(0.3, 255)
        ));

        var damage = sp.SkeletonAnimation.create(resources.damage_json, resources.battle_atlas);
        damage.setAnimation(0, "animation", false);
        damage.setCompleteListener(function() {
            damage.removeFromParent();
        })
        this.addChild(damage);

        
        this.healthBar.setContentSize(300 * (this.solder.hp / Solder.HP), 100);
        if (this.solder.hp > Solder.HP) {
            this.healthBarBg.setContentSize(300 * (this.solder.hp / Solder.HP), 100);
        } else {
            this.healthBarBg.setContentSize(300, 100);
        }
    }
});