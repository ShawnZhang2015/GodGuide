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
        this.parentBtns.pauseSystemEvents();
    },

    hide: function () {
        this.node.emit('fade-out');
        this.home.toggleHomeBtns(true);
        this.parentBtns.resumeSystemEvents();
    },
});
