{% article i18n="zh-CN" %}

# 使用format!串联字符串

## Description

可以在可变的`String`上使用`push`和`push_str`方法来建立字符串，或者使用其`+`操作符。 然而，使用`format!`往往更方便，特别是在有字面和非字面字符串混合的地方。

## Example

```rust
fn say_hello1(name: &str) -> String {
    let mut result: String = "hello ".to_owned();
    result.push_str(string: name);
    result.push(ch: '!');
    result
}

fn say_hello2(name: &str) -> String {
    format!("hello {}!", name)
}

fn main() {
    let s: &str = "world";
    println!(say_hello1(s)); // hello world!
    println!(say_hello2(s)); // hello world!
}
```

显然使用`format!`通常是组合字符串的最简洁和可读的方式。

{% /article %}

{% article i18n="en" %}

# Using format! to Concat Strings

## Description

Strings can be built using the `push` and `push_str` methods on a mutable `String`, or using its `+` operator. However, it is often more convenient to use `format!`, especially where there is a mix of literal and non-literal strings.

## Example

```rust
fn say_hello1(name: &str) -> String {
let mut result: String = "hello ".to_owned();
result.push_str(string: name);
result.push(ch: '!');
result
}

fn say_hello2(name: &str) -> String {
format!("hello {}!", name)
}

fn main() {
let s: &str = "world";
println!(say_hello1(s)); // hello world!
println!(say_hello2(s)); // hello world!
}
```

Obviously using `format!` is often the most concise and readable way to compose strings.

{% /article %}

{% article i18n="es" %}

# Usando format! para cadenas Concat

## describir

Las cadenas se pueden construir usando los métodos `push` y `push_str` en una `String` mutable, o usando su operador `+`. Sin embargo, suele ser más conveniente utilizar "format!", especialmente cuando hay una combinación de cadenas literales y no literales.

## ejemplo

```rust
fn say_hello1(nombre: &str) -> String {
 let result mut: String = "hola ".to_owned();
 result.push_str(string: nombre);
 result.push(ch: '!');
 result
}

fn say_hello2(nombre: &str) -> String {
 format!("¡hola {}!", nombre)
}

fn principal() {
 lets: &str = "mundo";
 println!(say_hello1(s)); // ¡hola mundo!
 println!(say_hello2(s)); // ¡hola mundo!
}
```

Obviamente, usar `format!` suele ser la forma más concisa y legible de combinar cadenas.

{% /article %}