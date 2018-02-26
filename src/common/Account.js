/**
 * Created by superpchelka on 23.02.18.
 */

import {PrivateKey} from "bitsharesjs";

class Account{

    constructor(account, privateKeyWif){
        this.name=account;
        this.privateKey = privateKeyWif?PrivateKey.fromWif(privateKeyWif):null;
    }

    setPrivateKey(privateKey){
        this.privateKey=PrivateKey.fromSeed(privateKey)
    }

}

export {Account}