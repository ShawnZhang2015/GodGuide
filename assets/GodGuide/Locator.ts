/**
 * @object
 * Location主要用从场景树中检索UI节点
 */

const { ccclass, property } = cc._decorator;
@ccclass
export class Locator {
    timeout: 5000; //超时
    locating: any;
    startTime: number;
    static locating: any;
    static startTime: number;
    static timeout: number;
    /**
     * 定位解析
     * @param locator
     * @returns {Array}
     */
    static parse(locator) {
        cc['assert'](locator, 'locator string is null');
        //使用正则表达示分隔名字
        let names = locator.split(/[.,//,>,#]/g);
        let segments = names.map(function (name) {
            let index = locator.indexOf(name);
            let symbol = locator[index - 1] || '>';
            return { symbol: symbol, name: name.trim() };
        });
        // console.log('segments----->', segments);
        return segments;
    }

    /**
     * 通过节点名搜索节点对象
     * @param root
     * @param name
     * @returns {*}
     */
    static seekNodeByName(root, name) {
        if (!root)
            return null;

        if (root.getName() == name)
            return root;
        let arrayRootChildren = root.getChildren();
        let length = arrayRootChildren.length;
        for (let i = 0; i < length; i++) {
            let child = arrayRootChildren[i];
            let res = this.seekNodeByName(child, name);
            if (res != null)
                return res;
        }
        return null;
    }

    /**
     * 在root节点中，定位locator
     * @param root
     * @param locator
     * @param cb
     */
    static locateNode(root, locator, cb) {
        if (!Locator.locating) {
            this.startTime = Date.now();
            this.locating = true;
        }
        let segments = Locator.parse(locator);
        cc['assert'](segments && segments.length);
        //cc.log('locateNode:' + locator);
        let child, node = root;

        for (let i = 0; i < segments.length; i++) {
            let item = segments[i];
            switch (item.symbol) {
                case '/':
                    child = node.getChildByName(item.name);
                    break;
                case '.':
                    child = node[item.name];
                    break;
                case '>':
                    child = this.seekNodeByName(node, item.name);
                    break;
                // case '#':
                //     child = this.seekNodeByName(node, item.name);
                //     break;
            }

            if (!child) {
                node = null;
                break;
            }
            node = child;
        }

        if (node && node.active && cb) {
            this.locating = false;
            cb(null, node);
        } else if (cb) {
            if (Date.now() - this.startTime > this.timeout) {
                cb({ error: 'timeout', locator });
            } else {
                setTimeout(function () {
                    this.locateNode(root, locator, cb);
                }, 10);
            }
        }

        return node;
    }

    static getNodeFullPath(node) {
        let array = [];
        let temp = node;
        do {
            array.unshift(temp.name);
            temp = temp.parent;
        } while (temp && temp.name !== 'Canvas')
        return array.join('/');
    }
}