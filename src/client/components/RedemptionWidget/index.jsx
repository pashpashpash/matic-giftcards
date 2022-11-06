// @flow
import React from 'react';
import PropTypes from 'prop-types';
import s from './index.less';

import { useWeb3React } from '@web3-react/core';

import * as sigUtil from '@metamask/eth-sig-util';
import * as ethUtil from 'ethereumjs-util';
import Constants from '../../Constants';
import TransactionStatusDisplay from '../TransactionStatusDisplay';
import RedeemableCard from '../RedeemableCard';
import Util from '../../Utils';
import ManualRedemption from './manualredemption';
import { portis } from '../AccountNav/connectors';
import Go from '../Go';

const MIN_LOADING_TIME = 500;
const NUM_DECIMALS_DISPLAYED = 2;

const loadingElement = (
    <div className={s.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

const ERROR_PAGE_STRINGS = {
    invalid: `This key is invalid. Please check the url to make sure a key
                    is present to claim your Redeemable. If you think this is a
                    mistake, contact support.`,
    unrecognized: `Oh no! Looks like you're using an unrecognized key. 
                        The key in the URL is formatted correctly, 
                        however we don't recognize it on our backend. 
                        If you think this is a mistake, please contact support.`,
};
const MIN_NUM_CONFIRMATIONS = 6;

const RedemptionWidget = (props: { redemptionKey: string }): React.Node => {
    const { redemptionKey } = props;
    const web3react = useWeb3React();
    const { active, activate, account, library, chainId } = web3react;
    // check if the user is already logged in and show Message sign flow instead.

    const [slotNotActive, setSlotNotActive] = React.useState(null);
    const [slotNotUsed, setSlotNotUsed] = React.useState(null);
    const [slotAmount, setSlotAmount] = React.useState(null);
    const [minLoadingTimeReached, setMinLoadingTimeReached] = React.useState(
        false
    );

    const [txStatus, setTxStatus] = React.useState(null);
    const [txHash, setTxHash] = React.useState(null);
    const [numConfirmations, setNumConfirmations] = React.useState(null);
    const [errorPageMessage, setErrorPageMessage] = React.useState(null);

    React.useEffect(() => {
        if (chainId !== 137 || !library || !account) {
            return;
        }

        console.log('>>>>useeffect params:', { chainId, library, account });
        // on the actual redemption widget page
        if (library != null && redemptionKey != null) {
            const redeemableContract = new library.eth.Contract(
                Constants.contracts.RedeemableNative.abi,
                Constants.addresses.RedeemableNative
            );
            const depositAccount = library.eth.accounts.privateKeyToAccount(
                redemptionKey
            );
            console.log('>>>>getting slot status...', {
                'depositAccount.address': depositAccount.address,
            });

            redeemableContract.methods
                .isSlotActive(depositAccount.address)
                .call()
                .then(r => {
                    setSlotNotActive(!r);
                })
                .catch(console.log);

            redeemableContract.methods
                .slotData(depositAccount.address)
                .call()
                .then(r => {
                    console.log('>>>>SLOT DATA:', { r });
                    setSlotNotUsed(!r.used);

                    if (r.tokenAmount) {
                        setSlotAmount(r.tokenAmount);
                    }
                })
                .catch(console.log);
        }
    }, [chainId, redemptionKey, library, account]);

    React.useEffect(() => {
        setTimeout(() => {
            setMinLoadingTimeReached(true);
        }, MIN_LOADING_TIME);
    });

    const handleRedemption = React.useCallback(() => {
        const depositAccount = library.eth.accounts.privateKeyToAccount(
            redemptionKey
        );
        const redeemableContract = new library.eth.Contract(
            Constants.contracts.RedeemableNative.abi,
            Constants.addresses.RedeemableNative
        );

        redeemableContract.methods
            .getNonce(depositAccount.address)
            .call()
            .then(nonce => {
                const functionSignature = redeemableContract.methods
                    .redeem(depositAccount.address, account)
                    .encodeABI();
                const dataToSign = Constants.getTypedMetaTransactionData({
                    name: 'RedeemableNative',
                    version: '1',
                    chainId: chainId,
                    verifyingContract: redeemableContract.options.address,
                    nonce: nonce,
                    from: depositAccount.address,
                    functionSignature: functionSignature,
                });
                const sig = sigUtil.signTypedData({
                    privateKey: ethUtil.toBuffer(depositAccount.privateKey),
                    data: dataToSign,
                    version: sigUtil.SignTypedDataVersion.V4,
                });
                const { r, s, v } = ethUtil.fromRpcSig(sig);
                setTxStatus('pending');
                console.log('>>>>>>>>> Sending metatx:', {
                    'depositAccount.address': depositAccount.address,
                    sig,
                    functionSignature,
                    r,
                    s,
                    v,
                    account,
                });
                Util.PostAPI.relay
                    .sendMetaTx(
                        depositAccount.address,
                        sig,
                        functionSignature,
                        r,
                        s,
                        v,
                        account
                    )
                    .then(r => {
                        console.log(
                            '[RedemptionWidget] MetaTx Call Was sent!',
                            r
                        );
                        setTxStatus('confirmed');
                    })
                    .catch(async e => {
                        console.log(
                            '[RedemptionWidget] MetaTx Call Failed to be sent!',
                            e
                        );
                        var actual = atob(e);
                        console.log('defender ERROR: ', actual);
                        const gasPrice = await Util.Eth.estimateGasPrice(
                            web3react.library
                        );
                        redeemableContract.methods
                            .executeMetaTransaction(
                                depositAccount.address,
                                functionSignature,
                                r,
                                s,
                                v
                            )
                            .send({ from: account, gasPrice });
                        setTxStatus('error');
                    });
            });
    }, [library, redemptionKey, account, chainId, web3react.library]);

    const handleClick = React.useCallback(() => {
        if (!activate) {
            console.log('[AccountNav] Error Activate undefined');
        }
        if (active) return;
        activate(portis, (error: Error) => {
            console.log('[AccountNav] Error inside activate function', {
                error,
            });
        })
            .then((res): any => {})
            .catch((err: Error): any => {
                console.log('[AccountNav] Error activating connector', err);
            });
    }, [activate, active]);


    const explorerUrl = Constants.getExplorerUrl(chainId, txHash);
    let buttonText = 'Redeem MATIC';
    if (slotAmount != null) {
        buttonText =
            'Redeem ' +
            (slotAmount / Constants.units.weiInEth).toFixed(
                NUM_DECIMALS_DISPLAYED
            ) +
            ' MATIC';
    }
    if (txStatus === 'pending') {
        buttonText = 'Waiting...';
    } else if (txStatus === 'error') {
        buttonText = 'The Metatransaction failed to submit.';
    } else if (txStatus === 'confirmed') {
        buttonText = 'You have successfully claimed this Redeemable!';
    }

    const claimButtonElement =
        txStatus !== 'confirmed' ? (
            <div
                style={{
                    fontSize: 24,
                    width: '100%',
                    textAlign: 'center',
                    maxWidth: 576,
                }}
                className={[
                    s.button,
                    s.vibrant,
                    txStatus === 'pending' && s.pending,
                    txStatus === 'error' && s.error,
                    txStatus === 'confirmed' && s.confirmed,
                ].join(' ')}
                onClick={
                    txStatus !== 'pending' && txStatus != 'error'
                        ? handleRedemption
                        : undefined
                }>
                {buttonText}
            </div>
        ) : (
            txHash && (
                <Go external to={explorerUrl}>
                    <div
                        style={{ fontSize: 24, width: '100%' }}
                        className={[s.button, s.vibrant].join(' ')}>
                        View Transaction
                    </div>
                </Go>
            )
        );
    const txHashElement = (
        <div style={{ textAlign: 'center' }}>
            <TransactionStatusDisplay
                hideStarting={true}
                {...{ txHash, numConfirmations, txStatus }}
            />
        </div>
    );

    let flavorTextElement = (
        <div className={s.disclaimer}>
            This is the <span className={s.highlight}>decentralized</span>{' '}
            Redeemable experience. Thanks to metatransactions, you{' '}
            <span className={s.highlight}>no longer have to pay gas</span> to
            claim NFTs on Redeemable!
        </div>
    );
    if (txStatus === 'pending') {
        flavorTextElement = (
            <div className={s.disclaimer}>
                Your redemption is{' '}
                <span className={s.highlight}>initiated</span>! Please keep this
                page open until your transaction has been confirmed.
            </div>
        );
    }
    if (txStatus === 'confirmed') {
        flavorTextElement = (
            <div className={s.disclaimer}>
                Congrats! Your redemption is{' '}
                <span className={s.highlight}>confirmed</span>. The Redeemable
                Relay service is babysitting your transaction to make sure it
                clears. Your NFT will be delivered to you free of charge within
                the next 30 minutes. At the moment there is no dynamic
                transaction tracker for checking the status of your redemption
                metatransaction, but that's coming soon :D
            </div>
        );
    }

    if (errorPageMessage !== null) {
        return (
            <div className={s.redemption}>
                <div className={s.disclaimer}>{errorPageMessage}</div>
                {errorPageMessage === ERROR_PAGE_STRINGS.unrecognized && (
                    <ManualRedemption
                        showDisclaimerButton
                        redemptionKey={redemptionKey}
                    />
                )}
            </div>
        );
    }

    if (!minLoadingTimeReached) {
        // don't want to show connect wallet message prematurely
        return (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                {loadingElement}
            </div>
        );
    }

    if (!library || !account) {
        return (
            <div className={s.page0}>
                <div className={s.cardRenders}>
                    <RedeemableCard back={true} />
                    <div className={s.verticalColumn}>
                        <div className={s.callToAction}>
                            Welcome to the digital Redeemable experience! To
                            claim this giftcard, please connect your wallet.
                        </div>
                    </div>
                </div>
                <div style={{ height: 72 }}></div>
                <div className={s.noWalletContainer}>
                    <div className={s.noWalletText}>Dont have a crypto wallet? Don't worry about it, making a new wallet is super fast!
                     A wallet is where you recieve currency like MATIC and its also your one click, one password, to login to all web3 applications.</div>
                    <div className={s.noWalletCTA} onClick={handleClick}>Create Portis Wallet</div>
                </div>
            </div>
        );
    }

    console.log('>>>>>>slot status:', { slotNotUsed, slotNotActive });

    if (
        slotNotActive == null ||
        slotNotUsed == null ||
        !minLoadingTimeReached
    ) {
        return (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                {loadingElement}
            </div>
        );
    }

    if (chainId !== 137) {
        return (
            <div className={s.verticalColumn}>
                <div className={s.commonType} style={{ marginBottom: 24 }}>
                    In order to claim this Redeemable, please switch chains to
                    Polygon Network.
                </div>
            </div>
        );
    }

    let claimedText = 'This Redeemable has been claimed!';

    if (slotNotUsed) {
        return (
            <div className={s.redemption}>
                <div className={s.disclaimer}>
                    This is not a valid Redeemable slot. If this Redeemable was
                    recently created, it might be the case that the deposit
                    transaction has not been confirmed yet. Please reload the
                    page when the tx confirms. Otherwise, this is not a valid
                    redemption key.
                </div>
            </div>
        );
    }

    if (slotNotActive) {
        return (
            <div className={s.redemption}>
                <div>

                    <RedeemableCard
                        slotAmount={
                            !isNaN(parseFloat(slotAmount))
                                ? (
                                      parseFloat(slotAmount) /
                                      Constants.units.weiInEth
                                  ).toFixed(2)
                                : undefined
                        }
                        back={true}
                    />
                </div>
                <div className={s.disclaimer}>
                    This Redeemable has already been claimed!
                </div>
            </div>
        );
    }

    console.log('valid redeemable slot and not claimed!');
    // valid redeemable slot and not claimed
    return (
        <div className={s.redemption}>
            <div className={s.cardRenders}>
                <RedeemableCard
                    slotAmount={
                        parseFloat(slotAmount) / Constants.units.weiInEth
                    }
                    back={true}
                />
            </div>
            {claimButtonElement}
            <div style={{ height: 14 }} />
            {txHashElement}
        </div>
    );
};

RedemptionWidget.propTypes = {
    redemptionKey: PropTypes.string,
};

export default RedemptionWidget;
