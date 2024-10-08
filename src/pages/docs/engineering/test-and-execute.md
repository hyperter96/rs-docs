{% article i18n="zh-CN" %}

# 编写测试以及控制执行

在 Rust 中，测试是通过函数的方式实现的，它可以用于验证被测试代码的正确性。测试函数往往依次执行以下三种行为：

1. 设置所需的数据或状态
2. 运行想要测试的代码
3. 判断( `assert` )返回的结果是否符合预期

让我们来看看该如何使用 Rust 提供的特性来按照上述步骤编写测试用例。

## Test Functions

当使用 `Cargo` 创建一个 `lib` 类型的包时，它会为我们自动生成一个测试模块。先来创建一个 `lib` 类型的 `adder` 包：

```bash
$ cargo new adder --lib
     Created library `adder` project
$ cd adder
```

创建成功后，在 `src/lib.rs` 文件中可以发现如下代码:

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
```

其中，`tests` 就是一个测试模块，`it_works` 则是我们的主角：测试函数。

可以看出，测试函数需要使用 `test` 属性进行标注。关于属性( attribute )，我们在之前的章节已经见过类似的 `derive`，使用它可以派生自动实现的 `Debug 、Copy` 等特征，同样的，使用 `test` 属性，我们也可以获取 Rust 提供的测试特性。

经过 `test` 标记的函数就可以被测试执行器发现，并进行运行。当然，在测试模块 `tests` 中，还可以定义非测试函数，这些函数可以用于设置环境或执行一些通用操作：例如为部分测试函数提供某个通用的功能，这种功能就可以抽象为一个非测试函数。

换而言之，正是因为测试模块既可以定义测试函数又可以定义非测试函数，导致了我们必须提供一个特殊的标记 `test`，用于告知哪个函数才是测试函数。

### `assert_eq`

在测试函数中，还使用到了一个内置的断言：`assert_eq`，该宏用于对结果进行断言：`2 + 2` 是否等于 4。

### `cargo test`

下面使用 `cargo test` 命令来运行项目中的所有测试:

```bash
$ cargo test
   Compiling adder v0.1.0 (file:///projects/adder)
    Finished test [unoptimized + debuginfo] target(s) in 0.57s
     Running unittests (target/debug/deps/adder-92948b65e88960b4)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests adder

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

上面测试输出中，有几点值得注意:

- 测试用例是分批执行的，`running 1 test` 表示下面的输出 `test result` 来自一个测试用例的运行结果。
- `test tests::it_works` 中包含了测试用例的名称
- `test result: ok` 中的 `ok`表示测试成功通过
- `1 passed` 代表成功通过一个测试用例(因为只有一个)，`0 failed` : 没有测试用例失败，`0 ignored` 说明我们没有将任何测试函数标记为运行时可忽略，`0 filtered` 意味着没有对测试结果做任何过滤，`0 mesasured` 代表基准测试(benchmark)的结果

关于 `filtered` 和 `ignored` 的使用，在本章节的后续内容我们会讲到，这里暂且略过。

还有一个很重要的点，输出中的 `Doc-tests adder` 代表了文档测试，由于我们的代码中没有任何文档测试的内容，因此这里的测试用例数为 0，关于文档测试的详细介绍请参见这里。

大家还可以尝试修改下测试函数的名称，例如修改为 `exploration`，看看运行结果将如何变化。

#### Failed Test Cases

是时候开始写自己的测试函数了，为了演示，这次我们来写一个会运行失败的:

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn exploration() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn another() {
        panic!("Make this test fail");
    }
}
```

新的测试函数 `another` 相当简单粗暴，直接使用 `panic` 来报错，使用 `cargo test` 运行看看结果：

```bash
running 2 tests
test tests::another ... FAILED
test tests::exploration ... ok

failures:

---- tests::another stdout ----
thread 'main' panicked at 'Make this test fail', src/lib.rs:10:9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    tests::another

test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

error: test failed, to rerun pass '--lib'
```

从结果看，两个测试函数，一个成功，一个失败，同时在输出中准确的告知了失败的函数名: `failures: tests::another`，同时还给出了具体的失败原因： `tests::another stdout`。这两者虽然看起来存在重复，但是前者用于说明每个失败的具体原因，后者用于给出一眼可得结论的汇总信息。

{% callout type="question" title="提问" %}

有同学可能会好奇，这两个测试函数以什么方式运行？ 它们会运行在同一个线程中吗？

答案是否定的，Rust 在默认情况下会为每一个测试函数启动单独的线程去处理，当主线程 `main` 发现有一个测试线程死掉时，`main` 会将相应的测试标记为失败。
{% /callout %}
事实上，多线程运行测试虽然性能高，但是存在数据竞争的风险，在后文我们会对其进行详细介绍并给出解决方案。

## Test `panic`

在之前的例子中，我们通过 `panic` 来触发报错，但是如果一个函数本来就会 `panic` ，而我们想要检查这种结果呢？

也就是说，我们需要一个办法来测试一个函数是否会 `panic`，对此， Rust 提供了 `should_panic` 属性注解，和 test 注解一样，对目标测试函数进行标注即可：

```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {}.", value);
        }

        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn greater_than_100() {
        Guess::new(200);
    }
}
```

上面是一个简单的猜数字游戏，`Guess` 结构体的 `new` 方法在传入的值不在 `[1,100]` 之间时，会直接 `panic`，而在测试函数 `greater_than_100` 中，我们传入的值 200 显然没有落入该区间，因此 `new` 方法会直接 `panic`，为了测试这个预期的 `panic` 行为，我们使用 `#[should_panic]` 对其进行了标注。

```text
running 1 test
test tests::greater_than_100 - should panic ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

从输出可以看出， `panic` 的结果被准确的进行了测试，那如果测试函数中的代码不再 `panic` 呢？例如：

```rust
fn greater_than_100() {
    Guess::new(50);
}
```

此时显然会测试失败，因为我们预期一个 `panic`，但是 `new` 函数顺利的返回了一个 `Guess` 实例:

```text
running 1 test
test tests::greater_than_100 - should panic ... FAILED

failures:

---- tests::greater_than_100 stdout ----
note: test did not panic as expected // 测试并没有按照预期发生 panic
```

### `expected`

虽然 `panic` 被成功测试到，但是如果代码发生的 `panic` 和我们预期的 `panic` 不符合呢？因为一段糟糕的代码可能会在不同的代码行生成不同的 `panic`。

鉴于此，我们可以使用可选的参数 `expected` 来说明预期的 `panic` 长啥样：

```rust
// --snip--
impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!(
                "Guess value must be greater than or equal to 1, got {}.",
                value
            );
        } else if value > 100 {
            panic!(
                "Guess value must be less than or equal to 100, got {}.",
                value
            );
        }

        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Guess value must be less than or equal to 100")]
    fn greater_than_100() {
        Guess::new(200);
    }
}
```

这段代码会通过测试，因为通过增加了 `expected` ，我们成功指定了期望的 `panic` 信息，大家可以顺着代码推测下：把 `200` 带入到 `new` 函数中看看会触发哪个 `panic`。

如果注意看，你会发现` expected` 的字符串和实际 `panic` 的字符串可以不同，前者只需要是后者的字符串前缀即可，如果改成 `#[should_panic(expected = "Guess value must be less than")]`，一样可以通过测试。

这里由于篇幅有限，我们就不再展示测试失败的报错，大家可以自己修改下 `expected` 的信息，然后看看报错后的输出长啥样。

{% /article %}

{% article i18n="en" %}

# Test & Execute

{% /article %}

{% article i18n="es" %}

# Escribir pruebas y controlar la ejecución

{% /article %}