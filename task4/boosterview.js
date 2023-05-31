var BoosterView = ccui.Button.extend({
    ctor: function (useFunc) {
        this._super('#button.png', '#button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.setScale9Enabled(true);
        this.setContentSize(180, 70);
        this.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));

        this.setTitleText("HEAL");
        this.setTitleFontSize(35);
        this.setTitleFontName(resources.marvin_round.name);
        this.setEnabled(false);

        this.addClickEventListener(useFunc.bind(this));
    }
});