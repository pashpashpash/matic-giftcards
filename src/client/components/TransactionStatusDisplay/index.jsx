// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import s from './index.less';

type Props = {
    txStatus: string,
    txHash: string,
    numConfirmations: number,
};

const TransactionStatusDisplay = (props: Props): React.Node => {

    const handleCopy = React.useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    const txHashElement = props != null && props.txHash && (
        <div
            className={s.txHash}
            onClick={handleCopy.bind(this, props.txHash)}>{`${props.txHash.slice(
            0,
            4
        )}...${props.txHash.slice(props.txHash.length - 6, props.txHash.length - 1)}`}</div>
    );
    const confirmationsElement = props.numConfirmations !== null &&
        props.numConfirmations !== 0 && (
            <div
                className={
                    s.confirmations
                }>{`CONFIRMATIONS: ${props.numConfirmations}`}</div>
        );
    const txStatusElement = (
        <div className={s.txStatus}>{props.txStatus ?? 'not initiated'}</div>
    );

    return (
        <div className={s.status}>
            {props.txStatus == null  && (
                <div className={s.notInitiated}>NOT INITIATED</div>
            )}
            {props.txStatus === 'pending' && (
                <div className={s.pending}>
                    {txStatusElement}
                    {txHashElement}
                    {confirmationsElement}
                </div>
            )}
            {props.txStatus === 'error' && <div className={s.error}>{props.txStatus}</div>}
            {props.txStatus === 'confirmed' && (
                <div className={s.confirmed}>
                    {txStatusElement}
                    {txHashElement}
                    {confirmationsElement}
                </div>
            )}
        </div>
    );
};

TransactionStatusDisplay.propTypes = {
    txStatus: PropTypes.string,
    txHash: PropTypes.string,
    numConfirmations: PropTypes.number,
};

export default TransactionStatusDisplay;
