{% article i18n="zh-CN" %}

# 动态数组

动态数组类型用 `Vec<T>` 表示。它允许你存储多个值，这些值在内存中一个紧挨着另一个排列，因此访问其中某个元素的成本非常低。动态数组只能存储相同类型的元素，如果你想存储不同类型的元素，可以使用之前讲过的枚举类型或者特征对象。

总之，当我们想拥有一个列表，里面都是相同类型的数据时，动态数组将会非常有用。

## Create a Dynamic Array

在 Rust 中，有多种方式可以创建动态数组。

### `Vec::new`

使用 `Vec::new` 创建动态数组是最 rusty 的方式，它调用了 `Vec` 中的 `new` 关联函数：

```rust
let v: Vec<i32> = Vec::new();
```

这里，`v` 被显式地声明了类型 `Vec<i32>`，这是因为 Rust 编译器无法从` Vec::new()` 中得到任何关于类型的暗示信息，因此也无法推导出 `v` 的具体类型，但是当你向里面增加一个元素后，一切又不同了：

```rust
let mut v = Vec::new();
v.push(1);
```

此时，`v` 就无需手动声明类型，因为编译器通过 `v.push(1)`，推测出 `v` 中的元素类型是 `i32`，因此推导出 `v` 的类型是 `Vec<i32>`。

### Use `vec!` macro

还可以使用宏 `vec!` 来创建数组，与 `Vec::new` 有所不同，前者能在创建同时给予初始化值：

```rust
let v = vec![1, 2, 3];
```

同样，此处的 `v` 也无需标注类型，编译器只需检查它内部的元素即可自动推导出 `v` 的类型是 `Vec<i32>`。

## Update an Dynamic Array

### Push Elements

向数组尾部添加元素，可以使用 `push` 方法：

```rust
let mut v = Vec::new();
v.push(1);
```

与其它类型一样，必须将 `v` 声明为 `mut` 后，才能进行修改。

### Override Elements

```rust
fn main() {
    let mut v = vec![1,2,3];
    v[0] = 2;
    println!("{:?}", v); // [2, 2, 3]
}
```

### Pop out Elements

向动态数组`Fruits`中添加元素，再使用`pop`方法弹出`Fruits`的末尾元素，

```rust
fn main() {
    let mut fruits = Vec::new();
    fruits.push("Apple");
    fruits.push("Orange");
    fruits.push("Banana");
    println!("Fruits: {:?}", fruits); // Fruits: ["Apple", "Orange", "Banana"]

    let removed_fruit = fruits.pop();
    println!("Removed fruit: {:?}", removed_fruit); // Removed fruit: Some("Banana")

    println!("Fruits: {:?}", fruits); // Fruits: ["Apple", "Orange"]
}
```

### Delete Elements

通过索引删除`Vec`中的元素，

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 通过索引删除 Vec 中的元素
	v8.remove(0);
	println!("v8: {:?}", v8);
	// 输出：
	// v8: [1, 2, 3]
}
```

### Clean up Elements

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 清空元素
	v8.claer();
	println!("{:?}", v8);
}
```

## Read a Dynamic Array

### Read Elements from an Array

读取指定位置的元素有两种方式可选：

- 通过下标索引访问。
- 使用 `get` 方法。

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("第三个元素是 {}", third); // 第三个元素是 3

    match v.get(2) {
        Some(third) => println!("第三个元素是 {third}"), // 第三个元素是 3
        None => println!("去你的第三个元素，根本没有！"),
    }
}
```

`&v[2]` 表示借用 `v` 中的第三个元素，最终会获得该元素的引用。而 `v.get(2)` 也是访问第三个元素，但是有所不同的是，它返回了 `Option<&T>`，因此还需要额外的 `match` 来匹配解构出具体的值。

:::warning 关键要点
`.get`方法会增加使用复杂度，这涉及到数组越界访问的问题。

- 如果访问该数组的索引有值，则返回`Some(T)`
- 如果访问该数组的索引无值，则返回`None`

因此`v.get`的使用方式非常安全。而使用索引访问的情况，
```rust
let v = vec![1, 2, 3, 4, 5];
let does_not_exist = &v[100];
```
运行以上代码，`&v[100]` 的访问方式会导致程序无情报错退出，因为发生了数组越界访问。
:::

### Borrow Multiple Elements Simultaneously

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    let first = &v[0];

    v.push(6);

    println!("The first element is: {first}");
}
```

先不运行，来推断下结果，首先 `first = &v[0]` 进行了不可变借用，`v.push` 进行了可变借用，如果 `first` 在 `v.push` 之后不再使用，那么该段代码可以成功编译。因为**不可变引用和可变引用不能同时使用**。编译报错：

```bash
$ cargo run
Compiling collections v0.1.0 (file:///projects/collections)
error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable 无法对v进行可变借用，因此之前已经进行了不可变借用
--> src/main.rs:6:5
|
4 |     let first = &v[0];
|                  - immutable borrow occurs here // 不可变借用发生在此处
5 |
6 |     v.push(6);
|     ^^^^^^^^^ mutable borrow occurs here // 可变借用发生在此处
7 |
8 |     println!("The first element is: {}", first);
|                                          ----- immutable borrow later used here // 不可变借用在这里被使用

For more information about this error, try `rustc --explain E0502`.
error: could not compile `collections` due to previous error
```

按理来说，这两个引用不应该互相影响的：一个是查询元素，一个是在数组尾部插入元素，完全不相干的操作，为何编译器要这么严格呢？

原因在于：数组的大小是可变的，当旧数组的大小不够用时，Rust 会重新分配一块更大的内存空间，然后把旧数组拷贝过来。这种情况下，之前的引用显然会指向一块无效的内存，这非常 rusty —— 对用户进行严格的教育。

## Store Elements in a Dynamic Array

我们可以通过使用特征对象来实现不同类型元素的存储。

```rust
trait IpAddr {
    fn display(&self);
}

struct V4(String);
struct V6(String);

impl IpAddr for V4 {
    fn display(&self) {
        println!("ipv4: {:?}", self.0);
    }
}

impl IpAddr for V6 {
    fn display(&self) {
        println!("ipv6: {:?}", self.0);
    }
}
fn main() {
    let v: Vec<Box<dyn IpAddr>> = vec![
        Box::new(V4("127.0.0.1".to_string())),
        Box::new(V6("::1".to_string())),
    ];
    for ip in v {
        ip.display();
    }
    // ipv4: "127.0.0.1"
    // ipv6: "::1"
}
```

我们为 `V4` 和 `V6` 都实现了特征 `IpAddr`，然后将它俩的实例用 `Box::new` 包裹后，存在了数组 `v` 中，需要注意的是，这里必须手动地指定类型：`Vec<Box<dyn IpAddr>>`，表示数组 `v` 存储的是特征 `IpAddr` 的对象，这样就实现了在数组中存储不同的类型。

## Sort a Dynamic Array

在 rust 里，实现了两种排序算法，分别为稳定的排序 `sort` 和 `sort_by`，以及非稳定排序 `sort_unstable` 和 `sort_unstable_by`。

当然，这个所谓的`非稳定`并不是指排序算法本身不稳定，而是指在排序过程中对相等元素的处理方式。在`稳定`排序算法里，对相等的元素，不会对其进行重新排序。而在`不稳定`的算法里则不保证这点。

总体而言，`非稳定`排序的算法的速度会优于`稳定`排序算法，同时，`稳定`排序还会额外分配原数组一半的空间。

### Sort an Integer Array

以下是对整数列进行排序的例子。

```rust
fn main() {
    let mut vec = vec![1, 5, 10, 2, 15];    
    vec.sort_unstable();    
    assert_eq!(vec, vec![1, 2, 5, 10, 15]);
}
```

### Sort a Struct Array

对结构体是否也可以使用这种自定义对比函数的方式来进行呢？马上来试一下：

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: i32,
}

impl Person {
    fn new(name: String, age: i32) -> Person {
        Person{name, age}
    }
}
fn main() {
    let mut people = vec![
        Person::new("Peter".to_string(), 27),
        Person::new("Alex".to_string(), 26),
        Person::new("Rose".to_string(), 33),
    ];
    // 结构体按年龄倒序
    people.sort_unstable_by(|a, b|b.age.cmp(&a.age));

    println!("people: {:#?}", people);
    // people: [
    //     Person {
    //         name: "Rose",
    //         age: 33,
    //     },
    //     Person {
    //         name: "Peter",
    //         age: 27,
    //     },
    //     Person {
    //         name: "Alex",
    //         age: 26,
    //     },
    // ]
}
```

从上面我们学习过程当中，排序需要我们实现 `Ord` 特性，那么如果我们把我们的结构体实现了该特性，是否就不需要我们自定义对比函数了呢？

是，但不完全是，实现 `Ord` 需要我们实现 `Ord`、`Eq`、`PartialEq`、`PartialOrd` 这些属性。好消息是，你可以 `derive` 这些属性：

```rust
#[derive(Debug, Ord, Eq, PartialEq, PartialOrd)]
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
}

fn main() {
    let mut people = vec![
        Person::new("Zoe".to_string(), 25),
        Person::new("Al".to_string(), 60),
        Person::new("Al".to_string(), 30),
        Person::new("John".to_string(), 1),
        Person::new("John".to_string(), 25),
    ];

    people.sort_unstable();

    println!("{:?}", people);
}
```

需要 `derive Ord` 相关特性，需要确保你的结构体中所有的属性均实现了 `Ord` 相关特性，否则会发生编译错误。`derive` 的默认实现会依据属性的顺序依次进行比较，如上述例子中，当 `Person` 的 `name` 值相同，则会使用 `age` 进行比较。

{% /article %}

{% article i18n="en" %}

# Dynamic Array

{% /article %}

{% article i18n="es" %}

# Matriz dinámica

{% /article %}