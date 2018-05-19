[![English](https://thumb.ibb.co/jDrVkd/gb.png)](README.md) [![Russian](https://thumb.ibb.co/cjYMrJ/ru.png)](README.ru.md)    

# ut-school-js
Библиотека для направления https://github.com/u-transnet/UT-SCHOOL реализующая взаимодействие с blockchain'ом и механику данного направления.

## Установка

```
git clone https://github.com/u-transnet/utschool-js
cd utschool-js
npm install
```

# Api
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

# CLI
Интерфейс командной строки реализованный на nodejs, предназначенный для обращения к методам api из консоли, который находится в файле build/app.js


Получение справки
```
node build/cli.js --help

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

Запуск CLI
```
node build/cli.js -l exampleLogin -k exampleKey -u wss://example.com
> help // Запрос доступных команд
> studentApi.getLectures // Вызов команды без аргументов
> studentApi.getLectureStats -l uts-bch-intro // Вызов команды с аргументами
```



## Связанные проекты
- [bitsharesjs](https://github.com/bitshares/bitsharesjs)
- [bitsharesjs-ws](https://github.com/bitshares/bitsharesjs-ws)

## Сотрудничество
Мы будем рады вашей помощи в развитии проекта! Откройте [CONTRIBUTING.ru.md](CONTRIBUTING.ru.md) для того, чтобы узнать чем Вы можете поможете помочь проекту и как присоединиться

## Лицензия
Проект использует MIT лицензию. Откройте [LICENSE](LICENSE) для подробностей
