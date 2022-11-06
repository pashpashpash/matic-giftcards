/* eslint-disable flowtype/require-return-type */
// @flow
import React from 'react';
import PropTypes from 'prop-types';
import s from './index.less';
import Constants from '../../constants';
import TransactionStatusDisplay from '../TransactionStatusDisplay';
import Go from '../Go';
import Util from '../../Utils';


import {
    RedeemableInfo,
    RedeemableTheme,
} from '../../../protobuf/redeemable_pb';
import { RedeemableInfo$AsClass } from '../../../protobuf/redeemable_pb.flow';

import { useWeb3React } from '@web3-react/core';



const warningMessage =
    'Are you sure you want to exit this page? You will lose your Redeemable NFT unless you save it before exiting the page.';

type GiftDepositProps = {
        giftCardAmount: number,
};
// eslint-disable-next-line complexity
const RedeemableCreationWidget = (props: GiftDepositProps) => {
    const web3react = useWeb3React();

    const { account, library, chainId } = web3react;


    const [txHash, setTxHash] = React.useState(null);
    const [numConfirmations, setNumConfirmations] = React.useState(0);
    const [redeemableKey, setRedeemableKey] = React.useState(null);
    const [secretAccount, setSecretAccount] = React.useState(null);
    const [creationTxStatus, setCreationTxStatuses] = React.useState("idle");

    React.useEffect(() => {
        window.onbeforeunload = e => {
            e = e || window.event;
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = warningMessage;
            }
            // For Safari
            return warningMessage;
        };

        return () => {
            window.onbeforeunload = undefined;
        };
    }, []);



    const handleCreate = React.useCallback(async () => {

    }, []);

    const handleCopy = React.useCallback(text => {
        navigator.clipboard.writeText(text);
    }, []);

    const redeemableKeyElement = redeemableKey && (
        <div>{`${redeemableKey.slice(0, 4)}...${redeemableKey.slice(
            redeemableKey.length - 6,
            redeemableKey.length - 1
        )}`}</div>
    );


    let buttonText = 'Create';
    if (
        creationTxStatus === 'pending' ||
        creationTxStatus === 'awaiting-send'
    ) {
        buttonText = 'Waiting...';
    } else if (creationTxStatus === 'error') {
        buttonText = 'Error';
    } else if (creationTxStatus === 'confirmed') {
        buttonText = 'View Redeemable';
    }

    return (
        <div className={s.redeemableWidgetWrapper}>
            <div className={s.header}>
                <div className={s.details}>
                    <div>Redeemable Gift Card: {props.giftCardAmount}</div>
                    <div className={s.options}>
                        {'vibrant'}
                    </div>
                </div>
                {(creationTxStatus === 'confirmed' ||
                    creationTxStatus === 'error' ||
                    creationTxStatus === 'pending') &&
                    redeemableKey && (
                        <div
                            className={s.linkWrapper}
                            onClick={handleCopy.bind(
                                this,
                                window.location.host + '/r/' + redeemableKey
                            )}>
                            {redeemableKeyElement}
                            <div className={[s.copyIcon, s.copy].join(' ')} />
                        </div>
                    )}
            </div>
            <div className={s.redeemableWidget}>
                <div
                    className={s.avatar}
                    style={{ backgroundImage: `url(/img/logos/redeemable.svg)` }}
                />
                <TransactionStatusDisplay
                    txStatus={creationTxStatus}
                    {...{ txHash, numConfirmations }}
                />
                {creationTxStatus !== 'confirmed' && (
                    <div
                        className={[
                            s.button,
                            s.createButton,
                            s.vibrant,
                            (creationTxStatus === 'pending' ||
                                creationTxStatus === 'awaiting-send') &&
                                s.pending,
                            creationTxStatus === 'error' && s.error,
                            creationTxStatus === 'error' && s.disabled,
                        ].join(' ')}
                        onClick={
                            creationTxStatus == null ? handleCreate : null
                        }>
                        <div className={[s.actionText].join(' ')}>
                            {buttonText}
                        </div>
                    </div>
                )}
                {creationTxStatus === 'confirmed' && redeemableKey && (
                    <Go
                        external
                        to={'/r/' + redeemableKey}
                        className={s.clickableKey}
                        data-category="View Redeemable"
                        data-action={'Redemption ' + redeemableKey}>
                        <div
                            className={[
                                s.button,
                                s.createButton,
                                s.confirmed,
                            ].join(' ')}>
                            <div className={[s.actionText].join(' ')}>
                                {buttonText}
                            </div>
                        </div>
                    </Go>
                )}
            </div>
            {creationTxStatus === 'error' && (
                <div className={s.disclaimer}>
                    Oh no! Looks like something went wrong. Please go ahead and
                    save your generated redeemable key just in case. If your
                    transaction failed, the key will fail as well. However if
                    the tx succeeded, you should be able to use this key for a
                    successful redemption.
                </div>
            )}
            {creationTxStatus === 'pending' && (
                <div className={s.disclaimer}>
                    Please don't reload this page. If the transaction succeeds,
                    your redeemable link will be valid. Although the transaction
                    has not been confirmed, you can pre-emptively save your
                    Redeemable below, just in case.
                </div>
            )}
        </div>
    );
};

export default RedeemableCreationWidget;
