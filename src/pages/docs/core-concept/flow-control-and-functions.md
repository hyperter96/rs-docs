{% article i18n="zh-CN" %}

# 流程控制和函数

## `if` & `match`

### Flow Control

Execution Flow（流程）

1. 代码执行从上到下`line-by-line`
2. 而我们执行操作时，控制流程可能会改变

主要的流程控制结构

1. 顺序结构：程序按照代码的顺序一步一步执行，没有跳过或循环。
2. 选择结构：根据条件选择不同的路径执行。常见的选择结构有：
    - `if`语句：根据条件执行不同的代码块
    - `switch`语句：根据不同的条件值执行不同的代码块

3. 循环结构：重复执行一段代码，直到满足某个条件为止。常见的循环结构有：
    - `for`循环：按照指定的次数重复执行一段代码。
    - `while`循环：在条件为真的情况下重复执行一段代码。
    - `do-while`循环：类似于`while`循环，但是保证至少执行一次循环体。

4. 跳转结构：控制程序的执行流程跳转到指定的位置。常见的跳转结构有：
    - `break`语句：终止循环或`switch`语句的执行。
    - `continue`语句：跳过当前循环中的剩余代码，进入下一次迭代。
    - `goto`语句：直接跳转到指定的标签处。

### `match` Expression

- `match`用于模式匹配，允许更复杂的条件和分支。
- 可以处理多个模式，提高代码的表达力。
- `match`是表达式，可以返回值。

```rust
match value {
    pattern1 => // code block executed if value matches pattern1
    pattern2 if condition => // code block executed if value matches pattern2 and condition is true
    _ => // code block executed for any other case 
}
```

## Loop & `break continue` & Iteration

### Loop

Rust提供了几种循环结构，其中最常见的是`loop`、`while`和`for`。

1. `loop`循环：

```rust
loop {
    // 无限循环的代码块
}
```

`loop`创建一个无限循环，可以通过`break`语句来中断循环。

2. `while`循环：

```rust
while condition {
    // 条件为真时执行的代码块
}
```

`while`循环在每次迭代之前检查一个条件，只有在条件为真时才执行循环体。

3. `for`循环：

```rust
for item in iterable {
    // 遍历可迭代对象执行的代码块
}
```

`for`循环用于迭代集合或范围，执行代码块来处理每个元素。

#### `for`

Rust中的for用于遍历迭代器。这与Python一致。

```rust
for var in iterator {
    // code
}
```
例：打印`0~9`。

```rust
for x in 0..10 {
    println!("{}", x);
}
```
例：反序打印`0~9`。

```rust
for x in (0..10).rev() {
    println!("{}", x);
}
```

在遍历的过程中，若需要获取索引值，只需要对集合调用`enumerate()`函数即可。

例：使用`enumerate`函数，打印索引值与数值。

```rust
for (i,j) in (5..10).enumerate() {
    println!("i = {} and j = {}", i, j);
}
// 打印输出：
// i = 0 and j = 5
// i = 1 and j = 6
// i = 2 and j = 7
// i = 3 and j = 8
// i = 4 and j = 9
```

例：打印出 行号与行内容。

```rust
let lines = "Content of line one
Content of line two
Content of line three
Content of line four".lines();
for (linenumber, line) in lines.enumerate() {
    println!("{}: {}", linenumber, line);
}
// 打印输出：
// 0: Content of line one
// 1: Content of line two
// 2: Content of line three
// 3: Content of line four
```

例：打印向量`for_numbers`。

```rust
let numbers = [1, 2, 3, 4, 5];
let mut for_numbers = Vec::new();
for &number in numbers.iter() {
    let item = number * number;
    for_numbers.push(item);
}
println!("for :{:?}", for_numbers);
// [1, 4, 9, 16, 25]
```

#### `while`

Rust中的`while`与其他语言中的`while`一致。唯一需要注意的是，条件表达式不需要括号。

```rust
while expression {
    // code
}
```

#### `loop`

Rust中的`loop`用于方便实现无限循环。

```rust
loop {
    // cide
}
```
该段代码等价于：

```rust
while true {
    // code
}
```

例：
```rust
let mut x = 5;
let mut done = false;

while !done {
    x += x - 3;

    println!("{}", x);

    if x % 5 == 0 {
        done = true;
    }
}
```

#### `break` & `continue`

跳出循环：

- `break` 跳出当前循环。
- `continue` 带到当前循环的下一次迭代。
例：

```rust
let mut x = 5;

loop {
    x += x - 3;

    println!("{}", x);

    if x % 5 == 0 { break; }
}
```

#### `label`

与Java中的`label`一致。`label`用于在循环中跳到指定位置。

```rust
'outer: for x in 0..10 {
    'inner: for y in 0..10 {
        if x % 2 == 0 { continue 'outer; } // continues the loop over x
        if y % 2 == 0 { continue 'inner; } // continues the loop over y
        println!("x: {}, y: {}", x, y);
    }
}
```

### Iteration

Rust的迭代主要通过迭代器（iterators）来实现。迭代器是一个抽象，它提供了一种访问集合元素的统一方式。

从实现上讲在Rust中，迭代器是一种实现了`Iterator trait`的类型。

简化源码：

```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

例：打印向量`iter_number`。

```rust
let numbers = [1, 2, 3, 4, 5].to_vec();
let iter_number: Vec<_> = numbers.iter().map(|&x|x*x).collect();
println!("iter : {:?}", iter_number);
```

### Difference between Loop & Iteration

循环适用于需要明确控制循环流程的情况，而迭代器则提供了一种更抽象的方式来处理集合元素。通常，推荐使用迭代器，因为它们可以提高代码的可读性和表达力。

`for`循环是一种语法结构，用于遍历集合中的元素。它依赖于集合类型实现`Iterator trait`。

在Rust中，迭代器提供了一系列用于遍历集合元素的方法。比如`next()`、`map()`、`filter()`等，可以让我们的代码更具有表达性。

## Function & Copy Parameter Passing

### Copy by value

- 如果数据类型实现Copy特质，则在函数传参时会实现Copy by value操作
- 会将实参拷贝为形参，形参改变并不会影响实参
- 如果要改变形参需要加`mut`
- `Struct`、枚举、集合等并没有实现Copy trait，会实现`move`操作失去所有权
- 为数据类型实现Copy trait，就可实现Copy by value

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y
}

fn change_i32(mut x: i32) {
    x = x + 4;
    println!("fn {x}");
}

fn modify_i32(x: &mut i32) {
    *x += 4;
}

#[derive(Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

fn print_point(point: Point) {
    println!("point x: {}", point.x);
}

fn main() {
    let a = 1;
    let b = 2;
    let c = add(a, b);
    println!("c: {c}");
    let mut x = 1; // 实参
    change_i32(x); // fn 5
    println!("change x: {x}"); // change x: 1
    // 实参x和change_i32函数中的形参改变没有关系
    modify_i32(&mut x); // 可变借用
    println!("modify x: {x}"); // modify x: 5
    let s = Point{x: 1, y: 2};
    print_point(s); // 所有权消失
    println!("{}", s.x); // 实现Copy
}
```

## Borrowing for Functions

### Function Parameter Passing

函数的代码本身通常是存储在可执行文件的代码段，而在调用时函数会在栈上开辟一个新的stack frame（栈空间），用于存储函数的局部变量、参数和返回地址等信息，而当函数结束后会释放该空间。

而当传入non-Copy value（`Vec`、`String`等）
- 传入函数时实参会转移`value`的所有权给形参，实参会失去`value`的所有权
- 而在函数结束时，`value`的所有权会释放

### Immutable Borrowing

- 如果你不想失去`value`的所有权，你又没有修改`value`的需求，你可以使用不可变借用
- 在Rust中，你可以将不可变引用作为函数的参数，从而在函数内部访问参数值但不能修改它。这有助于确保数据的安全性，防止在多处同时对数据进行写操作，从而避免数据竞争
- 如何应用不可变借用
    - Use `*` to dereference，去获取其的值

### Mutable Borrowing

- 如果你有修改值的需求你可以使用可变借用，以允许在函数内部修改参数的值。这允许函数对参数进行写操作，但在同一时间内只能有一个可变引用。
- 需要在形参前加`&mut`
- 如何应用可变引用
    - 同样使用Use `*` to dereference，去获取其的值

## Function Value Returning & Ownership

### Return Copy & Non-Copy

都可以返回，但是要注意Non-Copy是在堆上的。

性能：在一般情况下，返回`Copy`类型的值通常具有更好的性能。这是因为`Copy`类型的值是通过复制进行返回的，而不涉及堆上内存的分配和释放，通常是在栈上分配。这样的操作比涉及堆上内存的分配和释放更为高效。

### Return a Reference

- 在只有传入一个引用参数，只有一个返回引用时，生命周期不需要声明
- 其他情况下需要声明引用的生命周期
- 慎用`'static`

## 高阶函数 函数作为参数与返回值

### Higher-Order Functions

高阶函数（Higher-Order Functions）：Rust允许使用高阶函数，即函数可以作为参数传递给其他函数，或者函数可以返回其他函数。

高阶函数也是函数式编程的重要特性。

#### Higher-Order Functions & Collections

- `map`函数：`map`函数可以用于对一个集合中的每个元素应用一个函数，并返回包含结果的新集合。
- `filter`函数：`filter`函数用于过滤集合中的元素，根据一个谓词函数的返回值。
- `fold`函数：`fold`函数（有时也称为`reduce`）可以用于迭代集合的每个元素，并将它们累积到一个单一的结果中。

例子：

```rust
fn func_twice(f: fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn mul(x: i32) -> i32 {
    x * x
}

fn add(x: i32) -> i32 {
    x + 10
}

fn main() {
    let result = func_twice(mul, 3);
    println!("{result}"); // 81
    let res = func_twice(add, 10);
    println!("{res}"); // 30

    // 数学计算
    let numbers = vec![1, 2, 3, 4, 5, 6, 7];
    let res: Vec<_> = numbers.iter().map(|&x| x + x).collect();
    println!("{:?}", res); // [2, 4, 6, 8, 10, 12, 14]

    // filter
    let numbers = vec![1, 2, 3, 4, 5, 6, 7];
    let evens: Vec<_> = numbers.into_iter().filter(|&x| x % 2 == 0).collect();
    println!("{:?}", evens); // [2, 4, 6]

    // reduce
    let numbers = vec![1, 2, 3, 4, 5, 6, 7];
    let sum = numbers.iter().fold(0, |acc, &x|acc + x);
    println!("Sum: {sum}"); // Sum: 28
}
```

{% /article %}

{% article i18n="en" %}

# Flow Control and Functions

{% /article %}

{% article i18n="es" %}

# Control de flujo y funciones

{% /article %}