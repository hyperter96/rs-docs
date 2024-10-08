{% article i18n="zh-CN" %}

# 线程间消息传递

在多线程间有多种方式可以共享、传递数据，最常用的方式就是通过消息传递或者将锁和`Arc`联合使用，而对于前者，在编程界还有一个大名鼎鼎的`Actor`线程模型为其背书，典型的有 Erlang 语言，还有 Go 语言中很经典的一句话：

> Do not communicate by sharing memory; instead, share memory by communicating.

## Channel

与 Go 语言内置的`chan`不同，Rust 是在标准库里提供了消息通道(`channel`)，你可以将其想象成一场直播，多个主播联合起来在搞一场直播，最终内容通过通道传输给屏幕前的我们，其中主播被称之为发送者，观众被称之为接收者，显而易见的是：一个通道应该支持多个发送者和接收者。

但是，在实际使用中，我们需要使用不同的库来满足诸如：`多发送者 -> 单接收者，多发送者 -> 多接收者`等场景形式，此时一个标准库显然就不够了，不过别急，让我们先从标准库讲起。

### Multiple Producer & Single Consumer

标准库提供了通道`std::sync::mpsc`，其中`mpsc`是*multiple producer, single consumer*的缩写，代表了该通道支持多个发送者，但是只支持唯一的接收者。 当然，支持多个发送者也意味着支持单个发送者，我们先来看看单发送者、单接收者的简单例子:

```rust
use std::{sync::mpsc::channel, thread};

fn main() {
    // 创建消息通道，tx是发送者，rx是接收者
    let (tx, rx) = channel();

    // 创建子线程，并发送消息
    thread::spawn(move || {
        // 发送数字1，通过unwrap进行错误处理
        tx.send(1).unwrap();
    });

    // 主线程接收到子线程的消息并输出
    println!("receive {}", rx.recv().unwrap());
}
```
以上代码不复杂，但需要注意：

- `tx`和`rx`的类型是由编译器自动推导的：`tx.send(1)`发送的是整数，因此它们分别是`mpsc::Send<i32>`和`mpsc::Receiver<i32>`类型
- 接收器的操作`rx.recv()`会阻塞当前线程，直到读取到值，或者通道被关闭
- 需要使用`move`将`tx`的所有权转移到子线程的闭包中

### `try_recv` Method Without Blocking the Main Thread

除了上述`recv`方法，还可以使用`try_recv`尝试接收一次消息，该方法并不会阻塞线程，当通道中没有消息时，它会立刻返回一个错误：

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        tx.send(1).unwrap();
    });

    println!("receive {:?}", rx.try_recv());
}
```

如上，`try_recv`返回了一个错误，错误内容是`Empty`，代表通道并没有消息。如果你尝试把`println!`复制一些行，就会发现一个有趣的输出：

```text
···
receive Err(Empty)
receive Ok(1)
receive Err(Disconnected)
···
```

如上，当子线程创建成功且发送消息后，主线程会接收到`Ok(1)`的消息内容，紧接着子线程结束，发送者也随着被`drop`，此时接收者又会报错，但是这次错误原因有所不同：`Disconnected`代表发送者已经被关闭。

### Transfer Data with Ownership

使用通道来传输数据，一样要遵循 Rust 的所有权规则：

- 若值的类型实现了`Copy`特征，则直接复制一份该值，然后传输过去，例如之前的`i32`类型
- 若值没有实现`Copy`，则它的所有权会被转移给接收端，在发送端继续使用该值将报错

一起来看看第二种情况:

```rust
use std::{sync::mpsc::channel, thread};

fn main() {
    let (tx, rx) = channel();

    thread::spawn(move || {
        let s = String::from("我飞走了");
        tx.send(s).unwrap();
        // println!("val is {}", s); // 所有权在tx发送String类型的数据的时候已经发生转移
    });

    let received = rx.recv().unwrap();
    println!("Got {}", received); // Got 我飞走了
}
```
以上代码中，`String`底层的字符串是存储在堆上，并没有实现`Copy`特征，当它被发送后，会将所有权从发送端的s转移给接收端的`received`，之后`s`将无法被使用。

### Use `for` to Loop Through the Receiving

下面来看看如何连续接收通道中的值:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

在上面代码中，主线程和子线程是并发运行的，子线程在不停的发送消息 -> 休眠 1 秒，与此同时，主线程使用`for`循环阻塞的从`rx`迭代器中接收消息，当子线程运行完成时，发送者`tx`会随之被`drop`，此时`for`循环将被终止，最终`main`线程成功结束。

#### Multiple Producer

由于子线程会拿走发送者的所有权，因此我们必须对发送者进行克隆，然后让每个线程拿走它的一份拷贝:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone();
    thread::spawn(move || {
        tx.send(String::from("hi from raw tx")).unwrap();
    });

    thread::spawn(move || {
        tx1.send(String::from("hi from cloned tx")).unwrap();
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

代码并无太大区别，就多了一个对发送者的克隆`let tx1 = tx.clone();`，然后一个子线程拿走`tx`的所有权，另一个子线程拿走`tx1`的所有权，皆大欢喜。

:::warning 注意
- 需要所有的发送者都被`drop`掉后，接收者`rx`才会收到错误，进而跳出`for`循环，最终结束主线程
- 这里虽然用了`clone`但是并不会影响性能，因为它并不在热点代码路径中，仅仅会被执行一次
- 由于两个子线程谁先创建完成是未知的，因此哪条消息先发送也是未知的，最终主线程的输出顺序也不确定
:::

更多例子：

```rust
use std::{sync::mpsc::{channel, Sender}, thread, time::Duration};

fn main() {
    let (tx, rx) = channel();
    let tx1 = Sender::clone(&tx);

    // 两个子线程
    thread::spawn(move || {
        let values = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];
        
        for val in values {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    thread::spawn(move || {
        let values = vec![
            String::from("A"),
            String::from("B"),
            String::from("C"),
            String::from("D"),
        ];
        
        for val in values {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for rec in rx {
        println!("Got: {}", rec);
    }
}
```

### Synchronous & Asynchronous Channels

{% /article %}

{% article i18n="en" %}

# Inter-thread Messaging

{% /article %}

{% article i18n="es" %}

# mensaje que pasa entre hilos

{% /article %}
