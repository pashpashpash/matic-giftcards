// @flow
import React from 'react';
import PropTypes from 'prop-types';
import s from './index.less';

import { useWeb3React } from '@web3-react/core';

import * as sigUtil from '@metamask/eth-sig-util';
import * as ethUtil from 'ethereumjs-util';
import TransactionStatusDisplay from '../TransactionStatusDisplay';

import Constants from '../../Constants';

const RedeemableNativeABI = Constants.contracts.RedeemableNative.abi;
const RedeemableNativeAddress = Constants.addresses.RedeemableNative;
const NUM_DECIMALS_DISPLAYED = 2;

import Go from '../Go';

import Util from '../../Utils';

const ERROR_PAGE_STRINGS = {
    invalid: `This key is invalid. Please check the url to make sure a key
                    is present to claim your Redeemable. If you think this is a
                    mistake, contact support.`,
    unrecognized: `Oh no! Looks like you're using an unrecognized key. 
                        The key in the URL is formatted correctly, 
                        however we don't recognize it on our backend. 
                        If you think this is a mistake, please contact support.`,
};

const ManualRedemption = ({
    redemptionKey,
    showDisclaimerButton,
}: {
    redemptionKey: string,
    showDisclaimerButton: boolean,
}): React.Node => {
    const web3react = useWeb3React();
    const { account, library, chainId } = web3react;

    const [txStatus, setTxStatus] = React.useState(null);
    const [txHash, setTxHash] = React.useState(null);
    const [numConfirmations, setNumConfirmations] = React.useState(null);
    const [disclaimerWasApproved, setDisclaimerWasApproved] = React.useState(
        false
    );

    const [slotNotActive, setSlotNotActive] = React.useState(null);
    const [slotNotUsed, setSlotNotUsed] = React.useState(null);
    const [slotAmount, setSlotAmount] = React.useState(null);

    const [errorPageMessage, setErrorPageMessage] = React.useState(null);

    React.useEffect(() => {
        if (typeof redemptionKey === 'string' && redemptionKey.length > 0) {
            let depositAddress = null;
            try {
                depositAddress = ethUtil.toChecksumAddress(
                    '0x' +
                        ethUtil
                            .privateToAddress(ethUtil.toBuffer(redemptionKey))
                            .toString('hex')
                );
            } catch (e) {
                setErrorPageMessage(ERROR_PAGE_STRINGS.invalid);
            }
            if (depositAddress === null) return;
            console.log('>>>>>>> fetching gift card details');
        }
        if (library != null && redemptionKey != null) {
            console.log('>>>>>>>>>>> Constants:', {
                RedeemableNativeABI,
                RedeemableNativeAddress,
            });
            const depositAccount = library.eth.accounts.privateKeyToAccount(
                redemptionKey
            );

            console.log('>>>>>>depositAccount:', {
                depositAccount,
                redemptionKey,
            });

            const redeemableContract = new library.eth.Contract(
                RedeemableNativeABI,
                RedeemableNativeAddress
            );

            redeemableContract.methods
                .isSlotActive(depositAccount.address)
                .call()
                .then(r => {
                    if (!r) {
                        console.log(
                            '[RedemptionWidget] Redemption slot not active!',
                            {
                                redeemableContract,
                                r,
                            }
                        );
                        setSlotNotActive(true);
                    }
                })
                .catch(console.log);

            redeemableContract.methods
                .slotData(depositAccount.address)
                .call()
                .then(r => {
                    console.log('>>>>SLOT DATA:', { r });
                    if (!r.used) {
                        console.log(
                            '[RedemptionWidget] Redemption slot not being used!',
                            {
                                redeemableContract,
                                r,
                            }
                        );
                        setSlotNotUsed(true);
                    }

                    if (r.tokenAmount) {
                        setSlotAmount(r.tokenAmount);
                    }
                })
                .catch(console.log);
        }
    }, [account, library, chainId]);

    const handleRedemption = React.useCallback(() => {
        const depositAccount = library.eth.accounts.privateKeyToAccount(
            redemptionKey
        );
        console.log('>>>>>>depositAccount:', {
            depositAccount,
            redemptionKey,
        });
        console.log('>>>>>>>>>>> Constants:', {
            RedeemableNativeABI,
            RedeemableNativeAddress,
        });
        const redeemableContract = new library.eth.Contract(
            RedeemableNativeABI,
            RedeemableNativeAddress
        );

        redeemableContract.methods
            .getNonce(depositAccount.address)
            .call()
            .then(async nonce => {
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
                    .send({ from: account, gasPrice })
                    .on('error', e => {
                        setTxStatus('error');
                    })
                    .on('transactionHash', transactionHash => {
                        setTxHash(transactionHash);
                    })
                    .on('receipt', receipt => {})
                    .on('confirmation', (confirmationNumber, receipt) => {
                        setTxStatus('confirmed');
                        setNumConfirmations(confirmationNumber);
                    })
                    .then(r => {
                        console.log(
                            '[ManualRedemption] Metatransaction success',
                            {
                                r,
                            }
                        );
                    })
                    .catch(e => {
                        setTxStatus('error');
                    });
            });
    }, [library, redemptionKey]);

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
        buttonText = 'Try again';
    } else if (txStatus === 'confirmed') {
        buttonText = 'View Transaction';
    }

    const explorerUrl = Constants.getExplorerUrl(chainId, txHash);
    const cards = (
        <div className={s.cardRenders}>
            <div>IMAGE OF CARD</div>
        </div>
    );
    const manualRedemptionElement = (
        <div className={s.redemption}>
            {cards}
            <div style={{ height: 24 }} />
            <div className={s.disclaimer}>
                This is the manual{' '}
                <span className={s.highlight}>decentralized</span> Redeemable
                experience. To redeem this gift card, you will have to interact
                with the Redeemable smart contract. This contract interaction
                will require gas.{' '}
            </div>
            <div style={{ height: 14 }} />
            {txStatus !== 'confirmed' ? (
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
                    <Go external={true} to={explorerUrl}>
                        <div
                            style={{ fontSize: 24, width: '100%' }}
                            className={[s.button, s.vibrant].join(' ')}>
                            View Transaction
                        </div>
                    </Go>
                )
            )}
            <div style={{ height: 14 }} />
            <div style={{ textAlign: 'center' }}>
                <TransactionStatusDisplay
                    hideStarting={true}
                    {...{ txHash, numConfirmations, txStatus }}
                />
            </div>
        </div>
    );

    const disclaimerButton = (
        <div
            className={[s.button, s.confirmed].join(' ')}
            onClick={React.useCallback(() => {
                setDisclaimerWasApproved(true);
            }, [disclaimerWasApproved, setDisclaimerWasApproved])}>
            If you know what you're doing, you can try manually calling the
            redemption contract.
        </div>
    );

    if (!library || !account || !redemptionKey) {
        <div className={s.callToAction}>
            Welcome to the digital Redeemable experience! To claim this gift
            card, please connect your wallet.
        </div>;
    }

    if (chainId !== 137) {
        return <div>Please switch chains to Polygin (MATIC)!</div>;
    }

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
                {cards}
                <div className={s.disclaimer}>
                    This Redeemable has already been claimed!
                </div>
            </div>
        );
    }

    if (!showDisclaimerButton) {
        return manualRedemptionElement;
    }

    return disclaimerWasApproved ? manualRedemptionElement : disclaimerButton;
};

ManualRedemption.propTypes = {
    redemptionKey: PropTypes.string,
    showDisclaimerButton: PropTypes.bool,
};

export default ManualRedemption;
