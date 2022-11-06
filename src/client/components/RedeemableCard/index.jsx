// @flow
import React from 'react';
import PropTypes from 'prop-types';

import s from './index.less';
import stars from './stars.less';
import QRCode from 'react-qr-code';

const RedeemableCard = (props): React.Node => {
    const customBackgroundSet = typeof props.backgroundUrl === 'string';

    return props.back === true ? (
        <div style={{position: 'relative'}}
            className={[
                s.cardBackExample,
                typeof props.customStyle === 'string' ? props.customStyle : '',
                !props.noHover ? s.hoverEffects : '',
                props.theme === 'dark' ? s.dark : s.vibrant,
            ].join(' ')}>
            <div className={s.redeemableExampleBackground}>
                <div className={stars.stars}></div>
                <div className={stars.stars2}></div>
                <div className={stars.stars3}></div>
            </div>
            <div className={s.redeemableSquare} />
            <div className={s.redeemableQR}>
                <QRCode
                    fgColor={props.theme === 'dark' ? '#FFFFFF' : '#000000'}
                    bgColor={'transparent'}
                    value={props.qrCodeContent ?? window.location.href}
                    size={84}
                    level={'L'}
                />
            </div>
            <div className={s.redeemableHeadline}>REDEEMABLE</div>
            <div className={s.redeemableAmount}>
                <div>
                    {typeof props.slotAmount === 'number'
                        ? props.slotAmount
                        : (10.5).toFixed(2)}{' '}
                    MATIC
                </div>
                <div>ETHGlobal</div>
                <div>11/22</div>
            </div>
        </div>
    ) : (
        <div
            className={[
                s.cardFrontExample,
                typeof props.customStyle === 'string' ? props.customStyle : '',
            ].join(' ')}>
            <div
                className={customBackgroundSet ? s.openseaCard : s.exampleCard}
                style={
                    customBackgroundSet
                        ? { backgroundImage: `url(${props.backgroundUrl})` }
                        : {}
                }>
                {!customBackgroundSet && (
                    <img
                        width="100%"
                        height="100%"
                        style={{ backgroundRepeat: 'no-repeat' }}
                        src={
                            customBackgroundSet
                                ? props.backgroundUrl
                                : '/img/logos/redeemable-favicon-32.png'
                        }
                    />
                )}
            </div>
        </div>
    );
};

RedeemableCard.propTypes = {
    slotAmount: PropTypes.number.isOptional,
    back: PropTypes.bool,
    backgroundUrl: PropTypes.string,
    noHover: PropTypes.bool,
    theme: PropTypes.string,
    qrCodeContent: PropTypes.string,
};

export default RedeemableCard;
