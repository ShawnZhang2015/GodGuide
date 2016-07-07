cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    init: function (home, parentBtns) {
        this.home = home;
        this.parentBtns = parentBtns;
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.home.toggleHomeBtns(false);
        cc.eventManager.pauseTarget(this.parentBtns);
    },

    hide: function () {
        this.node.emit('fade-out');
        this.home.toggleHomeBtns(true);
        cc.eventManager.resumeTarget(this.parentBtns);
    },
});
