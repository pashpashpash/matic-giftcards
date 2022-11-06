// @flow
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../components/AccountNav/connectors';
import Page from '../../components/Page';
import Footer from '../../components/Footer';
import Slider from 'react-input-slider';
import DepositWidget from "../../components/depositWidget";
import s from './index.less';

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

const GiftCardAmountInput = (props: GiftCardInputProps): React.Node => (
    <div className={s.GiftCardInputAmountContainer}>
        <div className={s.giftcardHeader}>
            {' '}
            How Much would you like to deposit into your gift card
        </div>

        <div className={s.SliderContainer}>
            <input
            className={s.SliderQuantity}
            type="number"
            step={0.00001}
            value={parseFloat(props.giftCardAmount).toPrecision(7)}
            onChange={(evt: {target: {value: number}}) => {
                console.log("TextInputEvent: ", evt.target.value)
                props.setGiftCardAmount(parseFloat(evt.target.value).toPrecision(7))
            }}
            />
            <Slider
                asix="X"
                x={props.giftCardAmount}
                onChange={(x: {x: number, y: number}) => {
                    console.log("Setting quanitity: ", x, (x.x).toPrecision(7))
                    props.setGiftCardAmount((x.x).toPrecision(7));
                }}
                xmin={0}
                xmax={10000}
                xstep={0.00001}
            />
        </div>

        <div className={s.amountConfirmContainer}>
                <div className={s.confirmAmountButton} onClick={() => {
                    if (props.giftCardAmount === 0) {
                        console.log("must be more than 0");
                        return;
                    }
                    props.confirmAmount(true)
                    }}>
                   Confirm deposit of {parseFloat(props.giftCardAmount).toPrecision(7)} into gift Redeemable
                </div>
        </div>
    </div>
);

type GiftDepositProps = {
    giftCardAmount: number,
};

const CreateNative = (props: Props): React.Node => {
    const { account, active } = useWeb3React();
    const [cardAmount, setCardAmount] = React.useState(1);
    const [moveToDeposit, setMoveToDeposit] = React.useState(null)
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
        display = <DepositWidget giftCardAmount={cardAmount}/>

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
