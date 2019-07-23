
//let task1 = require('task1');
let async = require('async');

cc.Class({
    extends: cc.Component,
    properties: {
        PREFAB: cc.Prefab, //预制件
        parent: cc.Node,   //预制件实例化后所在的父节点
        zIndex: 0,
        tasks: [cc.String],
    },

    onLoad() {
        if (!CC_EDITOR) {
            this.loadPrefab();
        }
    },

    start() {
        this.runTask();
    },

    loadPrefab() {
        try {
            let node = cc.instantiate(this.PREFAB);
            node.zIndex = this.zIndex;
            node.position = cc.v2(0, 0);
            //不持久化到编辑器
            node._objFlags = cc.Object.Flags.DontSave;
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent('GodGuide');
        }
        catch (error) {
            cc.error(this.PREFAB);
            cc.error(error);
        }
    },

    runTask() {
        async.eachSeries(this.tasks, (taskFile, cb) => {
            let task = require(taskFile);
            this._godGuide.setTask(task);   
            this._godGuide.run(cb);   
        }, () => {
            cc.log('任务全部完成');
        });
    }
});