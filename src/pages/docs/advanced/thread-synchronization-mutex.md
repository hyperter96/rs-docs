{% article i18n="zh-CN" %}

# 线程同步与互斥锁

在多线程编程中，同步性极其的重要，当你需要同时访问一个资源、控制不同线程的执行次序时，都需要使用到同步性。

在 Rust 中有多种方式可以实现同步性。在上一节中讲到的消息传递就是同步性的一种实现方式，例如我们可以通过消息传递来控制不同线程间的执行次序。还可以使用共享内存来实现同步性，例如通过锁和原子操作等并发原语来实现多个线程同时且安全地去访问一个资源。

## `Mutex`
既然是共享内存，那并发原语自然是重中之重，先来一起看看皇冠上的明珠: 互斥锁`Mutex`(*mutual exclusion* 的缩写)。

`Mutex`让多个线程并发的访问同一个值变成了排队访问：同一时间，只允许一个线程`A`访问该值，其它线程需要等待`A`访问完成后才能继续。

### Single Thread: `Mutex`

先来看看单线程中`Mutex`该如何使用:

```rust
use std::sync::Mutex;

fn main() {
    // 使用`Mutex`结构体的关联函数创建新的互斥锁实例
    let m = Mutex::new(5);

    {
        // 获取锁，然后deref为`m`的引用
        // lock返回的是Result
        let mut num = m.lock().unwrap();
        *num = 6;
        // 离开作用域时锁自动被释放drop
    }

    println!("m = {:?}", m);
}
```

和`Box`类似，数据被`Mutex`所拥有，要访问内部的数据，需要使用方法`m.lock()`向`m`申请一个锁, 该方法会阻塞当前线程，直到获取到锁，因此当多个线程同时访问该数据时，只有一个线程能获取到锁，其它线程只能阻塞着等待，这样就保证了数据能被安全的修改！

`m.lock()`方法也有可能报错，例如当前正在持有锁的线程`panic`了。在这种情况下，其它线程不可能再获得锁，因此`lock`方法会返回一个错误。

这里你可能奇怪，`m.lock`明明返回一个锁，怎么就变成我们的`num`数值了？聪明的读者可能会想到智能指针，没错，因为`Mutex<T>`是一个智能指针，准确的说是`m.lock()`返回一个智能指针`MutexGuard<T>`:

- 它实现了`Deref`特征，会被自动解引用后获得一个引用类型，该引用指向`Mutex`内部的数据
- 它还实现了`Drop`特征，在超出作用域后，自动释放锁，以便其它线程能继续获取锁

正因为智能指针的使用，使得我们无需任何操作就能获取其中的数据。 如果释放锁，你需要做的仅仅是做好锁的作用域管理，例如上述代码的内部花括号使用，建议读者尝试下去掉内部的花括号，然后再次尝试获取第二个锁`num1`，看看会发生什么，友情提示：不会报错，但是主线程会永远阻塞，因为不幸发生了死锁。

### Multithreading: `Mutex`

现在，我们再来看看，如何在多线程下使用`Mutex`来访问同一个资源.

#### Non-operational `Rc<T>`

```rust
use std::rc::Rc;
use std::sync::Mutex;
use std::thread;

fn main() {
    // 通过`Rc`实现`Mutex`的多所有权
    let counter = Rc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Rc::clone(&counter);
        // 创建子线程，并将`Mutex`的所有权拷贝传入到子线程中
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    // 等待所有子线程完成
    for handle in handles {
        handle.join().unwrap();
    }

    // 输出最终的计数结果
    println!("Result: {}", *counter.lock().unwrap());
}
```

由于子线程需要通过`move`拿走锁的所有权，因此我们需要使用多所有权来保证每个线程都拿到数据的独立所有权，恰好智能指针`Rc<T>`可以做到(上面代码会报错！具体往下看，别跳过-, -)。

以上代码实现了在多线程中计数的功能，由于多个线程都需要去修改该计数器，因此我们需要使用锁来保证同一时间只有一个线程可以修改计数器，否则会导致脏数据：想象一下 `A` 线程和 `B` 线程同时拿到计数器，获取了当前值`1`, 并且同时对其进行了修改，最后值变成`2`，你会不会在风中凌乱？毕竟正确的值是`3`，因为两个线程各自加 `1`。

事实上，上面的代码会报错:

```text
error[E0277]: `Rc<Mutex<i32>>` cannot be sent between threads safely
                // `Rc`无法在线程中安全的传输
   --> src/main.rs:11:22
    |
13  |           let handle = thread::spawn(move || {
    |  ______________________^^^^^^^^^^^^^_-
    | |                      |
    | |                      `Rc<Mutex<i32>>` cannot be sent between threads safely
14  | |             let mut num = counter.lock().unwrap();
15  | |
16  | |             *num += 1;
17  | |         });
    | |_________- within this `[closure@src/main.rs:11:36: 15:10]`
    |
    = help: within `[closure@src/main.rs:11:36: 15:10]`, the trait `Send` is not implemented for `Rc<Mutex<i32>>`
     // `Rc`没有实现`Send`特征
    = note: required because it appears within the type `[closure@src/main.rs:11:36: 15:10]`

```

错误中提到了一个关键点：`Rc<T>`无法在线程中传输，因为它没有实现`Send`特征，而该特征可以确保数据在线程中安全的传输。

#### Multithreading Safety: `Arc<T>`

好在，我们有`Arc<T>`，得益于它的内部计数器是多线程安全的，因此可以在多线程环境中使用:

```rust
use std::{sync::{Arc, Mutex}, thread};

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);

        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // Result: 10
}
```

#### Interior Mutability

在之前章节，我们提到过内部可变性，其中`Rc<T>`和`RefCell<T>`的结合，可以实现单线程的内部可变性。

现在我们又有了新的武器，由于`Mutex<T>`可以支持修改内部数据，当结合`Arc<T>`一起使用时，可以实现多线程的内部可变性。

简单总结下：`Rc<T>`/`RefCell<T>`用于单线程内部可变性， `Arc<T>`/`Mutex<T>`用于多线程内部可变性。

{% callout type="note" title="关键要点" %}
1. `Mutex`提供内部可变性，类似于`RefCell`
2. `RefCell<T>/Rc<T>`是非线程安全的，`Mutex<T>/Arc<T>`是线程安全的
{% /callout %}

### Deadlock

#### Single Thread with Deadlock

这种死锁比较容易规避，但是当代码复杂后还是有可能遇到：

```rust
use std::sync::Mutex;

fn main() {
    let data = Mutex::new(0);
    let d1 = data.lock();
    let d2 = data.lock();
} // d1锁在此处释放
```
只要你在另一个锁还未被释放时去申请新的锁，就会触发。

#### Multithreading with Deadlock

当我们拥有两个锁，且两个线程各自使用了其中一个锁，然后试图去访问另一个锁时，就可能发生死锁：

```rust
use std::{sync::{Mutex, MutexGuard}, thread};
use std::thread::sleep;
use std::time::Duration;

use lazy_static::lazy_static;
lazy_static! {
    static ref MUTEX1: Mutex<i64> = Mutex::new(0);
    static ref MUTEX2: Mutex<i64> = Mutex::new(0);
}

fn main() {
    // 存放子线程的句柄
    let mut children = vec![];
    for i_thread in 0..2 {
        children.push(thread::spawn(move || {
            for _ in 0..1 {
                // 线程1
                if i_thread % 2 == 0 {
                    // 锁住MUTEX1
                    let guard: MutexGuard<i64> = MUTEX1.lock().unwrap();

                    println!("线程 {} 锁住了MUTEX1，接着准备去锁MUTEX2 !", i_thread);

                    // 当前线程睡眠一小会儿，等待线程2锁住MUTEX2
                    sleep(Duration::from_millis(10));

                    // 去锁MUTEX2
                    let guard = MUTEX2.lock().unwrap();
                // 线程2
                } else {
                    // 锁住MUTEX2
                    let _guard = MUTEX2.lock().unwrap();

                    println!("线程 {} 锁住了MUTEX2, 准备去锁MUTEX1", i_thread);

                    let _guard = MUTEX1.lock().unwrap();
                }
            }
        }));
    }

    // 等子线程完成
    for child in children {
        let _ = child.join();
    }

    println!("死锁没有发生");
}
```

在上面的描述中，我们用了"可能"二字，原因在于死锁在这段代码中不是必然发生的，总有一次运行你能看到最后一行打印输出。这是由于子线程的初始化顺序和执行速度并不确定，我们无法确定哪个线程中的锁先被执行，因此也无法确定两个线程对锁的具体使用顺序。

但是，可以简单的说明下死锁发生的必然条件：`线程 1` 锁住了`MUTEX1`并且`线程2`锁住了`MUTEX2`，然后`线程 1` 试图去访问`MUTEX2`，同时线程2试图去访问MUTEX1，就会死锁。 因为`线程 2` 需要等待`线程 1` 释放`MUTEX1`后，才会释放`MUTEX2`，而与此同时，`线程 1` 需要等待`线程 2` 释放`MUTEX2`后才能释放`MUTEX1`，这种情况造成了两个线程都无法释放对方需要的锁，最终死锁。

那么为何某些时候，死锁不会发生？原因很简单，`线程 2` 在`线程 1` 锁`MUTEX1`之前，就已经全部执行完了，随之`线程 2` 的`MUTEX2`和`MUTEX1`被全部释放，`线程 1` 对锁的获取将不再有竞争者。 同理，`线程 1` 若全部被执行完，那`线程 2` 也不会被锁，因此我们在`线程 1` 中间加一个睡眠，增加死锁发生的概率。如果你在`线程 2` 中同样的位置也增加一个睡眠，那死锁将必然发生!

{% /article %}

{% article i18n="en" %}

# Thread Synchronization & Mutex

{% /article %}

{% article i18n="es" %}

# Sincronización de subprocesos y mutex

{% /article %}