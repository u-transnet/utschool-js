/**
 * Created by superpchelka on 23.02.18.
 */

import {PrivateKey} from "bitsharesjs";
import { encode, decode } from 'bs58';

class Account{

    constructor(account, privateKeyWif){
        this.name=account;
        this.setPrivateKey(privateKeyWif);
    }

    setPrivateKey(privateKeyWif){
        this.privateKey = privateKeyWif?PrivateKey.fromWif(privateKeyWif):null;
    }

}

export {Account}