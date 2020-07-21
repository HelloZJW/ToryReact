import { ToyReact, Componet } from "./ToyReact";

class MyComponent extends Componet {
  render() {
    return (
      <div>
        <span>Hello,</span>
        <span>world</span>
        {this.children}
        {this.state ? this.state.value : '0'}
        <button onClick={() => {
          this.setState({ value: 'x' });
        }}>点我</button>
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
