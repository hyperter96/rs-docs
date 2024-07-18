{% article i18n="zh-CN" %}

# 在析构器中做最终处理

## Description

Rust中，通常在析构函数中运行退出前必须运行的代码。

## Example

```rust
#[derive(Debug)]
struct A(u8);

impl Drop for A {
    fn drop(&mut self) {
        println!("A exit");
    }
}

struct B(u8);

impl Drop for B {
    fn drop(&mut self) {
        println!("B exit");
    }
}

fn main() {
    let a: A = A(1);
    {
        let b: B = B(1);
        println!("a: {:?}", a);
        println!("b: {:?}", b);
    }
    panic!("error"); // 之后A的drop函数有执行
}
```

{% callout type="note" title="注意" %}
需要注意的是，析构函数中的`drop`不能写`panic!`，否则`panic!`往后的操作可能没有执行，需要释放的资源没有释放掉。
{% /callout %}

{% /article %}

{% article i18n="en" %}

# Do Final Processing in the Destructor

## Description

In Rust, destructors are usually used to run code that must be run before exiting.

## Example

```rust
#[derive(Debug)]
struct A(u8);

impl Drop for A {
    fn drop(&mut self) {
        println!("A exit");
    }
}

struct B(u8);

impl Drop for B {
    fn drop(&mut self) {
        println!("B exit");
    }
}

fn main() {
    let a: A = A(1);
    {
        let b: B = B(1);
        println!("a: {:?}", a);
        println!("b: {:?}", b);
    }
    panic!("error"); // the drop function of A executes after the panic!
}
```

{% callout type="note" title="Note" %}
It should be noted that `panic!` cannot be written in the `drop` of the destructor, otherwise the operations after `panic!` may not be executed and the resources that need to be released are not released.
{% /callout %}

{% /article %}

{% article i18n="es" %}

# Hacer procesamiento final en destructor

{% /article %}