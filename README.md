[![English](https://thumb.ibb.co/jDrVkd/gb.png)](README.md) [![Russian](https://thumb.ibb.co/cjYMrJ/ru.png)](README.ru.md)    

# ut-school-js
Библиотека для направления https://github.com/u-transnet/UT-SCHOOL реализующая взаимодействие с blockchain'ом и механику данного направления.

## Installation

```
git clone https://github.com/u-transnet/utschool-js
cd utschool-js
npm install
```

## Api
Реалализация основных механики взаимодействия с blockchain'ом, которое находится в файле build/app.js

Инициализация API с приватным ключом.
```
import Api from "utschool-js";

let nodeUrl = 'wss://example.com'; // Url ноды Bitshares
let accountName = 'example'; // Имя учетной записи
let privateKey = 'examplePriv'; // Приватный ключ

Api.init(nodeUrl, accountName, privateKey)
.then((api)=>{
    api.studentApi.getLectures().then((resp)=>{
      console.log(resp);
    }).catch((error)=>{
      console.log(error);
    });
}); 

```


Инициализация API с отложенной установкой приватного ключа.
```
import Api from "utschool-js";

let nodeUrl = 'wss://example.com'; // Url ноды Bitshares
let accountName = 'example'; // Имя учетной записи
let privateKey = null; // Приватный ключ

Api.init(nodeUrl, accountName, privateKey)
.then((api)=>{
    api.studentApi.getLectures().then((resp)=>{
      console.log(resp);
    }).catch((error)=>{
      console.log(error);
    });


    ....

    let privateKey = getPrivateKeyFromTheSky();
    api.setPrivateKey(privateKey);
  
}); 

```

## CLI
Интерфейс командной строки реализованный на nodejs, предназначенный для обращения к методам api из консоли, который находится в файле build/app.js


Получение справки
```
node dist/cli.js --help

Output:
  Usage: cli [options]


  Options:

    -V, --version                  output the version number
    -l, --login <login>            login of your bitshares account
    -p, --password  [password]     password of your bitshares account
    -k, --privateKey [privateKey]  private key of your bitshares account
    -u, --url <nodeUrl>            url of node to connect
    -h, --help                     output usage information

```

## Start CLI
```
node dist/cli.js -l exampleLogin -k exampleKey -u wss://example.com
> help // Запрос доступных команд
> studentApi.getLectures // Вызов команды без аргументов
> studentApi.getLectureStats -l uts-bch-intro // Вызов команды с аргументами
```



## Related projects
- [bitsharesjs](https://github.com/bitshares/bitsharesjs)
- [bitsharesjs-ws](https://github.com/bitshares/bitsharesjs-ws)

## Contributing
We'd love to have your helping hand on our project! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## License
Project is under the MIT license. See [LICENSE](LICENSE) for more information.