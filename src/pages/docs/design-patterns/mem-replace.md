{% article i18n="zh-CN" %}

# 在发生改变的枚举中使用mem::{take(\_), replace(\_)}来保留所有值

## Description

假定我们有一个`&mut MyEnum`，它有（至少）两个变体， `A { name: String, x: u8 }`和`B { name: String }`。 现在我们想如果`x`为零，把`MyEnum::A`改成`B`，同时保持`MyEnum::B`不变。

## Example

```rust
use std::mem;

enum MyEnum {
    A { name: String, x: u8 },
    B { name: String }
}

fn a_to_b(e: &mut MyEnum) {
    if let MyEnum::A { name, x: 0 } = e {
        // this takes out our `name` and put in an empty String instead
        // (note that empty strings don't allocate).
        // Then, construct the new enum variant (which will
        // be assigned to `*e`).
        *e = MyEnum::B { name: mem::take(name) }
    }
}
```

这也适用于更多的变体：

```rust
use std::mem;

enum MultiVariateEnum {
    A { name: String },
    B { name: String },
    C,
    D
}

fn swizzle(e: &mut MultiVariateEnum) {
    use MultiVariateEnum::*;
    *e = match e {
        // Ownership rules do not allow taking `name` by value, but we cannot
        // take the value out of a mutable reference, unless we replace it:
        A { name } => B { name: mem::take(name) },
        B { name } => A { name: mem::take(name) },
        C => D,
        D => C
    }
}
```

{% /article %}

{% article i18n="en" %}

# Use mem::{take(\_), replace(\_)} to keep all values ​​in the enum that is changing

{% /article %}

{% article i18n="es" %}

# Utilice mem::{take(\_), replace(\_)} en una enumeración modificada para conservar todos los valores

{% /article %}