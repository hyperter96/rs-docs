# 摘要
- 本课程探讨了我们在反序列化账户数据课程中使用的 RPC 调用的一些功能。
- 为了节省计算时间，您可以通过筛选返回只包含公钥数组的账户来获取大量账户数据，而不获取它们的数据。
- 一旦您有了经过筛选的公钥列表，就可以对其进行排序并获取其所属的账户数据。

# 概述

你可能已经注意到，在上一课中，虽然我们可以获取和显示账户数据列表，但我们无法精确控制要获取多少个账户或它们的顺序。在本课中，我们将了解一些 `getProgramAccounts` 函数的配置选项，这些选项将使我们能够实现诸如分页、账户排序和筛选等功能。

## 使用 `dataSlice` 仅获取所需数据

想象一下我们过去课程中开发的电影评论应用有四百万条电影评论，平均每条评论大小为 500 字节。这将使得所有评论账户的总下载量超过 2GB 。这绝对不是您希望前端每次刷新页面都要下载的东西。

幸运的是，您用来获取所有账户的 `getProgramAccounts` 函数接受一个配置对象作为参数。其中一个配置选项是 `dataSlice` ，它允许您提供两件事：

- `offset` 从数据缓冲区开始的偏移量开始切片
- `length` 从提供的偏移量开始返回的字节数

当您在配置对象中包含一个 `dataSlice` 时，该函数将只返回您指定的数据缓冲区的子集。

## 分页账户

这在分页时非常有帮助。如果您想展示所有账户的列表，但账户众多到您不想一次性拉取所有数据，您可以使用 `{ offset: 0, length: 0 }` 的 `dataSlice` 来抓取所有账户但不抓取它们的数据。然后，您可以将结果映射到一个账户键列表，只在需要时才抓取它们的数据。

```tsx
const accountsWithoutData = await connection.getProgramAccounts(
  programId,
  {
    dataSlice: { offset: 0, length: 0 }
  }
)

const accountKeys = accountsWithoutData.map(account => account.pubkey)
```

有了这些密钥列表，你可以使用 `getMultipleAccountsInfo` 方法按“页”获取账户数据。

```tsx
const paginatedKeys = accountKeys.slice(0, 10)
const accountInfos = await connection.getMultipleAccountsInfo(paginatedKeys)
const deserializedObjects = accountInfos.map((accountInfo) => {
  // 将反序列化账户信息的逻辑放在这里。
})
```

## 排序账户

`dataSlice` 选项在您需要在分页时对账户列表进行排序时也很有帮助。您仍然不想一次性抓取所有数据，但您确实需要所有的键和一个方法来预先排序它们。在这种情况下，您需要了解账户数据的布局，并配置数据切片，以便只包含您需要用于排序的数据。

例如，您可能有一个存储如下联系信息的账户：

- `initialized` 作为布尔值
- `phoneNumber` 作为一个无符号的64位整数
- `firstName` 作为一个字符串
- `secondName` 作为一个字符串

如果您想根据用户的名字按字母顺序对所有账户键进行排序，您需要找出名字开始的偏移量。第一个字段 `initialized` 占用第一个字节，然后 `phoneNumber` 再占用 8 个字节，所以 `firstName` 字段从偏移量 `1 + 8 = 9` 开始。然而， `borsh` 中的动态数据字段使用前 4 个字节来记录数据的长度，所以我们可以再跳过 4 个字节，使偏移量为 13。

然后您需要确定数据切片的长度。由于长度是可变的，我们在抓取数据之前无法确切知道。但是您可以选择一个足够大以覆盖大多数情况且足够小以不会成为抓取的负担的长度。对于大多数名字来说， 15 个字节已经足够了，即使是百万用户，下载量也会相对较小。

一旦您使用给定的数据切片抓取了账户，您可以在将其映射到公钥数组之前使用 `sort` 方法对数组进行排序。

```tsx
const accounts = await connection.getProgramAccounts(
  programId,
  {
    dataSlice: { offset: 13, length: 15 }
  }
)

  accounts.sort( (a, b) => {
    const lengthA = a.account.data.readUInt32LE(0)
    const lengthB = b.account.data.readUInt32LE(0)
    const dataA = a.account.data.slice(4, 4 + lengthA)
    const dataB = b.account.data.slice(4, 4 + lengthB)
    return dataA.compare(dataB)
  })

const accountKeys = accounts.map(account => account.pubkey)
```

请注意，在上面的代码片段中，我们并没有直接比较给定的数据。这是因为对于像字符串这样的动态大小类型，Borsh 在开始时放置一个无符号的 32 位（ 4 字节）整数，以指示表示该字段的数据的长度。因此，要直接比较名字，我们需要获取每个名字的长度，然后创建一个具有 4 字节偏移量和适当长度的数据切片。

## 使用过滤器只检索特定账户

限制每个账户接收的数据量是很好的，但如果您只想返回符合特定条件的账户而不是所有账户呢？这就是 `filters` 配置选项的用武之地。这个选项是一个数组，可以包含以下匹配的对象：

- `memcmp` 用于比较在特定偏移量处的程序账户数据与提供的一系列字节。字段包括：
    - `offset` 比较数据前进入程序账户数据的偏移量
    - `bytes` 一个表示要匹配的数据的base-58编码字符串；限制少于129字节
- `dataSize` 将程序账户数据的长度与提供的数据大小进行比较

这些让您可以基于匹配数据和/或总数据大小进行筛选。

例如，您可以通过包含一个 `memcmp` 过滤器来搜索联系人列表：

```tsx
async function fetchMatchingContactAccounts(connection: web3.Connection, search: string): Promise<(web3.AccountInfo<Buffer> | null)[]> {
  const accounts = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          memcmp:
            {
              offset: 13,
              bytes: bs58.encode(Buffer.from(search))
            }
        }
      ]
    }
  )
}
```

在上面的例子中需要注意两点：

1. 我们将偏移量设置为13，因为我们之前确定了数据布局中 `firstName` 的偏移量为 9 ，并且我们想要额外跳过指示字符串长度的前 4 个字节。
2. 我们正在使用第三方库 `bs58` 对搜索词进行 base-58 编码。您可以使用 `npm install bs58` 来安装它。

# 实验

还记得我们在过去两课中一起工作的电影评论应用吗？我们将通过分页评论列表，对评论进行排序使其不那么随机，并添加一些基本的搜索功能来为其增添一些趣味。如果您没有看过之前的课程也没关系——只要您具备必要的知识，即使您还没有在这个特定项目中工作过，也应该能够跟随实验室内容。

![movie-review-fronted](../../assets/movie-reviews-frontend.png)

## 1. 下载启动代码

如果您没有完成上一课的实验室作业，或者只是想确保自己没有错过任何内容，您可以下载 ![启动代码](https://github.com/Unboxed-Software/solana-movie-frontend/tree/solution-deserialize-account-data).

项目是一个相当简单的 `Next.js` 应用程序。它包括我们在钱包课程中创建的 `WalletContextProvider` ，一个用于显示电影评论的 `Card` 组件，一个显示评论列表的 `MovieList` 组件，一个用于提交新评论的Form组件，以及一个包含 `Movie` 对象类定义的 `Movie.ts` 文件。

## 为评论添加分页

首先，让我们创建一个空间来封装获取账户数据的代码。创建一个新文件 `MovieCoordinator.ts` 并声明一个 `MovieCoordinator` 类。然后让我们将 `MovieList` 中的 `MOVIE_REVIEW_PROGRAM_ID` 常量移动到这个新文件中，因为我们将移动所有对它的引用。

```tsx
const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export class MovieCoordinator { }
```

现在我们可以使用 `MovieCoordinator` 来创建一个分页实现。在我们开始之前，有一点需要注意：这将是尽可能简单的分页实现，以便我们可以专注于与 `Solana` 账户交互的复杂部分。对于生产应用程序，您可以并且应该做得更好。

既然这个问题已经解决，让我们创建一个静态属性 `accounts` ，类型为 `web3.PublicKey[]` ，一个静态函数 `prefetchAccounts(connection: web3.Connection)` ，以及一个静态函数 `fetchPage (connection: web3.Connection, page: number, perPage: number): Promise<Movie[]>` 。您还需要导入 `@solana/web3.js` 和 `Movie` 。

```tsx
import * as web3 from '@solana/web3.js'
import { Movie } from '../models/Movie'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export class MovieCoordinator {
  static accounts: web3.PublicKey[] = []

  static async prefetchAccounts(connection: web3.Connection) {

  }

  static async fetchPage(connection: web3.Connection, page: number, perPage: number): Promise<Movie[]> {

  }
}
```

预取所有没有数据的账户是分页的关键。让我们填写 `prefetchAccounts` 的主体来做到这一点，并将检索到的公钥设置为静态 `accounts` 属性。

```tsx
static async prefetchAccounts(connection: web3.Connection) {
  const accounts = await connection.getProgramAccounts(
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    {
      dataSlice: { offset: 0, length: 0 },
    }
  )

  this.accounts = accounts.map(account => account.pubkey)
}
```

现在，让我们来填写 `fetchPage` 方法。首先，如果账户还没有被预取，则我们需要去做这个操作。接着，我们可以获取与请求的页面相对应的账户公钥，并调用 `connection.getMultipleAccountsInfo` 。最后，我们反序列化账户数据并返回相应的 `Movie` 对象。

```tsx
static async fetchPage(connection: web3.Connection, page: number, perPage: number): Promise<Movie[]> {
  if (this.accounts.length === 0) {
    await this.prefetchAccounts(connection)
  }

  const paginatedPublicKeys = this.accounts.slice(
    (page - 1) * perPage,
    page * perPage,
  )

  if (paginatedPublicKeys.length === 0) {
    return []
  }

  const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

  const movies = accounts.reduce((accum: Movie[], account) => {
    const movie = Movie.deserialize(account?.data)
    if (!movie) {
      return accum
    }

    return [...accum, movie]
  }, [])

  return movies
}
```

完成这些后，我们可以重新配置 `MovieList` 来使用这些方法。在 `MovieList.tsx` 中，靠近现有的 `useState` 调用处添加 `const [page, setPage] = useState(1)` 。然后，更新 `useEffect` 来调用 `MovieCoordinator.fetchPage` ，而不是内联地获取账户。

```tsx
const { connection } = useConnection()
const [movies, setMovies] = useState<Movie[]>([])
const [page, setPage] = useState(1)

useEffect(() => {
  MovieCoordinator.fetchPage(
    connection,
    page,
    10
  ).then(setMovies)
}, [page])
```

最后，我们需要在列表底部添加按钮来导航到不同的页面：

```tsx
return (
  <div>
    {
      movies.map((movie, i) => <Card key={i} movie={movie} /> )
    }
    <Center>
      <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
        {
          page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
        }
        <Spacer />
        {
          MovieCoordinator.accounts.length > page * 2 &&
            <Button onClick={() => setPage(page + 1)}>Next</Button>
        }
      </HStack>
    </Center>
  </div>
)
```

此时，你应该能够运行项目并在各个页面之间点击切换了！

## 3. 按标题字母顺序排序评论

如果你观察评论，你可能会注意到它们没有按照任何特定的顺序排列。我们可以通过将恰好足够的数据添加回我们的数据片段中来解决这个问题，以帮助我们进行一些排序。电影评论数据缓冲区中的各种属性如下所示：

- `initialized` - 无符号8位整数；1字节
- `rating` - 无符号8位整数；1字节
- `title` - 字符串；未知字节数
- `description` - 字符串；未知字节数

基于此，我们需要提供给数据片段以访问 `title` 的偏移量是 2 。然而，长度是不确定的，所以我们可以提供看似合理的长度。我会坚持使用 18 ，因为这将覆盖大多数标题的长度，而不会每次都获取太多数据。

一旦我们在 `getProgramAccounts` 中修改了数据片段，我们接下来需要实际对返回的数组进行排序。为此，我们需要比较实际对应于 `title` 的数据缓冲区的部分。`Borsh` 中一个动态字段的前4个字节用于存储字段的长度（以字节为单位）。所以在任何给定的按我们上面讨论的方式切片的缓冲区 `data` 中，字符串部分是 `data.slice(4, 4 + data[0])` 。

现在我们已经思考过这个问题，让我们修改 `MovieCoordinator` 中 `prefetchAccounts` 的实现：

```tsx
static async prefetchAccounts(connection: web3.Connection, filters: AccountFilter[]) {
  const accounts = await connection.getProgramAccounts(
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    {
      dataSlice: { offset: 2, length: 18 },
    }
  )

  accounts.sort( (a, b) => {
    const lengthA = a.account.data.readUInt32LE(0)
    const lengthB = b.account.data.readUInt32LE(0)
    const dataA = a.account.data.slice(4, 4 + lengthA)
    const dataB = b.account.data.slice(4, 4 + lengthB)
    return dataA.compare(dataB)
  })

  this.accounts = accounts.map(account => account.pubkey)
}
```

就这样，你应该就能够运行应用并看到按字母顺序排列的电影评论列表。

## 添加搜索

我们要做的最后一件事来改善这个应用是添加一些基本的搜索功能。让我们给 `prefetchAccounts` 添加一个 `search` 参数，并重新配置函数的主体以使用它。

我们可以使用 `getProgramAccounts的config` 参数的 `filters` 属性来根据特定数据过滤账户。 `title` 字段的偏移量是 2 ，但标题的前 4 个字节是标题的长度，所以字符串本身的实际偏移量是 6 。记住，字节需要被 base 58 编码，所以让我们安装并导入 `bs58` 。

```tsx
import bs58 from 'bs58'

...

static async prefetchAccounts(connection: web3.Connection, search: string) {
  const accounts = await connection.getProgramAccounts(
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    {
      dataSlice: { offset: 2, length: 18 },
      filters: search === '' ? [] : [
        {
          memcmp:
            {
              offset: 6,
              bytes: bs58.encode(Buffer.from(search))
            }
        }
      ]
    }
  )

  accounts.sort( (a, b) => {
    const lengthA = a.account.data.readUInt32LE(0)
    const lengthB = b.account.data.readUInt32LE(0)
    const dataA = a.account.data.slice(4, 4 + lengthA)
    const dataB = b.account.data.slice(4, 4 + lengthB)
    return dataA.compare(dataB)
  })

  this.accounts = accounts.map(account => account.pubkey)
}
```

现在，向 `fetchPage` 添加一个 `search` 参数，并更新它对 `prefetchAccounts` 的调用以传递它。我们还需要向 `fetchPage` 添加一个 `reload` 布尔参数，以便每次搜索值改变时我们可以强制刷新账户的预取。

```tsx
static async fetchPage(connection: web3.Connection, page: number, perPage: number, search: string, reload: boolean = false): Promise<Movie[]> {
  if (this.accounts.length === 0 || reload) {
    await this.prefetchAccounts(connection, search)
  }

  const paginatedPublicKeys = this.accounts.slice(
    (page - 1) * perPage,
    page * perPage,
  )

  if (paginatedPublicKeys.length === 0) {
    return []
  }

  const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

  const movies = accounts.reduce((accum: Movie[], account) => {
    const movie = Movie.deserialize(account?.data)
    if (!movie) {
      return accum
    }

    return [...accum, movie]
  }, [])

  return movies
}
```

有了这个设置，让我们更新 `MovieList` 中的代码以正确调用它。

首先，在其他 `useState` 调用附近添加 `const [search, setSearch] = useState('')` 。然后在 `useEffect` 中更新对 `MovieCoordinator.fetchPage` 的调用，传递 `search` 参数并在 `search !== ''` 时重新加载。

```tsx
const { connection } = useConnection()
const [movies, setMovies] = useState<Movie[]>([])
const [page, setPage] = useState(1)
const [search, setSearch] = useState('')

useEffect(() => {
  MovieCoordinator.fetchPage(
    connection,
    page,
    2,
    search,
    search !== ''
  ).then(setMovies)
}, [page, search])
```

最后，添加一个搜索栏，用于设置 `search` 的值：

```tsx
return (
  <div>
    <Center>
      <Input
        id='search'
        color='gray.400'
        onChange={event => setSearch(event.currentTarget.value)}
        placeholder='Search'
        w='97%'
        mt={2}
        mb={2}
      />
    </Center>

  ...

  </div>
)
```

就是这样！应用程序现在拥有了有序的评论、分页和搜索功能。

这里有很多内容需要消化，但你已经做到了。如果你需要更多时间来理解这些概念，随时重读对你来说最具挑战性的部分，并且/或者看看 [代码](https://github.com/Unboxed-Software/solana-movie-frontend/tree/solution-paging-account-data)。

# 挑战

现在轮到你自己尝试了。使用上一课的“学生介绍”应用程序，添加分页、按姓名字母顺序排序以及按姓名搜索的功能。

![student-intros-frontend](../../assets/student-intros-frontend.png)

1. 你可以从零开始构建这个项目，也可以下载起始代码。
2. 通过预取没有数据的账户来向项目添加分页功能，然后仅在需要时获取每个账户的账户数据。
3. 按姓名字母顺序对在应用中显示的账户进行排序。
4. 添加按学生姓名搜索介绍的功能。

这是具有挑战性的。 如果遇到困难, 请随时参考 [答案](https://github.com/Unboxed-Software/solana-student-intros-frontend/tree/solution-paging-account-data)。完成了模块1！你的体验如何？欢迎[分享一些快速反馈](https://airtable.com/shrOsyopqYlzvmXSC?prefill_Module=Module%201), 这样我们就可以继续改进课程！

和往常一样，如果你愿意，可以在这些挑战中发挥创造力，并超越指示。

## 完成实验了吗？

将你的代码推送到 GitHub，并 [告诉我们你对这节课的看法](https://form.typeform.com/to/IPH0UGz7#answers-lesson=9342ad0a-1741-41a5-9f68-662642c8ec93)!
