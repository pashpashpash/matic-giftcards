// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page';
import s from './index.less';
import Footer from '../../components/Footer';
import ManualRedemption from '../../components/RedemptionWidget/manualredemption.jsx';
import { matchPath, withRouter } from 'react-router';

const ManualRedemptionPage = ({ history } = props): React.Node => {
    const match = matchPath(history?.location?.pathname, {
        path: '/r/:redemptionKey/manual',
        exact: true,
        strict: false,
    }) || { params: { redemptionKey: null } };
    let redemptionKey = match.params.redemptionKey;

    return (
        <Page
            pageClass={s.page}
            footerEnabled={true}
            footerFloating={false}
            verticalCenter={true}
            contentPreferredWidth={800}
            footerComponent={<Footer />}>
            <div className={s.content}>
                <ManualRedemption
                    showDisclaimerButton={false}
                    redemptionKey={redemptionKey}
                />
            </div>
        </Page>
    );
};

ManualRedemptionPage.propTypes = {
    active: PropTypes.bool,
};

export default ManualRedemptionPage;
