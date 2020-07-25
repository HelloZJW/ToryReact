let childrenSymbol = Symbol('children');
class ElementWrapper {
    constructor(type) {
        this.type = type;
        this.props = Object.create(null);
        this[childrenSymbol] = [];
        this.children = [];
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(vChild) {
        this[childrenSymbol].push(vChild);
        this.children.push(vChild.vdom);
    }

    get vdom(){
        return this; 
    }

    mountTo(range) {
        this.range = range;
        let placeholder = document.createComment('placeholder');
        let endRange = document.createRange();
        endRange.setStart(range.endContainer, range.endOffset);
        endRange.setEnd(range.endContainer, range.endOffset);
        endRange.insertNode(placeholder);

        range.deleteContents();
        let element = document.createElement(this.type);
        for (let name in this.props) {
            let value = this.props[name];
            if (name.match(/^on([\s\S]+)$/)) {
                let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
                element.addEventListener(eventName, value);
            }
            if (name === "className") {
                name = "class";
            }
            element.setAttribute(name, value);
        }
        for (const child of this.children) {
            let range = document.createRange();
            if (element.children.length) {
                range.setStartAfter(element.lastChild);
                range.setEndAfter(element.lastChild);
            } else {
                range.setStart(element, 0);
                range.setEnd(element, 0);
            }
            child.mountTo(range);
        }

        range.insertNode(element);
    }
}

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type);
        this.type = "#text";
        this.children = [];
        this.props = Object.create(null);
    }

    mountTo(range) {
        this.range = range;
        range.deleteContents();
        range.insertNode(this.root);
    }

    get vdom(){
        return this; 
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }

    get type() {
        return this.constructor.name;
    }
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }

    mountTo(range) {
        this.componentWillUnmount();
        this.range = range;
        this.update();
        this.componentDidMount();
    }

    update() {
        let vdom = this.vdom;
        if (this.oldVdom) {
            console.log('new:', vdom);
            console.log('old:', this.vdom);
            const isSameNode = (node1, node2) => {
                if (node1.type !== node2.type) return false;
                if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
                    return false;
                }
                for (const name in node1.props) {
                    // if (typeof node1.props[name] === 'function' && typeof node2.props[name] === 'function'
                    //     && node1.props[name].toString() === node2.props[name].toString()) {
                    //     continue;
                    // }
                    if (typeof node1.props[name] === 'object' && typeof node2.props[name] === 'object'
                        && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])) {
                        continue;
                    }
                    if (node1.props[name] !== node2.props[name]) return false;
                }

                return true;
            }

            const isSameTree = (node1, node2) => {
                if (!isSameNode(node1, node2)) return false;
                if (node1.children.length !== node2.children.length) {
                    return false;
                }
                for (let i = 0; i < node1.children.length; i++) {
                    if (!isSameTree(node1.children[i], node2.children[i])) {
                        return false;
                    }
                }

                return true;
            }

            let replace = (newTree, oldTree, indent) => {
                console.log(indent + 'new:', newTree);
                console.log(indent + 'old', oldTree);
                if (isSameTree(newTree, oldTree))
                    return;
                if (!isSameNode(newTree, oldTree)) {
                    // root is different and replace root
                    newTree.mountTo(oldTree.range);
                } else {
                    for (let i = 0; i < newTree.children.length; i++) {
                        replace(newTree.children[i], oldTree.children[i], '  ' + indent);
                    }
                }
            }

            replace(vdom, this.oldVdom, '');

        } else { 
            vdom.mountTo(this.range);
        }
        this.oldVdom = vdom;
    }

    get vdom(){
        return this.render().vdom;
    }

    setState(state) {
        let merge = (oldState, newState) => {
            for (const p in newState) {
                if (typeof newState[p] === "object" && newState[p] !== null) {
                    if (typeof oldState[p] !== "object") {
                        if (newState[p] instanceof Array) {
                            oldState[p] = [];
                        } else
                            oldState[p] = {};
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
        };

        if (!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
    }
}

export const ToyReact = {
    createElement(type, attr, ...children) {
        let element;
        if (typeof type === "string") {
            element = new ElementWrapper(type);
        } else {
            element = new type();
        }
        for (const name in attr) {
            element.setAttribute(name, attr[name]);
        }

        let insertChildren = (_children) => {
            for (let child of _children) {
                if (child === null || child === void 0) {
                    child = "";
                }
                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if (typeof child === "string") {
                        child = new TextWrapper(child);
                    }
                    element.appendChild(child);
                }
            }
        };
        insertChildren(children);
        return element;
    },

    render(vdom, element) {
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        vdom.mountTo(range);
    },
};
