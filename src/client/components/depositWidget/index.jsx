/* eslint-disable flowtype/require-return-type */
// @flow
import React from 'react';
import s from './index.less';
import Constants from '../../Constants';
import TransactionStatusDisplay from '../TransactionStatusDisplay';
import Go from '../Go';
import RedeemableCard from '../RedeemableCard';

import { useWeb3React } from '@web3-react/core';

// eslint-disable-next-line flowtype/no-weak-types
const estimateGasPrice = (web3: any): any =>
    // eslint-disable-next-line flowtype/no-weak-types
    new Promise((resolve: any, reject: any) => {
        web3.eth
            .getGasPrice()
            .then((gas: number) => {
                const goodGas = Math.max(
                    35000000000,
                    Math.floor(parseInt(gas, 10) * 1.2 + 5000000000)
                );
                console.log('GAS: ' + goodGas);
                resolve(goodGas);
            })
            .catch((err: Error) => {
                console.log('web3 Gas error', err);
                reject(err);
            });
    });

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
    const [creationTxStatus, setCreationTxStatuses] = React.useState(null);

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
        if (!library) return;
        const redeemableContract = new library.eth.Contract(
            Constants.contracts.RedeemableNative.abi,
            Constants.addresses.RedeemableNative
        );
        // check the wallet balance before trying to create.

        const depositAccount = library.eth.accounts.create();
        const encodedRedeemerAddress = library.eth.abi.encodeParameter(
            'address',
            depositAccount.address
        );

        console.log('[RECOVERY] Generated Redeemable code:', {
            reedemableCode: depositAccount.privateKey,
            redeemableUrl: '/r/' + depositAccount.privateKey,
        });

        if (redeemableContract != null) {
            if (creationTxStatus !== 'awaiting-send') {
                setCreationTxStatuses('awaiting-send');
            }
            setRedeemableKey(depositAccount.privateKey);
            setSecretAccount(depositAccount.address);
            console.log(
                'RECOVERY KEY: ',
                depositAccount.privateKey,
                'secretAccount: ',
                depositAccount.address
            );
            const gasPrice = await estimateGasPrice(library);
            console.log(redeemableContract);
            console.log(
                '[CreationWidget] Depositing matic into gift card',
                account,
                'redeemableContract.options.address: ',
                redeemableContract.options.address,
                'amount to deposit: ',
                BigInt(
                    props.giftCardAmount * Constants.units.weiInEth
                ).toString(),
                encodedRedeemerAddress,
                gasPrice
            );
            library.eth
                .sendTransaction({
                    from: account,
                    to: Constants.addresses.RedeemableNative,
                    value: BigInt(
                        props.giftCardAmount * Constants.units.weiInEth
                    ).toString(),
                    data: encodedRedeemerAddress,
                    gasPrice,
                })
                .on('error', e => {
                    if (creationTxStatus !== 'error') {
                        setCreationTxStatuses('error');
                    }
                })
                .on('transactionHash', transactionHash => {
                    setTxHash(transactionHash);
                    if (creationTxStatus !== 'pending') {
                        setCreationTxStatuses('pending');
                    }
                    // Create the database entry for tracking purposes
                })
                .on('receipt', receipt => {})
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (creationTxStatus !== 'confirmed') {
                        setCreationTxStatuses('confirmed');
                        setNumConfirmations(confirmationNumber);
                    }
                })
                .then(r => {})
                .catch(e => {
                    if (creationTxStatus !== 'error') {
                        setCreationTxStatuses('error');
                    }
                });
        }
    }, [library, creationTxStatus, account, props.giftCardAmount]);

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
    console.log(creationTxStatus);
    return (
        <div className={s.redeemableWidgetWrapper}>
            <div className={s.header}>
                <div className={s.details}>
                    <div>Deposit to create Redeemable GIFT</div>
                    <div className={s.options}>{'Options: vibrant'}</div>
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
                <div className={s.leftSide}>
                    <RedeemableCard
                        back={true}
                        slotAmount={parseFloat(props.giftCardAmount).toFixed(2)}
                    />
                </div>
                <div className={s.rightSide}>
                    <TransactionStatusDisplay
                        txStatus={creationTxStatus}
                        txHash={txHash}
                        numConfirmations={numConfirmations}
                    />
                    {creationTxStatus !== 'confirmed' && (
                        <div
                            className={[
                                s.themeButton,
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
