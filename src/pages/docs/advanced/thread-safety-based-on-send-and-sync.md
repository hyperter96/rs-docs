{% article i18n="zh-CN" %}

# 基于Send和Sync的线程安全

为何 `Rc`、`RefCell` 和裸指针不可以在多线程间使用？如何让裸指针可以在多线程使用？我们一起来探寻下这些问题的答案。

## `Send` & `Sync`

`Send`和`Sync`是 Rust 安全并发的重中之重，但是实际上它们只是标记特征(*marker trait*，该特征未定义任何行为，因此非常适合用于标记), 来看看它们的作用：

- 实现`Send`的类型可以在线程间安全的传递其所有权
- 实现`Sync`的类型可以在线程间安全的共享(通过引用)

这里还有一个潜在的依赖：一个类型要在线程间安全的共享的前提是，指向它的引用必须能在线程间传递。因为如果引用都不能被传递，我们就无法在多个线程间使用引用去访问同一个数据了。

由上可知，若类型 `T` 的引用`&T`是`Send`，则`T`是`Sync`。

### Implement the Type for `Send` & `Sync`

几乎所有类型都默认实现了`Send`和`Sync`，而且由于这两个特征都是可自动派生的特征(通过`derive`派生)，意味着一个复合类型(例如结构体), 只要它内部的所有成员都实现了`Send`或者`Sync`，那么它就自动实现了`Send`或`Sync`。

正是因为以上规则，Rust 中绝大多数类型都实现了`Send`和`Sync`，除了以下几个(事实上不止这几个，只不过它们比较常见):

- 裸指针两者都没实现，因为它本身就没有任何安全保证
- `UnsafeCell`不是`Sync`，因此`Cell`和`RefCell`也不是
- `Rc`两者都没实现(因为内部的引用计数器不是线程安全的)

当然，如果是自定义的复合类型，那没实现那哥俩的就较为常见了：只要复合类型中有一个成员不是`Send`或`Sync`，那么该复合类型也就不是`Send`或`Sync`。

手动实现 `Send` 和 `Sync` 是不安全的，通常并不需要手动实现 `Send` 和 `Sync trait`，实现者需要使用`unsafe`小心维护并发安全保证。

### Implementing `Send` for Raw Pointers

上面我们提到裸指针既没实现Send，意味着下面代码会报错:

```rust
use std::thread;
fn main() {
    let p = 5 as *mut u8;
    let t = thread::spawn(move || {
        println!("{:?}",p);
    });

    t.join().unwrap();
}
```
报错跟之前无二： `*mut u8` cannot be sent between threads safely, 但是有一个问题，我们无法为其直接实现`Send`特征，好在可以用`newtype`类型 :`struct MyBox(*mut u8);`。

还记得之前的规则吗：复合类型中有一个成员没实现`Send`，该复合类型就不是`Send`，因此我们需要手动为它实现:

```rust
use std::thread;

#[derive(Debug)]
struct MyBox(*mut u8);
unsafe impl Send for MyBox {}
fn main() {
    let p = MyBox(5 as *mut u8);
    let t = thread::spawn(move || {
        println!("{:?}",p);
    });

    t.join().unwrap();
}
```
此时，我们的指针已经可以欢快的在多线程间撒欢，以上代码很简单，但有一点需要注意：`Send`和`Sync`是`unsafe`特征，实现时需要用`unsafe`代码块包裹。

### Implementing `Sync` for Raw Pointers

由于`Sync`是多线程间共享一个值，大家可能会想这么实现：

```rust
use std::thread;
fn main() {
    let v = 5;
    let t = thread::spawn(|| {
        println!("{:?}",&v);
    });

    t.join().unwrap();
}
```
关于这种用法，在多线程章节也提到过，线程如果直接去借用其它线程的变量，会报错:`closure may outlive the current function,`, 原因在于编译器无法确定主线程`main`和子线程t谁的生命周期更长，特别是当两个线程都是子线程时，没有任何人知道哪个子线程会先结束，包括编译器！

因此我们得配合`Arc`去使用:

```rust
use std::thread;
use std::sync::Arc;
use std::sync::Mutex;

#[derive(Debug)]
struct MyBox(*const u8);
unsafe impl Send for MyBox {}

fn main() {
    let b = &MyBox(5 as *const u8);
    let v = Arc::new(Mutex::new(b));
    let t = thread::spawn(move || {
        let _v1 =  v.lock().unwrap();
    });

    t.join().unwrap();
}
```
上面代码将智能指针`v`的所有权转移给新线程，同时`v`包含了一个引用类型b，当在新的线程中试图获取内部的引用时，会报错：

```text
error[E0277]: `*const u8` cannot be shared between threads safely
--> src/main.rs:25:13
|
25  |     let t = thread::spawn(move || {
|             ^^^^^^^^^^^^^ `*const u8` cannot be shared between threads safely
|
= help: within `MyBox`, the trait `Sync` is not implemented for `*const u8`
```

因为我们访问的引用实际上还是对主线程中的数据的借用，转移进来的仅仅是外层的智能指针引用。要解决很简单，为`MyBox`实现`Sync`:
```rust
unsafe impl Sync for MyBox {}
```

### Summary

通过上面的两个裸指针的例子，我们了解了如何实现`Send`和`Sync`，以及如何只实现`Send`而不实现`Sync`，简单总结下：

1. 实现`Send`的类型可以在线程间安全的传递其所有权, 实现`Sync`的类型可以在线程间安全的共享(通过引用)
2. 绝大部分类型都实现了`Send`和`Sync`，常见的未实现的有：裸指针、`Cell`、`RefCell`、`Rc` 等
3. 可以为自定义类型实现`Send`和`Sync`，但是需要`unsafe`代码块
4. 可以为部分 Rust 中的类型实现`Send`、`Sync`，但是需要使用`newtype`，例如文中的裸指针例子

{% /article %}

{% article i18n="en" %}

# Thread Safefy based on `Send` & `Sync`

{% /article %}

{% article i18n="es" %}

# Seguridad de subprocesos basada en envío y sincronización

{% /article %}