{% article i18n="zh-CN" %}

# Error错误处理

## Error Handling with：`Result`, `Option` & `panic!` macro

### Error Type in Rust

Rust中的错误可以分为两种：
- Recoverable error: 有返回类型
    - 返回Result类型
    - 返回Option类型

- Unrecoverable type: 没有返回类型，直接崩溃
    - `panic macro`将终止当前线程

### `Result`

- `Result`是一个枚举类型，有两个变体：`ok`和`Err`。它通常用于表示函数的执行结果，其中`ok`表示成功的结果，`Err`表示出现了错误：

```rust
pub enum Result<T,E> {
    Ok(T),
    Err(E),
}
```

### `Option`

- `Option`也是一个枚举类型，有两个变体：`Some`和`None`。它通常用于表示一个可能为空的值。

```rust
pub enum Option<T> {
    None,
    Some(T),
}
```

### `panic!`

- 当程序遇到无法继续执行的错误时，可以使用`panic!`宏来引发恐慌。恐慌会导致程序立即终止，并显示一条错误信息。

### Example

定义两个函数分别为`divide`和`find_element`，

```rust
fn divide(a: i32, b: i32) -> Result<f64, String> {
    if b == 0 {
        return Err(String::from("cannot be zero"));
    }
    let a = a as f64;
    let b = b as f64;
    Ok(a / b)
}

fn find_element(array: &[i32], target: i32) -> Option<usize> {
    for (index, elem) in array.iter().enumerate() {
        if (*elem) == target {
            return Some(index);
        }
    }
    None
}


fn main() {
    // result
    match divide(1, 2) {
        Ok(number) => println!("{}", number), // 0.5
        Err(err) => println!("{}", err),
    }

    match divide(1, 0) {
        Ok(number) => println!("{}", number),
        Err(err) => println!("{}", err), // cannot be zero
    }
    // option
    let arr = [1, 2, 3, 4, 5];
    match find_element(&arr, 4) {
        Some(index) => println!("found in {}", index), // found in 3
        None => println!("None"),
    }

    match find_element(&arr, 7) {
        Some(index) => println!("found in {}", index), 
        None => println!("None"), // None
    }

    // panic
    let vec = vec![1, 2, 3, 4, 5];
    vec[43];
}
```

## Error Handling with：`unwrap()` & `?`

### `unwrap()`

`unwrap()`是`Result`和`Option`类型提供的方法之一。它是一个简便的方法，用于获取`Ok`或`Some`的值，如果是`Err`或`None`则会引发`panic`。

{% callout type="note" title="提示" %}
该方法并不安全。
{% /callout %}

### `?` Operator

- `?`用于简化`Result`或`Option`类型的错误传播。它只能用于返回`Result`或`Option`的函数中，并且在函数内部可以像使用`unwrap()`一样访问`Ok`或`Some`的值，但是如果是`Err`或`None`则会提前返回。

### Example

```rust {% lineNum=true %}
use std::num::ParseIntError;

fn find_first_even(numbers: Vec<i32>) -> Option<i32> {
    let first_even = numbers.iter().find(|&num| num % 2 == 0)?; // 使用?运算符前提条件是需要返回Option类型
    Some(*first_even)
}

// 传递错误
fn parse_numbers(input: &str) -> Result<i32, ParseIntError> {
    let val = input.parse::<i32>()?; // 使用?运算符如果发现error将提前返回
    Ok(val)
}


fn main() -> Result<(), Box<dyn std::error::Error>> {
    let result_ok: Result<i32, &str> = Ok(32);
    let value = result_ok.unwrap();
    println!("{}", value); // 32

    let result_ok: Result<i32, &str> = Ok(32);
    let value = result_ok?;
    println!("{}", value); // 32

    let numbers = vec![1, 2, 3, 4, 5];
    match find_first_even(numbers) {
        Some(number) => println!("first even {}", number), // first even 2
        None => println!("no such number"),
    }

    match parse_numbers("d") {
        Ok(i) => println!("parsed {}", i),
        Err(err) => println!("failed to parse: {}", err), // failed to parse: invalid digit found in string
    }

    Ok(())
}
```

## Customize an `Error` Type

自定义`Error`类型的三个步骤：

1. 定义错误类型结构体：创建一个结构体来表示你的错误类型，通常包含一些字段来描述错误的详细信息。
2. 实现`std::fmt::Display trait`：实现这个`trait`以定义如何展示错误信息。这是为了使错误能够以人类可读的方式打印出来。
3. 实现`std::error::Error trait`：实现这个`trait`以满足Rust的错误处理机制的要求。

```rust {% lineNum=true %}
use std::fmt::write;

#[derive(Debug)]
struct MyError {
    detail: String,
}

impl std::fmt::Display for MyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Custom Error: {}", self.detail)
    }
}

impl std::error::Error for MyError {
    fn description(&self) -> &str {
        &self.detail
    }
    // &String => &str 字符串引用自动转换成字符串字面量
}

fn func_err() -> Result<(), MyError> {
    Err(MyError{
        detail: "Custom Error".to_owned(),
    })
}

fn func_ok() -> Result<(), MyError> {
    Ok(())
}

fn main() -> Result<(), MyError> {
    match func_ok() {
        Ok(_) => println!("func ok"),
        Err(err) => println!("Error: {}", err),
    }
    func_ok()?;
    println!("ok");
    match func_err() {
        Ok(_) => println!("func ok"),
        Err(err) => println!("Error: {}", err),
    }
    func_err()?;
    println!("oo");
    Ok(())
}

// fn main() -> Result<(), Box<dyn std::error::Error>> {
//     match func() {
//         Ok(_) => println!("func ok"),
//         Err(err) => println!("Error: {}", err),
//     }
//     func()?;
//     println!("oo");
//     Ok(())
// }
```

{% /article %}

{% article i18n="en" %}

# Error Handling

{% /article %}

{% article i18n="es" %}

# Manejo de errores

{% /article %}