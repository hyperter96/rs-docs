{% article i18n="zh-CN" %}

# KV存储哈希表

和动态数组一样，`HashMap` 也是 Rust 标准库中提供的集合类型，但是又与动态数组不同，`HashMap` 中存储的是一一映射的 KV 键值对，并提供了平均复杂度为 `O(1)` 的查询方法，当我们希望通过一个 Key 去查询值时，该类型非常有用，以致于 Go 语言将该类型设置成了语言级别的内置特性。

Rust 中哈希类型（哈希映射）为 `HashMap<K,V>`，在其它语言中，也有类似的数据结构，例如 `hash map`，`map`，`object`，`hash table`，`字典`等等。

## Construct a `HashMap`

跟创建动态数组 `Vec` 的方法类似，可以使用 `new` 方法来创建 `HashMap`，然后通过 `insert` 方法插入键值对。

### Use `new` Method to Construct a HashMap

```rust
use std::collections::HashMap;

fn main() {
    let mut gems_map = HashMap::new();
    gems_map.insert("红宝石", 1);
    gems_map.insert("蓝宝石", 2);
    gems_map.insert("破石头", 10);
    println!("{:#?}", gems_map);
    // {
    //     "蓝宝石": 2,
    //     "破石头": 10,
    //     "红宝石": 1,
    // }
}
```

你可能没有注意，那就是使用 `HashMap` 需要手动通过 `use ...` 从标准库中引入到我们当前的作用域中来，仔细回忆下，之前使用另外两个集合类型 `String` 和 `Vec` 时，我们是否有手动引用过？答案是 No，因为 `HashMap` 并没有包含在 Rust 的 `prelude` 中（Rust 为了简化用户使用，提前将最常用的类型自动引入到作用域中）。

所有的集合类型都是动态的，意味着它们没有固定的内存大小，因此它们底层的数据都存储在内存堆上，然后通过一个存储在栈中的引用类型来访问。同时，跟其它集合类型一致，`HashMap` 也是内聚性的，即所有的 `K` 必须拥有同样的类型，`V` 也是如此。

:::warning 注意
跟 `Vec` 一样，如果预先知道要存储的 `KV` 对个数，可以使用 `HashMap::with_capacity(capacity)` 创建指定大小的 `HashMap`，避免频繁的内存分配和拷贝，提升性能。
:::

### Use Iterator & `collect` Method to Construct a HashMap

例如考虑一个场景，有一张表格中记录了足球联赛中各队伍名称和积分的信息，这张表如果被导入到 Rust 项目中，一个合理的数据结构是 `Vec<(String, u32)>` 类型，该数组中的元素是一个个元组，该数据结构跟表格数据非常契合：表格中的数据都是逐行存储，每一个行都存有一个 `(队伍名称, 积分)` 的信息。

Rust 为我们提供了一个非常精妙的解决办法：先将 `Vec` 转为迭代器，接着通过 `collect` 方法，将迭代器中的元素收集后，转成 `HashMap`：

```rust
use std::collections::HashMap;

fn main() {
    let teams_list = vec![
        ("中国队".to_string(), 100),
        ("美国队".to_string(), 10),
        ("日本队".to_string(), 50),
    ];
    let team_map :HashMap<_, _> = teams_list.into_iter().collect();
    println!("{:#?}", team_map);
    // {
    //     "日本队": 50,
    //     "美国队": 10,
    //     "中国队": 100,
    // }
}
```

代码很简单，`into_iter` 方法将列表转为迭代器，接着通过 `collect` 进行收集，不过需要注意的是，`collect` 方法在内部实际上支持生成多种类型的目标集合，因此我们需要通过类型标注 `HashMap<_,_>` 来告诉编译器：请帮我们收集为 `HashMap` 集合类型，具体的 `KV` 类型，麻烦编译器您老人家帮我们推导。

## Look up `HashMap`

通过 `get` 方法可以获取元素：

```rust
use std::collections::HashMap;

fn main() {
    let mut gems_map = HashMap::new();
    gems_map.insert("红宝石", 1);
    gems_map.insert("蓝宝石", 2);
    gems_map.insert("破石头", 10);
    println!("{:#?}", gems_map);
    // {
    //     "蓝宝石": 2,
    //     "破石头": 10,
    //     "红宝石": 1,
    // }

    let num = gems_map.get("红宝石");
}
```
注意：

- 上面使用`get`方法返回的`num`是`Option<&i32>`类型：当查询不到时，会返回一个`None`，查询到时会返回`Some(&i32)`
- `&i32`是对 `HashMap` 中值的借用，如果不使用借用，可能会发生所有权的转移

如果我们想直接获得值类型的 `num` 该怎么办，答案简约但不简单:

```rust
use std::collections::HashMap;
fn main() {
    let mut gems_map = HashMap::new();
    gems_map.insert("红宝石", 1);
    gems_map.insert("蓝宝石", 2);
    gems_map.insert("破石头", 10);
    println!("{:#?}", gems_map);
    // {
    //     "蓝宝石": 2,
    //     "破石头": 10,
    //     "红宝石": 1,
    // }

    let num = gems_map.get("红宝石").copied().unwrap_or(0);
    println!("数量: {}", num); // 数量: 1
}
```

`num`此时是`i32`。

## Update `HashMap`

更新值的时候，涉及多种情况，咱们在代码中一一进行说明：

```rust
use std::collections::HashMap;

fn main() {
    let mut gems_map = HashMap::new();
    gems_map.insert("红宝石", 1);
    gems_map.insert("蓝宝石", 2);
    gems_map.insert("破石头", 10);
    println!("{:#?}", gems_map);
    // {
    //     "蓝宝石": 2,
    //     "破石头": 10,
    //     "红宝石": 1,
    // }

    // 覆盖gems_map中的值
    gems_map.insert("红宝石", 4);
    println!("{:#?}", gems_map);
    // {
    //     "蓝宝石": 2,
    //     "红宝石": 4,
    //     "破石头": 10,
    // }

    // 查询绿宝石对应的值，若不存在则插入值
    let _v = gems_map.entry("绿宝石").or_insert(3);
    println!("{:#?}", gems_map);
    // {
    //     "绿宝石": 3,
    //     "蓝宝石": 2,
    //     "红宝石": 4,
    //     "破石头": 10,
    // }
}
```

## Hash Functions

若一个复杂点的类型作为 `Key`，那怎么在底层对它进行存储，怎么使用它进行查询和比较？ 是不是很棘手？好在我们有哈希函数：通过它把 `Key` 计算后映射为哈希值，然后使用该哈希值来进行存储、查询、比较等操作。

但是问题又来了，如何保证不同 `Key` 通过哈希后的两个值不会相同？如果相同，那意味着我们使用不同的 `Key`，却查到了同一个结果，这种明显是错误的行为。 此时，就涉及到安全性跟性能的取舍了。

### High-performance Third-party Repo

因此若性能测试显示当前标准库默认的哈希函数不能满足你的性能需求，就需要去 `crates.io` 上寻找其它的哈希函数实现，使用方法很简单：先在`cargo.toml`引入`twox-hash`的库，然后

```rust
use std::hash::BuildHasherDefault;
use std::collections::HashMap;
// 引入第三方的哈希函数
use twox_hash::XxHash64;

fn main() {
    let mut hash: HashMap<_, _, BuildHasherDefault<XxHash64>> = Default::default();
    hash.insert("精灵球", 2);
    println!("hash: {:#?}", hash);
    // hash: {
    //     "精灵球": 2,
    // }
}
```

{% /article %}

{% article i18n="en" %}

# HashMap

{% /article %}

{% article i18n="es" %}

# Tabla de picadillo

{% /article %}