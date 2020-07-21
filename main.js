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
  <div><span>I </span>
    <span>am </span>
    <span>ToyReact!</span>
  </div>
</MyComponent>

ToyReact.render(a, document.body);
