// @flow
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../components/AccountNav/connectors';
import Page from '../../components/Page';
import Footer from '../../components/Footer';
import Slider from 'react-input-slider';
import DepositWidget from '../../components/depositWidget';
import s from './index.less';
// import FancyInput from "../../components/FancyInput"
type Props = {
    history: Object,
};

// step one Verify Login Status display a login page (X)
// step two Define the ammount stored in the new gift card
// step five Create Gift card using transaction
// step six display status of creation of gift card
// step seven display redeemable / save to account maybe

const RequireLogin = (): React.Node => {
    const { active, activate } = useWeb3React();

    const handleClick = React.useCallback(() => {
        if (!activate) {
            console.log('[AccountNav] Error Activate undefined');
        }
        if (active) return;
        activate(injected, (error: Error) => {
            console.log('[AccountNav] Error inside activate function', {
                error,
            });
        }).catch((err: Error): any => {
            console.log('[AccountNav] Error activating connector', err);
        });
    }, [activate, active]);

    return (
        <div className={s.LoginContainer}>
            <div className={s.headerText}>
                Please Login using a crypto wallet
            </div>
            <div className={s.connectButton} onClick={handleClick}>
                Connect Wallet
            </div>
        </div>
    );
};

type GiftCardInputProps = {
    giftCardAmount: number | string,
    setGiftCardAmount: Function,
    confirmAmount: Function,
};

const GiftCardAmountInput = (props: GiftCardInputProps): React.Node => {
    const { library, account } = useWeb3React();
    const [balance, setBalance] = React.useState(0);

    React.useEffect(() => {
        library.eth.getBalance(account, (err: Error, result: string) => {
            if (err) {
                console.log('WEB3 error reload page', err);
            } else {
                setBalance(library.utils.fromWei(result, 'ether'));
            }
        });
    });

    let buttonMessage =
        'Confirm deposit of ' +
        props.giftCardAmount +
        ' MATIC into your Redeemable giftcard';

    if (
        props.giftCardAmount === 0 ||
        props.giftCardAmount === '' ||
        parseFloat(props.giftCardAmount) == 0
    ) {
        buttonMessage = 'Please select a nonzero amount of MATIC';
    }

    return (
        <div className={s.GiftCardInputAmountContainer}>
            <div className={s.giftcardHeader}>
                {' '}
                How much MATIC would you like to deposit into your gift card?
            </div>

            <div className={s.SliderContainer}>
                <input
                    className={s.SliderQuantity}
                    type="text"
                    value={props.giftCardAmount}
                    onChange={(evt: { target: { value: number | string } }) => {
                        const result = evt.target.value;
                        props.setGiftCardAmount(result);
                    }}
                    onBlur={(evt: { target: { value: number | string } }) => {
                        console.log('>>> on blur event:', { evt });
                        if (evt.target.value === '') {
                            props.setGiftCardAmount(0);
                        }
                        const result = parseFloat(evt.target.value);
                        console.log('>>> on blur event result:', { result });
                        if (result > balance) {
                            props.setGiftCardAmount(
                                parseFloat(balance).toFixed(2)
                            );
                        } else if (result < 0) {
                            props.setGiftCardAmount(0);
                        } else if (isNaN(result)) {
                            props.setGiftCardAmount(0);
                        } else {
                            props.setGiftCardAmount(result.toFixed(2));
                        }
                    }}
                />
                <Slider
                    asix="X"
                    x={props.giftCardAmount === '' ? 0 : props.giftCardAmount}
                    onChange={(x: { x: number, y: number }) => {
                        console.log('Setting quanitity: ', x.x);
                        props.setGiftCardAmount(x.x.toFixed(2));
                    }}
                    xmin={0}
                    xmax={balance}
                    xstep={0.01}
                    styles={{
                        x: { width: '320px' },
                        track: {
                            width: '60%',
                            backgroundColor: '#272727',
                        },
                        active: {
                            backgroundColor: '#BF40BF',
                            border: '2px solid #272727',
                        },
                        thumb: {
                            width: 40,
                            height: 40,
                            backgroundColor: '#181a1b',
                            border: '2px solid #BF40BF',
                        },
                        disabled: {
                            opacity: 0.5,
                        },
                    }}
                />
            </div>

            <div className={s.amountConfirmContainer}>
                <div
                    className={[
                        s.confirmAmountButton,
                        props.giftCardAmount === 0 && s.disabled,
                    ].join(' ')}
                    onClick={() => {
                        if (
                            typeof props.giftCardAmount === 'number' &&
                            props.giftCardAmount > 0
                        ) {
                            props.confirmAmount(true);
                        } else if (typeof props.giftCardAmount !== 'number') {
                            if (!isNaN(parseFloat(props.giftCardAmount))) {
                                props.setGiftCardAmount(
                                    parseFloat(props.giftCardAmount).toFixed(2)
                                );
                                props.confirmAmount(true);
                            }
                        }

                        console.log('must be more than 0');
                        return;
                    }}>
                    {buttonMessage}
                </div>
            </div>
        </div>
    );
};

type GiftDepositProps = {
    giftCardAmount: number,
};

const CreateNative = (props: Props): React.Node => {
    const { active } = useWeb3React();
    const [cardAmount, setCardAmount] = React.useState(1);

    const [moveToDeposit, setMoveToDeposit] = React.useState(null);
    // display basic login to ensure user is connected
    let display = null;
    if (!active) display = <RequireLogin />;
    // get the deposit amount and confirm it.
    if (active && !moveToDeposit) {
        display = (
            <GiftCardAmountInput
                giftCardAmount={cardAmount}
                setGiftCardAmount={setCardAmount}
                confirmAmount={setMoveToDeposit}
            />
        );
    } else if (active) {
        // once the deposit amount in confirmed move to creating the redeemable
        display = <DepositWidget giftCardAmount={cardAmount} />;
    }
    return (
        <Page
            pageClass={s.page}
            footerEnabled={true}
            footerFloating={false}
            verticalCenter={true}
            contentPreferredWidth={1000}
            footerComponent={<Footer />}>
            <div className={s.content}>{display}</div>
        </Page>
    );
};

export default CreateNative;
