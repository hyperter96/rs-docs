{% article i18n="zh-CN" %}

# 把集合当成智能指针

## Description

使用`Deref` trait将集合视为智能指针，提供拥有和借用的数据视图。

## Example

考虑`Vec`，`Vec`是一个拥有`T`的集合，然后通过实现`Deref`完成`&Vec`到`&[T]`的隐式解引用，从而提供借用`T`的集合（即`&[T]`）。

```rust
impl<T> Deref for Vec<T> {
    type Target = [T];
    fn deref(&self) -> &[T] {
        unsafe {
            std::slice::from_raw_parts(self.ptr.as_ptr(), self.len)
        }
    }
}
```

原因：`Vec`提供了拥有`T`的集合，`&[T]`提供借用`T`的集合。大部分情况下，只需要借用视图，提供两种方式，让用户在使用时在借用和拥有之间做出选择。

## Discussion

智能指针和集合是类似的：一个智能指针指向一个对象，而一个集合指向许多对象。 从类型系统的角度来看，这两者之间没有什么区别。 如果访问每个数据的唯一途径是通过集合，并且集合负责删除数据（即使在共享所有权的情况下，某种借用视图可能是合适的），那么集合就拥有它的数据。 如果集合拥有它的数据，提供借用数据的视图通常是有用的，这样它就可以被多次引用了。

大多数智能指针（例如，`Foo<T>`）实现了`Deref<Target=T>`。 然而，集合通常会解引用到一个自定义的类型。 `[T]`和`str`有一些语言支持，但在一般情况下，这是没有必要的。 `Foo<T>`可以实现`Deref<Target=Bar<T>`，其中`Bar`是一个动态大小的类型，`&Bar<T>`是对`Foo<T>`中数据的借用视图。

通常，有序集合为`Range`实现`Index`，以提供分片语法。目标是借用视图。

{% /article %}

{% article i18n="en" %}

# Consider Collections as Smart Pointers

{% /article %}

{% article i18n="es" %}

# Considere las colecciones como indicadores inteligentes

{% /article %}