cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.outOfWorld = cc.p(3000, 0);
        this.node.position = this.outOfWorld;
        let callback = cc.callFunc(this.onFadeOutFinish, this);
        this.actionFadeIn = cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0));
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), callback);
    },

    startFadeIn: function () {
        this.node.position = cc.p(0, 0);
        this.node.setScale(2);
        this.node.opacity = 0;
        this.node.runAction(this.actionFadeIn);
    },

    startFadeOut: function () {
        this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {

    },

    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
