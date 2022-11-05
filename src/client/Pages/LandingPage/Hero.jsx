// @flow
import * as React from 'react';
import Page from '../../components/Page';
import Go from '../../components/Go';

import s from './index.less';

type Props = {
    history: Object,
};

const Hero = (props: Props): React.Node => (
    <Page
        {...props}
        pageClass={s.page}
        verticalCenter={true}
        footerEnabled={false}
        footerFloating={false}
        contentPreferredWidth={800}>
        <div className={s.content} style={{ zIndex: 1 }}>
            <div className={s.sideBySide}>
                <div className={s.cards}>
                </div>
                <div className={s.callToAction}>
                    <div className={s.landingText}>
                        <div className={s.heading}>
                            Physical &amp; Digital Redeemable Crypto Gift cards
                        </div>
                        <div className={s.subheading}>
                            Deposit MATIC from your wallet &amp; transform it
                            into a{' '}
                            <span
                                className={s.emphasis}
                                style={{ fontWeight: 600 }}>
                                scannable URL reward
                            </span>
                            !
                        </div>
                    </div>
                    <Go
                        to={'/create-native'}
                        data-action={'redeemable-create-native'}
                        data-category={'Redeemable-hero'}>
                        <div className={s.button}>
                            <div className={s.createRedeemableIcon}></div>
                            <span style={{ width: '200px' }}>
                                Create your Redeemable
                            </span>
                        </div>
                    </Go>
                </div>
            </div>
        </div>
    </Page>
);

export default Hero;
