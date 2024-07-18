{% article i18n="zh-CN" %}

# 智能指针

## Overview of Smart Pointers

指针是一个包含内存地址的变量。这个地址指向一些其他的数据。

### What is Smart Pointer

智能指针：

- 智能指针是一类数据结构，它们表现类似于指针，但是也拥有额外的元数据，最明显的，它们拥有一个引用计数。引用计数记录智能指针总共有多少个所有者，并且当没有任何所有者时清楚数据。
- 智能指针通常使用结构体实现。智能指针区别于常规结构体的显著特征在于其实现了`Deref`和`Drop trait`。
    - `Deref trait`允许智能指针结构体实例表现的像引用一样，这样就可以编写即用于引用，又用于智能指针的代码
    - `Drop trait`允许我们自定义当智能指针离开作用域时执行的代码

普通引用和智能指针的一个额外区别是：引用只是借用数据的指针，而智能指针则是拥有它们指向的数据。

### Smart Pointers in Several `std`

- Box是最简单的智能指针，只是用于Heap堆上分配
- Rc指针是为了完成share ownership的功能，是智能指针的核心，其数据可以有多个所有者
    - Weak指针弱引用
    - Arc是多线程的Rc
    - Mutex是提供了可变性
- Rust提供了`Cell`和`RefCell`用于内部可变性

{% callout type="note" title="提示" %}
尽量不要使用`RefCell`。
{% /callout %}

## `Box` Pointer

### Applicable Scenario for `Box` Pointer

box适用于以下场景：
- 当有一个在编译时未知大小的类型，而又需要再确切大小的上下文中使用这个类型值的时候（譬如，再一个`List`环境下，存放数据，但是每个元素的大小在编译时又不确定）
- 当有大量数据并希望在确保数据不被拷贝的情况下转移所有权的时候
- 当希望拥有一个值并关心它的类型是否实现了特定trait而不是其具体类型时

第一种场景下，假如我们现在有这样一个`List`枚举，

```rust
enum List {
    Cons(i32, List),
    Nil,
}
```

当编译器编译的时候因为`List`枚举存在递归，并不知道`List`枚举应该分配多大的内存，这时候采用`Box`的话，指针是有内存固定大小的。这样编译的话会通过，

```rust
use crate::List::{Cons, Nil};

#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

trait Animal {
    fn eat(&self);
}

#[derive(Debug)]
struct Cat {
    children: Option<Box<Cat>>,
}

impl Animal for Cat {
    fn eat(&self) {
        println!("cat is eating");
    }
}
fn main() {
    let b = Box::new(5); // b存储在栈上，5存储在堆上，b指向5所在的内存
    println!("b = {}", b);
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list); // Cons(1, Cons(2, Cons(3, Nil)))

    let cat = Box::new(Cat{ children: None });
    println!("{:?}", cat); // Cat { children: None }
    let t: Box<dyn Animal>;
    t = Box::new(Cat {
        children: Some(cat),
    });
    t.eat(); // cat is eating
}
```

## Dereference

实现解引用和自定义`MyBox`,

```rust
use std::ops::Deref;
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let x = 5;
    let y = &x;
    assert_eq!(5, x);
    assert_eq!(5, *y); // 解引用

    let z = Box::new(x);
    assert_eq!(5, *z);

    // 需要实现Deref特质
    let a = MyBox::new(x);
    assert_eq!(5, *a);

    let m = MyBox::new(String::from("Rust"));
    hello(&m); // 解引用的强制多态：将MyBox变为&String, 再将String解引用，变为&str, 
    println!("hello world");
}

fn hello(s: &str) {
    println!("hello {s}");
}
```

解引用多态与可变性交互：

- 当`T: Deref<Target=U>`时，从`&T`到`&U`
- 当`T: DerefMut<Target=U>`时，从`&mut T`到`&mut U`
- 当`T: Deref<Target=U>`时，从`&mut T`到`&U`

## Native Pointer

- 声明需要`as`来标注类型以及可变或者不可变
- 解引用则需要`unsafe`

```rust
fn main() {
    // 指针不可变
    let x: usize = 1;
    let raw_ptr = &x as *const usize;

    // 指针可变
    let mut y: usize = 2;
    let raw_mut_ptr = &mut y as *mut usize;

    let some_usize = unsafe {
        *raw_ptr
    };
    println!("some usize: {some_usize}"); // some usize: 1

    let some_mut_usize = unsafe {
        *raw_mut_ptr
    };
    println!("some mut usize: {some_mut_usize}"); // some mut usize: 2
}
```

## Rc Pointer

Rc指针式存储`ref count`的胖指针。

- Rc指针的追踪的两个方向
    - 对单个值的多个引用
    - 何时销毁该变量
- `Rc::clone`会创建一个新的reference，计数加一
- 相对于Arc，Rc指针只能运行于单线程
- Rc相对于Weak，Rc是Strong

先看如下：

```rust
use crate::List::{Cons, Nil};
enum List {
    Cons(i32, Box<List>),
    Nil,
}
fn main() {
    let a = Cons(5, Box::new(Cons(10, Box::new(Nil))));
    let b = Cons(3, Box::new(a));
    let c = Cons(4, Box::new(a));
}
```

出现如下报错：

```text
 --> src/main.rs:9:30
  |
7 |     let a = Cons(5, Box::new(Cons(10, Box::new(Nil))));
  |         - move occurs because `a` has type `List`, which does not implement the `Copy` trait
8 |     let b = Cons(3, Box::new(a));
  |                              - value moved here
9 |     let c = Cons(4, Box::new(a));
  |                              ^ value used here after move
```

这时`b`已经拿到`a`的所有权，`c`不能再使用`a`了，这种情况下使用Rc指针把`a`各克隆一份给`b`和`c`，写法如下

```rust
use crate::List::{Cons, Nil};
use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a));
    let c = Cons(4, Rc::clone(&a));
    let d = Cons(6, a.clone()); // 另一种写法
    let e = Cons(7, a.clone());
}
```

现在我们给`a`做引用计数，

```rust
use crate::List::{Cons, Nil};
use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}
fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("count after creating a: {}", Rc::strong_count(&a)); // count after creating a: 1
    let b = Cons(3, Rc::clone(&a));
    println!("count after binding to b, a count: {}", Rc::strong_count(&a)); // count after binding to b, a count: 2
    {
        let c = Cons(4, Rc::clone(&a));
        println!("count after binding to c, a count: {}", Rc::strong_count(&a)); // count after binding to c, a count: 3
    }
    println!("count at end a: {}", Rc::strong_count(&a)); // count at end a: 2 由于c离开作用域
    let d = Cons(6, a.clone()); // 另一种写法
    let e = Cons(7, a.clone());
}
```

## `Cell` & `RefCell`

Rust提供了`Cell`和`RefCell`用于内部可变性，带来了灵活性，同样也带来了一些安全的隐患。

`RefCell`：

1. 内部可变性：允许在使用不可变引用时改变数据。
2. 通过`RefCell<T>`在运行时检查借用规则（通常情况下，是在编译时检查借用规则），`RefCell<T>`代表其数据的**唯一**所有权。
3. 类似于`Rc<T>`，`RefCell<T>`只能用于**单线程场景**。

### Reason for Choosing `Box<T>`, `Rc<T>` or `RefCell<T>`

- `Rc<T>`允许相同数据有多个所有者（数据只读共享），`Box<T>`和`RefCell<T>`有单一所有者。
- `Box<T>`允许在**编译时**执行**不可变或可变借用**检查；`Rc<T>`仅允许在**编译时**执行**不可变借用**检查；`RefCell<T>`允许在**运行时**执行**不可变或可变借用**检查。
    
    因为`RefCell<T>`允许在运行时执行可变借用检查，所以我们可以在即使`RefCell<T>`自身是不可变的情况下修改其内部的值。

### Difference between `Cell` & `RefCell`

- `Cell`只适用于`Copy`类型，用于提供值，而`RefCell`用于提供引用
- `Cell`不会`panic`，而`RefCell`会

```rust
use crate::List::{Cons, Nil};
use std::rc::Rc;
use std::cell::{Cell, RefCell};

#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}
fn main() {
    let val = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&val), Rc::new(Nil)));
    let b = Cons(Rc::new(RefCell::new(6)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(7)), Rc::clone(&a));

    println!("a before {:?}", a); // a before Cons(RefCell { value: 5 }, Nil)
    println!("b before {:?}", b); // b before Cons(RefCell { value: 6 }, Cons(RefCell { value: 5 }, Nil))
    println!("c before {:?}", c); // c before Cons(RefCell { value: 7 }, Cons(RefCell { value: 5 }, Nil))

    *val.borrow_mut() += 10; // 修改内部的RefCell，Rc是只读的不可变引用，只提供数据共享
    println!("a after {:?}", a); // a after Cons(RefCell { value: 15 }, Nil)
    println!("b after {:?}", b); // b after Cons(RefCell { value: 6 }, Cons(RefCell { value: 15 }, Nil))
    println!("c after {:?}", c); // c after Cons(RefCell { value: 7 }, Cons(RefCell { value: 15 }, Nil))

    // &str是copy, String不copy
    let c = Cell::new("yzzy");
    let c1 = c.get();
    println!("{c1}"); // yzzy

    c.set("原子");
    let c2 = c.get();
    println!("{c1}"); // yzzy
    println!("{c2}"); // 原子
}
```

## Circular Reference & Self-reference

### Circular

Rust 的安全性是众所周知的，但是不代表它不会内存泄漏。一个典型的例子就是同时使用 `Rc<T>` 和 `RefCell<T>` 创建循环引用，最终这些引用的计数都无法被归零，因此 `Rc<T>` 拥有的值也不会被释放清理。

```rust
use std::rc::Rc;
use std::cell::RefCell;
use crate::List::{Cons, Nil};

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}
```

这里我们创建一个有些复杂的枚举类型 `List`，这个类型很有意思，它的每个值都指向了另一个 `List`，此外，得益于 Rc 的使用还允许多个值指向一个 `List`：

![](https://pica.zhimg.com/80/v2-0db007dfb4167ebc22f50cf5b5a85f53_1440w.png)

如上图所示，每个矩形框节点都是一个 `List` 类型，它们或者是拥有值且指向另一个 `List` 的`Cons`，或者是一个没有值的终结点 `Nil`。同时，由于 `RefCell` 的使用，每个 `List` 所指向的 `List` 还能够被修改。

下面来使用一下这个复杂的 `List` 枚举：

```rust
fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    println!("1 a rc count: {}", Rc::strong_count(&a)); // 1 a rc count: 1
    println!("1 a tail: {:?}", a.tail()); // 1 a tail: Some(RefCell { value: Nil })

    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    println!("2 a rc count: {}", Rc::strong_count(&a)); // 2 a rc count: 2
    println!("2 b rc count: {}", Rc::strong_count(&b)); // 2 b rc count: 1
    println!("2 a tail: {:?}", b.tail()); // 2 a tail: Some(RefCell { value: Cons(5, RefCell { value: Nil }) })
    
    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("3 a rc count: {}", Rc::strong_count(&a)); // 3 a rc count: 2
    println!("3 b rc count: {}", Rc::strong_count(&b)); // 3 b rc count: 2
}
```

`a`和`b`的关系变的如下图所示：

![](https://rust.hyperter.top/screenshot/ref-loop.png)

但是假如我们添加如下作用域，

```rust
fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    println!("1 a rc count: {}", Rc::strong_count(&a)); // 1 a rc count: 1
    println!("1 a tail: {:?}", a.tail()); // 1 a tail: Some(RefCell { value: Nil })

    {
        let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
        println!("2 a rc count: {}", Rc::strong_count(&a)); // 2 a rc count: 2
        println!("2 b rc count: {}", Rc::strong_count(&b)); // 2 b rc count: 1
        println!("2 a tail: {:?}", b.tail()); // 2 a tail: Some(RefCell { value: Cons(5, RefCell { value: Nil }) })
        
        if let Some(link) = a.tail() {
            *link.borrow_mut() = Rc::clone(&b);
        }

        println!("3 a rc count: {}", Rc::strong_count(&a)); // 3 a rc count: 2
        println!("3 b rc count: {}", Rc::strong_count(&b)); // 3 b rc count: 2
    }
    // ... 关于a的代码
}
```

`b`在离开作用域以后被销毁，而`a`引用`b`，因此`b`的引用计数不会变成0，而是变成1。但是这种情况会出现两个问题：

- 造成`b`的内存泄露，因为在`b`离开作用域以外的代码，`b`被分配在Rc的堆上内存不会被丢弃
- 打印`a.tail()`会出现死循环

创建循环引用并不简单，但是也并不是完全遇不到，当你使用 `RefCell<Rc<T>>` 或者类似的类型嵌套组合（具备内部可变性和引用计数）时，就要打起万分精神，前面可能是深渊！

那么问题来了？ 如果我们确实需要实现上面的功能，该怎么办？答案是使用 `Weak`。

### Weak

弱引用`Weak<T>`：

- 弱引用通过`Rc::downgrade`传递Rc实例的引用，调用`Rc::downgrade`会得到`Weak<T>`类型的智能指针，同时将`weak_count`加1（不是`strong_count`加1）
- 区别在于`weak_count`无需计数为0就能使Rc实例被清理。只要`strong_count`为0就可以了
- 可以通过`Rc::upgrade`方法返回`Option<Rc<T>>`对象

Weak 非常类似于 Rc，但是与 Rc 持有所有权不同，Weak 不持有所有权，它仅仅保存一份指向数据的弱引用：如果你想要访问数据，需要通过 Weak 指针的 `upgrade` 方法实现，该方法返回一个类型为 `Option<Rc<T>>` 的值。

看到这个返回，相信大家就懂了：何为弱引用？就是不保证引用关系依然存在，如果不存在，就返回一个 `None`！

因为 Weak 引用不计入所有权，因此它无法阻止所引用的内存值被释放掉，而且 Weak 本身不对值的存在性做任何担保，引用的值还存在就返回 `Some`，不存在就返回 `None`。

#### Comparision Weak between Rc

我们来将 Weak 与 Rc 进行以下简单对比：

| Weak | Rc |
|------------------|---------------|
| 不计数 | 引用计数|
|不拥有所有权|拥有值的所有权|
|不阻止值被释放|所有权计数归零，才能`drop`|
|引用的值存在返回`Some`，不存在返回`None`|引用的值必定存在|
|通过`upgrade`取到`Option<Rc<T>>`，然后再取值|通过`Deref`自动解引用，取值无需任何操作|

通过这个对比，可以非常清晰的看出 Weak 为何这么弱，而这种弱恰恰非常适合我们实现以下的场景：

- 持有一个 Rc 对象的临时引用，并且不在乎引用的值是否依然存在
- 阻止 Rc 导致的循环引用，因为 Rc 的所有权机制，会导致多个 Rc 都无法计数归零

使用方式简单总结下：对于父子引用关系，可以让父节点通过 Rc 来引用子节点，然后让子节点通过 Weak 来引用父节点。

#### Summary for Weak

因为 Weak 本身并不是很好理解，因此我们再来帮大家梳理总结下，然后再通过一个例子，来彻底掌握。

Weak 通过 `use std::rc::Weak` 来引入，它具有以下特点:

- 可访问，但没有所有权，不增加引用计数，因此不会影响被引用值的释放回收
- 可由 `Rc<T>` 调用 `downgrade` 方法转换成 `Weak<T>`
- `Weak<T>` 可使用 `upgrade` 方法转换成 `Option<Rc<T>>`，如果资源已经被释放，则 `Option` 的值是 `None`
- 常用于解决循环引用的问题

我们还是举`List`的例子：

```rust
use std::{cell::RefCell, rc::{Rc, Weak}};
use crate::List::{Cons, Nil};

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Weak<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Weak<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}
```
`RefCell`中的`List`变为`Weak`，

```rust
fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Weak::new())));
    println!("1, a strong count: {}, weak count: {}", Rc::strong_count(&a), Rc::weak_count(&a)); // 1, a strong count: 1, weak count: 0
    println!("1, a tail: {:?}", a.tail()); // 1, a tail: Some(RefCell { value: (Weak) })

    let b = Rc::new(Cons(10, RefCell::new(Weak::new())));
    if let Some(link) = b.tail() {
        *link.borrow_mut() = Rc::downgrade(&a);
    }

    println!("2, a strong count: {}, weak count: {}", Rc::strong_count(&a), Rc::weak_count(&a)); // 2, a strong count: 1, weak count: 1
    println!("2, b strong count: {}, weak count: {}", Rc::strong_count(&b), Rc::weak_count(&b)); // 2, b strong count: 1, weak count: 0
    println!("2, b tail: {:?}", b.tail()); // 2, b tail: Some(RefCell { value: (Weak) })

    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::downgrade(&b);
    }

    println!("3, a strong count: {}, weak count: {}", Rc::strong_count(&a), Rc::weak_count(&a)); // 3, a strong count: 1, weak count: 1
    println!("3, b strong count: {}, weak count: {}", Rc::strong_count(&b), Rc::weak_count(&b)); // 3, b strong count: 1, weak count: 1
    println!("3, a tail: {:?}", a.tail()); // 3, a tail: Some(RefCell { value: (Weak) })
}
```

一开始，`a`的`weak_count`为0，因为没有被引用，当`b`的尾端指向`a`以后，`a`的`weak_count`变为1。同理，当`a`的尾端指向`b`后，`b`的`weak_count`变为1。我们这时再打印`a.tail()`，发现并不会出现死循环，因为它不在乎引用的值是否依然存在。

## Data Structure: Tree

我们先定义`Node`的结构体，

```rust
use std::{cell::RefCell, rc::{Rc, Weak}};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    child: RefCell<Vec<Rc<Node>>>,
}
```
然后分别创建`leaf`子节点和`branch`作为父节点，

```rust
fn main() {
    let leaf = Rc::new(Node{
        value: 3,
        parent: RefCell::new(Weak::new()),
        child: RefCell::new(vec![]),
    });
    println!("1 leaf strong: {}, weak: {}", Rc::strong_count(&leaf), Rc::weak_count(&leaf)); // 1 leaf strong: 1, weak: 0
    println!("leaf parent: {:?}", leaf.parent.borrow().upgrade()); // leaf parent: None

    let branch = Rc::new( Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        child: RefCell::new(vec![Rc::clone(&leaf)]), // branch作为父节点拥有leaf作为子节点
    });
    println!("1 branch strong: {}, weak: {}", Rc::strong_count(&branch), Rc::weak_count(&branch)); // 1 branch strong: 1, weak: 0
    println!("2 leaf strong: {}, weak: {}", Rc::strong_count(&leaf), Rc::weak_count(&leaf)); // 2 leaf strong: 2, weak: 0

    *leaf.parent.borrow_mut() = Rc::downgrade(&branch); // leaf节点的parent指向branch父节点
    println!("2 branch strong: {}, weak: {}", Rc::strong_count(&branch), Rc::weak_count(&branch)); // 2 branch strong: 1, weak: 1
    println!("leaf parent: {:#?}", leaf.parent.borrow().upgrade()); 
    // leaf parent: Some(
    //     Node {
    //         value: 5,
    //         parent: RefCell {
    //             value: (Weak),
    //         },
    //         child: RefCell {
    //             value: [
    //                 Node {
    //                     value: 3,
    //                     parent: RefCell {
    //                         value: (Weak),
    //                     },
    //                     child: RefCell {
    //                         value: [],
    //                     },
    //                 },
    //             ],
    //         },
    //     },
    // )
}
```

## Arc Pointer

- Rc并不支持`Send trait`和`Sync trait`，会产生数据竞争
- Arc实现了原子操作，是线程安全的
- Arc是有性能损耗的

Arc来自于`std::sync::Arc`，同样也有`sync`版本的Weak。

```rust
use std::{sync::{Arc, Weak}, thread};

#[derive(Debug)]
struct Owner {
    name: String,
    dogs: Vec<Weak<Dog>>,
}

#[derive(Debug)]
struct Dog {
    owner: Arc<Owner>,
}

fn main() {
    let someone = Arc::new(Owner {
        name: "tom".to_string(),
        dogs: vec![],
    });

    for i in 0..10 {
        let someone = Arc::clone(&someone);
        let join_handle = thread::spawn(move || {
            let yellow_dog = Arc::new(Dog {
                owner: Arc::clone(&someone),
            });
            let black_dog = Arc::new(Dog {
                owner: Arc::clone(&someone),
            });
            println!("yellow dog owner: {}", yellow_dog.owner.name);
            println!("black dog owner: {}", black_dog.owner.name);
            println!("thread {i} end");
        });
        _ = join_handle.join();
    }
}
```

{% /article %}

{% article i18n="en" %}

# Smart Pointer

{% /article %}

{% article i18n="es" %}

# # Puntero inteligente

{% /article %}