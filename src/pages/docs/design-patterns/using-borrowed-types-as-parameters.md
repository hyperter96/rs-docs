{% article i18n="zh-CN" %}

# 使用借用类型作为参数

> Rust设计模式，惯用做法一：编码时应该总是倾向于使用借用类型，而不是借用所有类型。

例如：

- 对于`String`类型来说，应该倾向于使用`&str`，而不是`&String`；
- 对于`T`类型来说，应该倾向于使用`&[T]`而不是`&Vec[T]`; 应该倾向于使用`&T`，而不是`&Box<T>`。

## Why

也许我们可以在《Rust设计模式》这本书中找到答案，其中提到：**使用借用类型可以避免已经提供一层间接性的所有类型的多层间接**，以下代码：

```rust
let a: String = "content".to_string();
let b: &String = &a;
let c: &str = a.as_str();
```

内存分配如下图：

![Alt](../../images/borrowed-types-as-parameters.png)

结合上面的图，我们可以理解：

- `String`类型具有一层间接，因为`String`类型的本质是一个具有三个字段的胖指针（三个字段分别是`ptr`、`cap`、`len`，`ptr`指向在堆上的具体内容）
- `&String`具有两层引用，是因为是`String`的基础上，加了`&`，所以`b`实际指向的是`a`，而不是堆上的内容
- `&str`类型也是一个胖指针，直接指向堆上的内容

所以对比`&String`和`&str`，显然使用`&str`的效果更高。从这个层面上说，这条规则本质是想倾向于使用间接层面更少的方式。

我们再考虑下面的例子：

```rust
fn print_use_string(word: String) {
    println!("{:?}", word);
}

fn print_use_string1(word: &String) {
    println!("{:?}", word);
}

fn print_use_str(word: &str) {
    println!("{:?}", word);
}

fn main() {
    let a = "content".to_string();
    print_use_string(a);
    // 所有权已经发生转移

    let b = "content".to_string();
    print_use_string1(&b);
    println!("b: {:?}", b);

    let c = "content".to_string();
    print_use_str(&c);
    println!("c: {:?}", c);
    print_use_str("content");
}
```

上面这个例子中，`print_use_string`和`print_use_str`功能一样，所以传引用即可，而传`&str`比传`&String`效率更高。

{% /article %}

{% article i18n="en" %}

# Using Borrowed Types as Parameters

{% /article %}

{% article i18n="es" %}

# Usar tipos prestados como parámetros

{% /article %}