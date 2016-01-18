cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.outOfWorld = cc.p(3000, 0);
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
    },

    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.position = cc.p(0, 0);
        this.node.setScale(2);
        this.node.opacity = 0;
        this.node.runAction(this.actionFadeIn);
    },

    startFadeOut: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },

    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
