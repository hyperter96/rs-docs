export const navigationMap = {
  'zh-CN': [
    {
      title: '快速开始',
      links: [
        { title: '简单介绍', href: '/' },
        { title: '功能特色', href: '/docs/get-started/features' },
        { title: 'Rust 安装', href: '/docs/get-started/installation' },
      ],
    },
    {
      title: '核心概念',
      links: [
        { title: '高层次概述', href: '/docs/core-concept/high-level-overview' },
        { title: '变量与常见数据类型', href: '/docs/core-concept/basic-type' },
        {
          title: 'Ownership与结构体、枚举',
          href: '/docs/core-concept/ownership-with-struct-enum',
        },
        {
          title: '流程控制和函数',
          href: '/docs/core-concept/flow-control-and-functions',
        },
        { title: 'Error错误处理', href: '/docs/core-concept/error-handling' },
        {
          title: '借用和生命周期',
          href: '/docs/core-concept/borrowing-and-lifetime',
        },
        { title: '泛型', href: '/docs/core-concept/generics' },
        { title: '特质', href: '/docs/core-concept/traits' },
        { title: '动态数组', href: '/docs/core-concept/dynamic-array' },
        { title: 'KV存储哈希表', href: '/docs/core-concept/hashmap' },
        { title: '闭包', href: '/docs/core-concept/closures' },
        { title: '迭代器', href: '/docs/core-concept/iterator' },
      ],
    },
    {
      title: '进阶学习',
      links: [
        { title: '类型转换', href: '/docs/advanced/type-cast' },
        { title: '智能指针', href: '/docs/advanced/smart-ptr' },
        { title: '结构体自引用', href: '/docs/advanced/struct-self-reference' },
        { title: '多线程入门', href: '/docs/advanced/multithreading' },
        {
          title: '线程间消息传递',
          href: '/docs/advanced/inter-thread-messaging',
        },
        {
          title: '线程同步与互斥锁',
          href: '/docs/advanced/thread-synchronization-mutex',
        },
        {
          title: '基于Send和Sync的线程安全',
          href: '/docs/advanced/thread-safety-based-on-send-and-sync',
        },
        { title: '宏编程入门', href: '/docs/advanced/macro-programming' },
        {
          title: '所有权机制的66个场景',
          href: '/docs/advanced/66-ownership-scenarios',
        },
      ],
    },
    {
      title: '设计模式',
      links: [
        {
          title: '使用借用类型作为参数',
          href: '/docs/design-patterns/using-borrowed-types-as-parameters',
        },
        {
          title: '使用`format!`串联字符串',
          href: '/docs/design-patterns/concat-string-with-format',
        },
        {
          title: '使用构造器和默认构造器',
          href: '/docs/design-patterns/constructor-and-default',
        },
        {
          title: '把集合当成智能指针',
          href: '/docs/design-patterns/collection-as-smart-ptr',
        },
        {
          title: '在析构器中做最终处理',
          href: '/docs/design-patterns/final-processing-in-the-destructor',
        },
        {
          title: 'mem::{take(_), replace(_)}',
          href: '/docs/design-patterns/mem-replace',
        },
      ],
    },
    {
      title: '网络编程',
      links: [
        {
          title: '实现TCP Server',
          href: '/docs/network-programming/realize-tcp-server',
        },
      ],
    },
    {
      title: '异步编程',
      links: [
        { title: '为什么使用Async', href: '/docs/async-programming/why-async' },
      ],
    },
    {
      title: '死灵书',
      links: [
        { title: '认识安全 & 不安全', href: '/docs/nomicon/safe-and-unsafe' },
      ],
    },
    {
      title: '测试与工程化',
      links: [
        {
          title: '编写测试以及控制执行',
          href: '/docs/engineering/test-and-execute',
        },
        { title: '构建系统', href: '/docs/engineering/build-system' },
      ],
    },
    {
      title: 'Wasm开发',
      links: [
        {
          title: '认识Wasmer',
          href: '/docs/wasm/learn-wasmer',
        },
      ],
    },
    // {
    //   title: 'Solana开发',
    //   links: [
    //     { title: '课程指南', href: '/docs/solana/getting-started'},
    //     { title: '密码学和 Solana 网络', href: '/docs/solana/intro-to-cryptography'},
    //     { title: '从 Solana 网络读取数据', href: '/docs/solana/intro-to-reading-data'},
    //     { title: '在 Solana 网络上创建交易', href: '/docs/solana/intro-to-writing-data'},
    //     { title: '为自定义链上程序创建交易', href: '/docs/solana/intro-to-custom-on-chain-programs'},
    //     { title: '与钱包交互', href: '/docs/solana/interact-with-wallets'},
    //   ],
    // }
  ],
  en: [
    {
      title: 'Get Started',
      links: [
        { title: 'Introduction', href: '/' },
        { title: 'Features', href: '/docs/get-started/features' },
        { title: 'Rust Installation', href: '/docs/get-started/installation' },
      ],
    },
    {
      title: 'Core Concept',
      links: [
        {
          title: 'High-level Overview',
          href: '/docs/core-concept/high-level-overview',
        },
        { title: 'Common Data Types', href: '/docs/core-concept/basic-type' },
        {
          title: 'Ownership with Structure and Enumeration',
          href: '/docs/core-concept/ownership-with-struct-enum',
        },
        {
          title: 'Flow Control and Functions',
          href: '/docs/core-concept/flow-control-and-functions',
        },
        { title: 'Error Handling', href: '/docs/core-concept/error-handling' },
        {
          title: 'Borrowing and Lifetime',
          href: '/docs/core-concept/borrowing-and-lifetime',
        },
        { title: 'Generics', href: '/docs/core-concept/generics' },
        { title: 'Traits', href: '/docs/core-concept/traits' },
        { title: 'Dynamic Array', href: '/docs/core-concept/dynamic-array' },
        { title: 'HashMap', href: '/docs/core-concept/hashmap' },
        { title: 'Closures', href: '/docs/core-concept/closures' },
        { title: 'Iterator', href: '/docs/core-concept/iterator' },
      ],
    },
    {
      title: 'Advanced',
      links: [
        { title: 'Type Conversion', href: '/docs/advanced/type-cast' },
        { title: 'Smart Pointer', href: '/docs/advanced/smart-ptr' },
        {
          title: 'Struct Self-reference',
          href: '/docs/advanced/struct-self-reference',
        },
        { title: 'Multithreading', href: '/docs/advanced/multithreading' },
        {
          title: 'Inter-thread Messaging',
          href: '/docs/advanced/inter-thread-messaging',
        },
        {
          title: 'Thread Synchronization & Mutex',
          href: '/docs/advanced/thread-synchronization-mutex',
        },
        {
          title: 'Thread Safety Based on Send & Sync',
          href: '/docs/advanced/thread-safety-based-on-send-and-sync',
        },
        {
          title: 'Introduction to Macro Programming',
          href: '/docs/advanced/macro-programming',
        },
        {
          title: '66 Ownership Scenarios',
          href: '/docs/advanced/66-ownership-scenarios',
        },
      ],
    },
    {
      title: 'Design Patterns',
      links: [
        {
          title: 'Using Borrowed Types as Parameters',
          href: '/docs/design-patterns/using-borrowed-types-as-parameters',
        },
        {
          title: 'Using `format!` to Concat Strings',
          href: '/docs/design-patterns/concat-string-with-format',
        },
        {
          title: 'Constructor & Default Constructor',
          href: '/docs/design-patterns/constructor-and-default',
        },
        {
          title: 'Consider Collections as Smart Pointers',
          href: '/docs/design-patterns/collection-as-smart-ptr',
        },
        {
          title: 'Do Final Processing in the Destructor',
          href: '/docs/design-patterns/final-processing-in-the-destructor',
        },
        {
          title: 'mem::{take(_), replace(_)}',
          href: '/docs/design-patterns/mem-replace',
        },
      ],
    },
    {
      title: 'Network Programming',
      links: [
        {
          title: 'Realize a TCP Server',
          href: '/docs/network-programming/realize-tcp-server',
        },
      ],
    },
    {
      title: 'Asynchronous Programming',
      links: [
        { title: 'Why Async', href: '/docs/async-programming/why-async' },
      ],
    },
    {
      title: 'Nomicon',
      links: [
        { title: 'Safe & Unsafe', href: '/docs/nomicon/safe-and-unsafe' },
      ],
    },
    {
      title: 'Testing & Engineering',
      links: [
        { title: 'Test & Execute', href: '/docs/engineering/test-and-execute' },
        { title: 'Build System', href: '/docs/engineering/build-system' },
      ],
    },
    {
      title: 'Wasm Development',
      links: [{ title: 'Learn Wasmer', href: '/docs/wasm/learn-wasmer' }],
    },
  ],
  es: [
    {
      title: 'Inicio rápido',
      links: [
        { title: 'Introducción', href: '/' },
        { title: 'Características', href: '/docs/get-started/features' },
        {
          title: 'Instalación de óxido',
          href: '/docs/get-started/installation',
        },
      ],
    },
    {
      title: 'Concepto principal',
      links: [
        {
          title: 'Descripción general de alto nivel',
          href: '/docs/core-concept/high-level-overview',
        },
        {
          title: 'Tipos de datos comunes',
          href: '/docs/core-concept/basic-type',
        },
        {
          title: 'Propiedad con estructura y enumeración',
          href: '/docs/core-concept/ownership-with-struct-enum',
        },
        {
          title: 'Control de flujo y funciones',
          href: '/docs/core-concept/flow-control-and-functions',
        },
        {
          title: 'Manejo de errores',
          href: '/docs/core-concept/error-handling',
        },
        {
          title: 'Préstamo y vida útil',
          href: '/docs/core-concept/borrowing-and-lifetime',
        },
        { title: 'Genéricos', href: '/docs/core-concept/generics' },
        { title: 'Rasgos', href: '/docs/core-concept/traits' },
        { title: 'Matriz dinámica', href: '/docs/core-concept/dynamic-array' },
        { title: 'Tabla de picadillo', href: '/docs/core-concept/hashmap' },
        { title: 'Cierres', href: '/docs/core-concept/closures' },
        { title: 'Iterador', href: '/docs/core-concept/iterator' },
      ],
    },
    {
      title: 'Avanzado',
      links: [
        { title: 'Conversión de tipo', href: '/docs/advanced/type-cast' },
        { title: 'Puntero inteligente', href: '/docs/advanced/smart-ptr' },
        {
          title: 'Estructura de autorreferencia',
          href: '/docs/advanced/struct-self-reference',
        },
        {
          title: 'subprocesos múltiples',
          href: '/docs/advanced/multithreading',
        },
        {
          title: 'mensaje que pasa entre hilos',
          href: '/docs/advanced/inter-thread-messaging',
        },
        {
          title: 'Sincronización de subprocesos y mutex',
          href: '/docs/advanced/thread-synchronization-mutex',
        },
        {
          title: 'Seguridad de subprocesos basada en envío y sincronización',
          href: '/docs/advanced/thread-safety-based-on-send-and-sync',
        },
        {
          title: 'Introducción a la programación de macros',
          href: '/docs/advanced/macro-programming',
        },
        {
          title: '66 escenarios de propiedad',
          href: '/docs/advanced/66-ownership-scenarios',
        },
      ],
    },
    {
      title: 'Patrones de diseño',
      links: [
        {
          title: 'Usar tipos prestados como parámetros',
          href: '/docs/design-patterns/using-borrowed-types-as-parameters',
        },
        {
          title: 'Usando `format!` para cadenas Concat',
          href: '/docs/design-patterns/concat-string-with-format',
        },
        {
          title: 'Constructor y constructor predeterminado',
          href: '/docs/design-patterns/constructor-and-default',
        },
        {
          title: 'Considere las colecciones como indicadores inteligentes',
          href: '/docs/design-patterns/collection-as-smart-ptr',
        },
        {
          title: 'Hacer procesamiento final en destructor',
          href: '/docs/design-patterns/final-processing-in-the-destructor',
        },
        {
          title: 'mem::{take(_), replace(_)}',
          href: '/docs/design-patterns/mem-replace',
        },
      ],
    },
    {
      title: 'Programación de red',
      links: [
        {
          title: 'Realizar un servidor TCP',
          href: '/docs/network-programming/realize-tcp-server',
        },
      ],
    },
    {
      title: 'Asynchronous Programming',
      links: [
        {
          title: '¿Por qué usar asíncrono?',
          href: '/docs/async-programming/why-async',
        },
      ],
    },
    {
      title: 'Nomicon',
      links: [
        { title: 'Seguro e inseguro', href: '/docs/nomicon/safe-and-unsafe' },
      ],
    },
    {
      title: 'Pruebas e ingeniería',
      links: [
        {
          title: 'Escribir pruebas y controlar la ejecución',
          href: '/docs/engineering/test-and-execute',
        },
        {
          title: 'Sistema de construcción',
          href: '/docs/engineering/build-system',
        },
      ],
    },
    {
      title: 'desarrollo wasm',
      links: [{ title: 'Conoce a Wasmer', href: '/docs/wasm/learn-wasmer' }],
    },
  ],
}
