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
    giftCardAmount: number,
    setGiftCardAmount: Function,
    confirmAmount: Function,
};

const GiftCardAmountInput = (props: GiftCardInputProps): React.Node => {
    const { library, account } = useWeb3React();
    const [precision, setPrecision] = React.useState(5)
    const [balance, setBalance] = React.useState(0)

    React.useEffect(() => {
        library.eth.getBalance(account, (err: Error, result: string) => {
            if (err) {
                console.log("WEB3 error reload page", err)
            } else {
                setBalance(library.utils.fromWei(result, "ether"))
            }
        })
    })

    return (
    <div className={s.GiftCardInputAmountContainer}>
        <div className={s.giftcardHeader}>
            {' '}
            How Much would you like to deposit into your gift card
        </div>

        <div className={s.SliderContainer}>
            <input
                className={s.SliderQuantity}
                type="text"
                value={props.giftCardAmount}
                onChange={(evt: { target: { value: number } }) => {
                    const result = evt.target.value
                    const newPrecision = result + ""
                    console.log('TextInputEvent: ', result, newPrecision.length, result > balance);
                    if (result > balance) return;
                    props.setGiftCardAmount(
                        result
                    );
                    setPrecision(newPrecision.length)
                }}
            />
            <Slider
                asix="X"
                x={props.giftCardAmount}
                onChange={(x: { x: number, y: number }) => {
                    console.log('Setting quanitity: ', x.x, precision);
                    if (x.x > 100 && x.x < 1000) {
                        props.setGiftCardAmount(x.x.toPrecision(6));
                        setPrecision(6);
                        return;
                    }
                    if (x.x > 1000) {
                        props.setGiftCardAmount(x.x.toPrecision(7));
                        setPrecision(7);
                        return;
                    }
                    if (x.x > 10000) {
                        props.setGiftCardAmount(x.x.toPrecision(8));
                        setPrecision(8);
                        return;
                    }
                    props.setGiftCardAmount(x.x.toPrecision(precision));
                }}
                xmin={0}
                xmax={balance}
                xstep={0.00001}
                styles={{
                    x: { width: '320px' },
                    track: {
                        width: '60%',
                        backgroundColor: '#c1bfba',
                    },
                    active: {
                        backgroundColor: '#272727',
                        border: '2px solid #c1bfba'
                    },
                    thumb: {
                        width: 24,
                        height: 50,
                    },
                    disabled: {
                        opacity: 0.5,
                    },
                }}
            />
        </div>

        <div className={s.amountConfirmContainer}>
            <div
                className={s.confirmAmountButton}
                onClick={() => {
                    if (props.giftCardAmount > 0) {
                        props.confirmAmount(true);
                    }
                    console.log('must be more than 0');
                        return;
                }}>
                Confirm deposit of{' '}
                {props.giftCardAmount} into gift
                Redeemable
            </div>
        </div>
    </div>
);
            }

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
            contentPreferredWidth={800}
            footerComponent={<Footer />}>
            <div className={s.content}>{display}</div>
        </Page>
    );
};

export default CreateNative;
