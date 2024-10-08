{% article i18n="zh-CN" %}

# 结构体自引用

```rust
struct SelfRef<'a> {
    value: String,

    // 该引用指向上面的value
    pointer_to_value: &'a str,
}
```

以上就是一个很简单的自引用结构体，看上去好像没什么，那来试着运行下：

```rust
fn main(){
    let s = "aaa".to_string();
    let v = SelfRef {
        value: s,
        pointer_to_value: &s
    };
}
```
运行后报错：

```text
 let v = SelfRef {
12 |         value: s,
   |                - value moved here
13 |         pointer_to_value: &s
   |                           ^^ value borrowed here after move
```
因为我们试图同时使用值和值的引用，最终所有权转移和借用一起发生了。所以，这个问题貌似并没有那么好解决，不信你可以回想下自己具有的知识，是否可以解决？

## `unsafe` Implementation

```rust
#[derive(Debug)]
struct SelfRef {
    value: String,
    ptr_to_value: *const String,
}

impl SelfRef {
    fn new(txt: &str) -> Self {
        SelfRef {
            value: String::from(txt),
            ptr_to_value: std::ptr::null(), // 裸指针
        }
    }

    fn init(&mut self) {
        let self_ref: *const String = &self.value;
        self.ptr_to_value = self_ref;
    }

    fn value(&self) -> &str {
        &self.value
    }

    fn ptr_to_value(&self) -> &String {
        assert!(!self.ptr_to_value.is_null(),
            "Test::b called without Test::init being called first");
        unsafe { &*(self.ptr_to_value) }
    }
}

fn main() {
    let mut t = SelfRef::new("hello");
    t.init();
    // 打印值和指针地址
    println!("{}, {:p}", t.value(), t.ptr_to_value());
}
```

在这里，我们在 `ptr_to_value` 中直接存储裸指针，而不是 Rust 的引用，因此不再受到 Rust 借用规则和生命周期的限制，而且实现起来非常清晰、简洁。但是缺点就是，通过指针获取值时需要使用 `unsafe` 代码。

上面的代码你还能通过裸指针来修改 `String`，但是需要将 `*const` 修改为 `*mut`：

```rust
#[derive(Debug)]
struct SelfRef {
    value: String,
    pointer_to_value: *mut String,
}

impl SelfRef {
    fn new(txt: &str) -> Self {
        SelfRef {
            value: String::from(txt),
            pointer_to_value: std::ptr::null_mut(),
        }
    }

    fn init(&mut self) {
        let self_ref: *mut String = &mut self.value;
        self.pointer_to_value = self_ref;
    }

    fn value(&self) -> &str {
        &self.value
    }

    fn pointer_to_value(&self) -> &String {
        assert!(!self.pointer_to_value.is_null(), "Test::b called without Test::init being called first");
        unsafe { &*(self.pointer_to_value) }
    }
}

fn main() {
    let mut t = SelfRef::new("hello");
    t.init();
    println!("{}, {:p}", t.value(), t.pointer_to_value()); // hello, 0x16f3aec70

    t.value.push_str(", world");
    unsafe {
        (&mut *t.pointer_to_value).push_str("!");
    }

    println!("{}, {:p}", t.value(), t.pointer_to_value()); // hello, world!, 0x16f3aec70
}
```
除了使用`unsafe`，还可以使用`Pin`。

## `Pin`

`Pin`的使用可以固定住一个值，防止该值在内存中被移动。

通过开头我们知道，自引用最麻烦的就是创建引用的同时，值的所有权会被转移，而通过 `Pin` 就可以很好的防止这一点：

{% /article %}

{% article i18n="en" %}

# Struct Self-reference

{% /article %}

{% article i18n="es" %}

# Estructura de autorreferencia

{% /article %}