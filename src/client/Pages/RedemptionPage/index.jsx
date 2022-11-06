import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page';
import s from './index.less';
import Footer from '../../components/Footer';
import RedemptionWidget from '../../components/RedemptionWidget';
import { matchPath, withRouter } from 'react-router';

const RedemptionPage = ({ history } = props): React.Node => {
    const match = matchPath(history?.location?.pathname, {
        path: '/r/:redemptionKey',
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
            backgroundOnly={true}
            contentPreferredWidth={800}
            footerComponent={<Footer />}>
            <div className={s.content}>
                <RedemptionWidget redemptionKey={redemptionKey} />
            </div>
        </Page>
    );
};

RedemptionPage.propTypes = {
    active: PropTypes.bool,
};

export default RedemptionPage;
