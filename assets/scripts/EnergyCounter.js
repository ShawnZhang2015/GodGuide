cc.Class({
    extends: cc.Component,

    properties: {
        timeToRecover: 0,
        totalCount: 0,
        currentCount: 0,
        labelTimer: {
            default: null,
            type: cc.Label
        },
        labelCount: {
            default: null,
            type: cc.Label
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function () {
        this.timer = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let ratio = this.timer/this.timeToRecover;
        this.progressBar.progress = ratio;
        if (this.currentCount > this.totalCount) this.currentCount = this.totalCount;
        let timeLeft = Math.floor(this.timeToRecover - this.timer);
        this.labelCount.string = this.currentCount + '/' + this.totalCount;
        this.labelTimer.string = Math.floor(timeLeft/60).toString() + ':' + (timeLeft%60 < 10 ? '0' : '') + timeLeft%60;
        this.timer += dt;
        if (this.timer >= this.timeToRecover) {
            this.timer = 0;
            this.currentCount++;
        }
    },
});
