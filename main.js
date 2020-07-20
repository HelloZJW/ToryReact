import { ToyReact, Componet } from "./ToyReact";

class MyComponent extends Componet {
  render() {
    return (
      <div>
        <span>Hello,</span>
        <span>world</span>
        {this.children}
      </div>
    );
  }
}

let a = <MyComponent name="a">
  <div>12123</div>
</MyComponent>

ToyReact.render(a, document.body);
