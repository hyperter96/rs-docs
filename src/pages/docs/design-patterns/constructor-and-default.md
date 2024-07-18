{% article i18n="zh-CN" %}

# 使用构造器和默认构造器

## Description

Rust中，通常使用一个关联函数`new`来创建一个对象，通过`Default` trait来支持默认构造器。

## Example

```rust
pub struct Second {
    value: u64
}

impl Second {
    // Constructs a new instance of [`Second`].
    // Note this is an associated function - no self.
    pub fn new(value: u64) -> Self {
        Self { value }
    }

    /// Returns the value in seconds.
    pub fn value(&self) -> u64 {
        self.value
    }
}
```

如果是默认构造器，那么需要为结构体`Second`实现`Default`，

```rust
pub struct Second {
    value: u64
}

impl Second {
    /// Returns the value in seconds.
    pub fn value(&self) -> u64 {
        self.value
    }
}

impl Default for Second {
    fn default() -> Self {
        Self { value: 0 }
    }
}
```

## Using `#[derive(Default)]` Macro

如果所有类型的所有字段都实现了`Default`，也可以派生出`Default`，就像对`Second`那样：

```rust
#[derive(Default)]
pub struct Second {
    value: u64
}

impl Second {
    /// Returns the value in seconds.
    pub fn value(&self) -> u64 {
        self.value
    }
}
```

{% /article %}

{% article i18n="en" %}

# Constructor & Default Constructor

## Description

In Rust, an associated function `new` is usually used to create an object, and the `Default` trait is used to support the default constructor.

## Example 

```rust
pub struct Second {
    value: u64
}

impl Second {
    // Constructs a new instance of [`Second`].
    // Note this is an associated function - no self.
    pub fn new(value: u64) -> Self {
        Self { value }
    }

    /// Returns the value in seconds.
    pub fn value(&self) -> u64 {
        self.value
    }
}
```

If it is a default constructor, then you need to implement `Default` for the structure `Second`,

```rust
pub struct Second {
value: u64
}

impl Second {
/// Returns the value in seconds.
pub fn value(&self) -> u64 {
self.value
}
}

impl Default for Second {
fn default() -> Self {
Self { value: 0 }
}
}
```
 
## Using `#[derive(Default)]` Macro

If all fields of all types implement `Default`, we can also derive `Default`, just like for `Second`:

```rust
#[derive(Default)]
pub struct Second {
value: u64
}

impl Second {
/// Returns the value in seconds.
pub fn value(&self) -> u64 {
self.value
}
}
```

{% /article %}

{% article i18n="es" %}

# Constructor y constructor predeterminado

{% /article %}