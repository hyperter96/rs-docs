{% article i18n="zh-CN" %}

# Rust 安装

第一步是安装 Rust。我们会通过 `rustup` 下载 Rust，这是一个管理 Rust 版本和相关工具的命令行工具。下载时需要联网。

> 注意：如果你出于某些理由倾向于不使用 `rustup`，请到 [Rust 的其他安装方法页面][otherinstall] 查看其它安装选项。

接下来的步骤会安装最新的稳定版 Rust 编译器。Rust 的稳定性确保本书所有示例在最新版本的 Rust 中能够继续编译。不同版本的输出可能略有不同，因为 Rust 经常改进错误信息和警告。也就是说，任何通过这些步骤安装的最新稳定版 Rust，都应该能正常运行本书中的内容。

> **命令行标记**
>
> 本章和全书中，我们会展示一些在终端中使用的命令。所有需要输入到终端的行都以 `$` 开头。你不需要输入`$`字符；这里显示的`$`字符表示命令行提示符，仅用于提示每行命令的起点。不以 `$` 起始的行通常展示前一个命令的输出。另外，PowerShell 专用的示例会采用 `>` 而不是 `$`。

## Install `rustup` on Linux or macOS

如果你使用 Linux 或 macOS，打开终端并输入如下命令：

```bash
curl --proto '=https' --tlsv1.3 https://sh.rustup.rs -sSf | sh
```

此命令下载一个脚本并开始安装 `rustup` 工具，这会安装最新稳定版 Rust。过程中可能会提示你输入密码。如果安装成功，将会出现如下内容：

```text
Rust is installed now. Great!
```

另外，你还需要一个 *链接器（linker）*，这是 Rust 用来将其编译的输出连接到一个文件中的程序。很可能你已经有一个了。如果你遇到了链接器错误，请尝试安装一个 C 编译器，它通常包括一个链接器。C 编译器也很有用，因为一些常见的 Rust 包依赖于 C 代码，因此需要安装一个 C 编译器。

在 macOS 上，你可以通过运行以下命令获得 C 语言编译器：

```bash
xcode-select --install
```

Linux 用户通常需要根据发行版（distribution）文档安装 GCC 或 Clang。比如，如果你使用 Ubuntu，可以安装 `build-essential` 包。

## Install `rustup` on Windows

在 Windows 上，前往 [https://www.rust-lang.org/install.html][install] 并按照说明安装 Rust。在安装过程的某个步骤，你会收到一个信息说明为什么需要安装 Visual Studio 2013 或其更新版本的 MSVC 构建工具。要获取构建工具，你需要安装 [Visual Studio 2022][visualstudio]。当被问及需要安装什么工作负载（Workload）的时候，请确保勾选了以下内容：

- “使用 C++ 的桌面开发”，
- Windows 10 （或 11） SDK，
- 英语语言包，以及其他你所需要的语言包。

本书的余下部分会使用能同时运行于 `cmd.exe` 和 PowerShell 的命令。如果存在特定差异，我们会解释使用哪一个。

## Troubleshooting

要检查是否正确安装了 Rust，打开命令行并输入：

```bash
rustc --version
```

你应该可以看到按照以下格式显示的最新稳定版本的版本号、对应的 Commit Hash 和 Commit 日期：

```bash
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

如果看到了这样的信息，就说明 Rust 已经安装成功了！

> 译者：恭喜入坑！（此处应该有掌声！）

如果没看到，请按照下面说明的方法检查 Rust 是否在您的 `%PATH%` 系统变量中。

在 Windows CMD 中，请使用命令：

```powershell
echo %PATH%
```

在 PowerShell 中，请使用命令：

```powershell
echo $env:Path
```

在 Linux 和 macOS 中，请使用命令：

```bash
echo $PATH
```

如果一切正确但 Rust 仍不能使用，有许多地方可以求助。最简单的是[位于 Rust 官方 Discord][discord] 上的 `#beginners` 频道。在这里你可以和其他 Rustacean（Rust 用户的称号，有自嘲意味）聊天并寻求帮助。其它给力的资源包括[用户论坛][users]和 [Stack Overflow][stackoverflow]。

> 译者注：这些资源的主要语言都是英语。

## Update and Uninstall

通过 `rustup` 安装了 Rust 之后，很容易更新到最新版本，只需要在命令行中运行如下更新脚本即可：

```bash
rustup update
```

若要卸载 Rust 和 `rustup`，请在命令行中运行如下卸载脚本:

```bash
rustup self uninstall
```

## Local Docs

安装程序也自带一份文档的本地拷贝，可以离线阅读。运行 `rustup doc` 在浏览器中查看本地文档。

任何时候，如果你拿不准标准库中的类型或函数的用途和用法，请查阅应用程序接口（application programming interface，API）文档！

[otherinstall]: https://forge.rust-lang.org/infra/other-installation-methods.html
[install]: https://www.rust-lang.org/tools/install
[visualstudio]: https://visualstudio.microsoft.com/downloads/
[discord]: https://discord.gg/rust-lang
[users]: https://users.rust-lang.org/
[stackoverflow]: https://stackoverflow.com/questions/tagged/rust

{% /article %}

{% article i18n="en" %}

# Rust Installation

The first step is to install Rust. We'll download Rust using rustup , a command-line tool for managing Rust versions and related tools. You'll need an internet connection to download.

> Note: If you prefer not to use rustup for some reason, see the [Rust Alternative Installation Page][otherinstall] for other installation options.

The following steps install the latest stable version of the Rust compiler. Rust's stability ensures that all of the examples in this book will continue to compile with the latest version of Rust. Output may vary slightly between versions, as Rust is often improving error messages and warnings. That said, any of the latest stable versions of Rust installed using these steps should work with the content in this book.

> **Command-line Notation**
>
> In this chapter and throughout the book, we'll show commands that you use in the terminal. All lines that you type into the terminal begin with a `$`. You don't need to type the `$` character; the `$` character shown here indicates the command-line prompt and is only used to indicate the beginning of each command line. Lines that don't begin with a `$` usually show the output of a previous command. Also, PowerShell-specific examples use `>` instead of `$`.

## Install `rustup` on Linux or macOS

If you're using Linux or macOS, open a terminal and type the following command:

```bash
curl --proto '=https' --tlsv1.3 https://sh.rustup.rs -sSf | sh
```

This command downloads a script and starts installing the `rustup` tool, which installs the latest stable version of Rust. You may be prompted for your password. If the installation is successful, you'll see something like this:

```text
Rust is installed now. Great!
```

You'll also need a *linker*, which is the program Rust uses to connect the output of its compilation into a single file. Chances are you already have one. If you get linker errors, try installing a C compiler, which usually includes a linker. A C compiler is also useful because some common Rust packages depend on C code, so you'll need one installed.

On macOS, you can get the C compiler by running:

```bash
xcode-select --install
```

Linux users will usually need to install GCC or Clang according to their distribution's documentation. For example, if you use Ubuntu, you can install the `build-essential` package.

## Install `rustup` on Windows

On Windows, go to [https://www.rust-lang.org/install.html][install] and follow the instructions to install Rust. At some point during the installation, you will get a message explaining why you need to install the MSVC build tools for Visual Studio 2013 or later. To get the build tools, you need to install [Visual Studio 2022][visualstudio]. When asked what workloads to install, make sure the following are checked:

- "Desktop development with C++",
- Windows 10 (or 11) SDK,
- English language pack, and any other language packs you need.

The rest of this book uses commands that work in both cmd.exe and PowerShell. If there are specific differences, we'll explain which one to use.

## Troubleshooting

To check that Rust is installed correctly, open a command prompt and type:

```bash
rustc --version
```

You should see the latest stable version number, along with the corresponding commit hash and commit date, displayed in the following format:

```bash
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

If you see this, Rust is installed successfully!

> Translator: Congratulations! (Applause should be given here!)

If not, follow the instructions below to check if Rust is in your `%PATH%` system variable.

In Windows CMD, use the command:

```powershell
echo %PATH%
```

In PowerShell, use the command:

```powershell
echo $env:Path
```

In Linux and macOS, use the command:

```bash
echo $PATH
```

If everything is correct and Rust still doesn't work, there are many places to go for help. The easiest is the `#beginners` channel on the [Rust Official Discord][discord]. Here you can chat with other Rustaceans (a self-deprecating name for Rust users) and ask for help. Other great resources include the [user forum][users] and [Stack Overflow][stackoverflow].

> Translator's note: The primary language of these resources is English.

## Update and Uninstall

Once you've installed Rust with `rustup`, it's easy to update to the latest version by running the following update script from the command line:

```bash
rustup update
```

To uninstall Rust and `rustup`, run the following uninstall script from the command line:

```bash
rustup self uninstall
```

## Local Docs

The installer also comes with a local copy of the documentation for offline reading. Run `rustup doc` to view the local documentation in your browser.

If you're ever unsure about the purpose and usage of a type or function in the standard library, consult the application programming interface (API) documentation!

[otherinstall]: https://forge.rust-lang.org/infra/other-installation-methods.html
[install]: https://www.rust-lang.org/tools/install
[visualstudio]: https://visualstudio.microsoft.com/downloads/
[discord]: https://discord.gg/rust-lang
[users]: https://users.rust-lang.org/
[stackoverflow]: https://stackoverflow.com/questions/tagged/rust

{% /article %}

{% article i18n="es" %}

# Instalación de óxido

El primer paso es instalar Rust. Descargaremos Rust usando Rustup, una herramienta de línea de comandos para administrar versiones de Rust y herramientas relacionadas. Necesitará una conexión a Internet para descargar.

> Nota: Si prefiere no utilizar Rustup por algún motivo, consulte la [Página de instalación alternativa de Rust] [otra instalación] para conocer otras opciones de instalación.

Los siguientes pasos instalan la última versión estable del compilador de Rust. La estabilidad de Rust garantiza que todos los ejemplos de este libro continuarán compilando con la última versión de Rust. El resultado puede variar ligeramente entre versiones, ya que Rust suele mejorar los mensajes de error y. Advertencias. Dicho esto, cualquiera de las últimas versiones estables de Rust instaladas siguiendo estos pasos debería funcionar con el contenido de este libro.

> **Notación de línea de comando**
>
> En este capítulo y a lo largo del libro, mostraremos los comandos que usa en la terminal. Todas las líneas que escribe en la terminal comienzan con `$`. No necesita escribir el carácter `$`; El carácter `$` que se muestra aquí indica la línea de comandos y solo se usa para indicar el comienzo de cada línea de comando. Las líneas que no comienzan con `$` generalmente muestran el resultado de un comando anterior. los ejemplos usan `>` en lugar de `$`.

## Instale `rustup` en Linux o macOS

Si está utilizando Linux o macOS, abra una terminal y escriba el siguiente comando:

```bash
curl --proto '=https' --tlsv1.3 https://sh.rustup.rs -sSf |
```

Este comando descarga un script y comienza a instalar la herramienta `rustup`, que instala la última versión estable de Rust. Es posible que se le solicite su contraseña. Si la instalación se realiza correctamente, verá algo como esto:

```text
Rust está instalado ahora.
```

También necesitarás un *enlazador*, que es el programa que utiliza Rust para conectar la salida de su compilación en un solo archivo. Si obtienes errores en el enlazador, intenta instalar un compilador de C, que generalmente incluye. Un enlazador. Un compilador de C también es útil porque algunos paquetes comunes de Rust dependen del código C, por lo que necesitarás uno instalado.

En macOS, puedes obtener el compilador de C ejecutando:

```bash
xcode-select --install
```

Los usuarios de Linux normalmente necesitarán instalar GCC o Clang según la documentación de su distribución. Por ejemplo, si usa Ubuntu, puede instalar el paquete `build-essential`.

## Instalar `rustup` en Windows

En Windows, vaya a [https://www.rust-lang.org/install.html][instalar] y siga las instrucciones para instalar Rust. En algún momento durante la instalación, recibirá un mensaje que explicará por qué es necesario. instale las herramientas de compilación de MSVC para Visual Studio 2013 o posterior. Para obtener las herramientas de compilación, debe instalar [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/).

- "Desarrollo de escritorio con C++",
- SDK de Windows 10 (u 11),
- Paquete de idioma inglés y cualquier otro paquete de idioma que necesite.

El resto de este libro utiliza comandos que funcionan tanto en cmd.exe como en PowerShell. Si existen diferencias específicas, explicaremos cuál usar.

## Solución de problemas

Para verificar que Rust esté instalado correctamente, abra un símbolo del sistema y escriba:

```bash
rustc --version
```

Debería ver el número de la última versión estable, junto con el hash de confirmación y la fecha de confirmación correspondientes, mostrados en el siguiente formato:

```bash
rustc x.y.z (abcabcabc aaaa-mm-dd)
```

Si ve esto, ¡Rust se instaló correctamente!

> Traductor: ¡Felicitaciones! (¡Aquí se deben dar aplausos!)

De lo contrario, siga las instrucciones a continuación para verificar si Rust está en su variable de sistema `%PATH%`.

En Windows CMD, use el comando:

```powershell
echo %PATH%
```

En PowerShell, use el comando:

```powershell
echo $env:Path
```

En Linux y macOS, use el comando:

```bash
echo $PATH
```

Si todo está correcto y Rust aún no funciona, hay muchos lugares a los que acudir para obtener ayuda. El más fácil es el canal `#beginners` en [Rust Official Discord][discord]. Aquí puedes chatear con otros Rustaceanos (un). nombre autodespreciativo para los usuarios de Rust) y solicite ayuda. Otros recursos excelentes incluyen el [foro de usuarios][usuarios] y [Stack Overflow][stackoverflow].

> Nota del traductor: el idioma principal de estos recursos es el inglés.

## Actualizar y desinstalar

Una vez que haya instalado Rust con `rustup`, es fácil actualizar a la última versión ejecutando el siguiente script de actualización desde la línea de comando:

```bash
rustup update
```

Para desinstalar Rust y `rustup`, ejecute el siguiente script de desinstalación desde la línea de comando:

```bash
rustup self uninstall
```

## Documentos locales

El instalador también viene con una copia local de la documentación para lectura sin conexión. Ejecute `rustup doc` para ver la documentación local en su navegador.

Si alguna vez no está seguro del propósito y uso de un tipo o función en la biblioteca estándar, consulte la documentación de la interfaz de programación de aplicaciones (API).

[otra instalación]: https://forge.rust-lang.org/infra/other-installation-methods.html
[instalar]: https://www.rust-lang.org/tool

{% /article %}