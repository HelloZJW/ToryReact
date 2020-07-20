class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(vChild) {
        vChild.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type)
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export class Componet {
    constructor() {
        this.children = [];
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }

    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
}

export const ToyReact = {
    createElement(type, attr, ...children) {
        let element;
        if (typeof type === 'string') {
            element = new ElementWrapper(type);
        }
        else {
            element = new type;
        }
        for (const name in attr) {
            element.setAttribute(name, attr[name]);
        }

        let insertChildren = (_children) => {
            for (let child of _children) {
                if (typeof child === 'object' && child instanceof Array) {
                    insertChildren(child);
                }
                else {
                    if (typeof child === 'string') {
                        child = new TextWrapper(child);
                    }
                    element.appendChild(child);
                }
            }
        }
        insertChildren(children);
        return element;
    },

    render(vdom, element) {
        vdom.mountTo(element);
    }
}