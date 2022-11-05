// @flow
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect } from './connectors';
import { useDispatch } from 'react-redux';

import Constants from '../../constants';

import s from './index.less';


const prettyEthAccount = (account: string, chunkSize: ?number): string => {
    chunkSize = chunkSize || 4;
    const len = account.length;
    return (
        account.slice(0, chunkSize + 2) +
        '...' +
        account.slice(len - chunkSize)
    );
};

const AccountNav = (): React.Node => {
    const web3react = useWeb3React();
    const tried = useEagerConnect();
    const { account, chainId } = web3react;



    const handleClick = (e: SyntheticEvent<>): boolean => {
        // todo handle login
        return true;
    };

    let prettyAccount = 'Connect Wallet';

    if (account != null) {
        prettyAccount = prettyEthAccount(account, 6);
    }

    const slideInStyle = {
        right: '-400px',
    };

    const network = Constants.networks[chainId];
    const transactions = [{ tx: '1' }];

    return (
        <div className={s.accountNavWrap}>
            <div className={s.main}>
                <div
                    className={s.accountNav}
                    onClick={handleClick}
                    data-category="Header Account Nav"
                    data-action={'Account ' + account}>
                    <div className={s.account}>{prettyAccount}</div>
                </div>
            </div>
            <div
                className={[s.subnav, s.network].join(' ')}
                style={slideInStyle}>
                Network: {network || '...'}
            </div>
        </div>
    );
};

export default AccountNav;
