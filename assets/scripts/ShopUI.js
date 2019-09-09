const ChargeUI = require('ChargeUI');

cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        figure: cc.Sprite,
        btnsNode: cc.Node,
        chargeUI: ChargeUI
    },

    // use this for initialization
    init: function (home, panelType) {
        this.home = home;
        this.node.active = false;
        this.anim.play('shop_reset');
        this.panelType = panelType;
        this.figure.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 1, 0.96), cc.scaleTo(1, 1, 1))));
        this.chargeUI.init(home, this.btnsNode);
    },

    show: function () {
        this.node.active = true;
        this.anim.play('shop_intro');
    },

    hide: function () {
        this.anim.play('shop_outro');
    },

    onFinishShow: function () {
        this.home.curPanel = this.panelType;
    },

    onFinishHide: function () {
        this.node.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
