/**
 * Created by superpchelka on 23.02.18.
 */

import {Account} from '../common/Account'
import {StudentApi} from "./StudentApi";
import {TeacherApi} from "./TeacherApi";
import {BlockchainApi} from "./BlockchainApi"
import {Login} from "bitsharesjs";
import {utSchoolFaucetAddress, utSchoolFaucet} from "../common/Configs";
import Request from "request-promise";


class Api{


    /**
     * @desc initialize api for interacting with blockchain
     * @param nodeUrl - url of node for connection
     * @param accountName - name of bitshares account
     * @param [privateKey] - private of bitshares account (optional)
     * @return api object
     */
    static init(nodeUrl, accountName, privateKey){
        let api = new Api(accountName, privateKey);
        return new Promise((resolved, rejected)=>{
            BlockchainApi.init(nodeUrl).then(()=>resolved(api)).catch(rejected);
        });
    }

    /**
     * @desc generate public keys and private keys by login and password
     * @param login - login of the bitshares account
     * @param password - password of the bitshares account
     * @return Object{
     *      pubKeys: {active, owner, memo},
     *      privKeys: {active, owner, memo}
     * }
     */
    static generateKeys(login, password){
        return Login.generateKeys(login, password)
    }

    constructor(accountName, privateKey){
        this.account = new Account(accountName, privateKey);
        this.studentApi=new StudentApi(this.account);
        this.teacherApi=new TeacherApi(this.account);
    }

    /**
     * @desc set private key of current user
     * @param privateKey - private key
     */
    setPrivateKey(privateKey){
        this.account.setPrivateKey(privateKey);
    }

    /**
     * @desc register user by login, password
     * @param login - name of the new bitshares account
     * @param password - password for generating bitshares keys
     * @return information about created account
     */
    register(
        login,
        password,
    ) {
        return new Promise((resolve, reject) => {
            let keys = Api.generateKeys(login, password);

            Request(
                {
                    method: "POST",
                    url: utSchoolFaucetAddress,
                    body: {
                        account: {
                            active_key: keys.pubKeys.active,
                            memo_key: keys.pubKeys.memo,
                            owner_key: keys.pubKeys.owner,
                            name: login,
                            referrer: utSchoolFaucet
                        }
                    },
                    json: true
                }
            ).then((resp)=>{
                resolve(resp);
            }).catch(function (err) {
                reject(`Faucet ${utSchoolFaucetAddress} failed. ${err}`);
            });
        });
    }
}

export {Api}