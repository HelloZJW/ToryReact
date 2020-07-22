
class ElementWrapper {
    constructor(type) {
        this.type = type;
        this.props = Object.create(null);
        this.children = [];
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }

    mountTo(range) {
        this.range = range;
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
        let vdom = this.render();
        vdom.mountTo(this.range);
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
