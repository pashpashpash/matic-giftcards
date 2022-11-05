// @flow
import * as React from 'react';
import s from './index.less';
import PropTypes from 'prop-types';
import Go from '../Go';

type Props = { 
    backgroundOnly?: boolean,
    backgroundClass?: string };

const Footer = (props: Props): React.Node => {
    const footerClasses = [s.footer];
    if (props.backgroundClass) footerClasses.push(props.backgroundClass);
    if (props.backgroundOnly) footerClasses.push(s.backgroundOnly);
    return (
    <div className={footerClasses.join(' ')}>
        <div className={s.footerContainer}>
            <div className={[s.cropHeight, s.flip].join(' ')}>
                <img
                    src={'https://storage.googleapis.com/redeemable-public/img/common/footer-no-birds-sm-height.png'}
                    alt={'foreground styling image'}
                    className={[s.scale, s.flip].join(' ')}
                />
            </div>
            {props.backgroundOnly === true ? null : (
                <div className={s.content}>
                    <div className={s.linkRow}>
                        <div className={s.socialButtons}>
                            <a
                                href="https://twitter.com/RedeemableNFT"
                                className={s.socialIcon}
                                aria-label="twitter">
                                <div className={s.socialContainer}>
                                    <svg
                                        className="social-svg"
                                        viewBox="0 0 64 64"
                                        style={{
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '0px',
                                            left: '0px',
                                            width: '100%',
                                            height: '100%',
                                            fillRule: 'evenodd',
                                        }}>
                                        <g
                                            className="social-svg-background"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="31"></circle>
                                        </g>
                                        <g
                                            className="social-svg-icon"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <path d="M48,22.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6 C41.7,19.8,40,19,38.2,19c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5c-5.5-0.3-10.3-2.9-13.5-6.9c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.2,4.3,2.9,5.5c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1c2.9,1.9,6.4,2.9,10.1,2.9c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C46,24.5,47.1,23.4,48,22.1z"></path>
                                        </g>
                                        <g
                                            className="social-svg-mask"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: '#FFFFFF',
                                            }}>
                                            <path d="M0,0v64h64V0H0z M44.7,25.5c0,0.3,0,0.6,0,0.8C44.7,35,38.1,45,26.1,45c-3.7,0-7.2-1.1-10.1-2.9 c0.5,0.1,1,0.1,1.6,0.1c3.1,0,5.9-1,8.2-2.8c-2.9-0.1-5.3-2-6.1-4.6c0.4,0.1,0.8,0.1,1.2,0.1c0.6,0,1.2-0.1,1.7-0.2 c-3-0.6-5.3-3.3-5.3-6.4c0,0,0-0.1,0-0.1c0.9,0.5,1.9,0.8,3,0.8c-1.8-1.2-2.9-3.2-2.9-5.5c0-1.2,0.3-2.3,0.9-3.3 c3.2,4,8.1,6.6,13.5,6.9c-0.1-0.5-0.2-1-0.2-1.5c0-3.6,2.9-6.6,6.6-6.6c1.9,0,3.6,0.8,4.8,2.1c1.5-0.3,2.9-0.8,4.2-1.6 c-0.5,1.5-1.5,2.8-2.9,3.6c1.3-0.2,2.6-0.5,3.8-1C47.1,23.4,46,24.5,44.7,25.5z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </a>
                            <a
                                href="https://discord.gg/JddHzFxh4X"
                                className={s.socialIcon}
                                aria-label="discord">
                                <div className={s.socialContainer}>
                                    <svg
                                        className="social-svg"
                                        viewBox="0 0 64 64"
                                        style={{
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '0px',
                                            left: '0px',
                                            width: '100%',
                                            height: '100%',
                                            fillRule: 'evenodd',
                                        }}>
                                        <g
                                            className="social-svg-background"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="31"></circle>
                                        </g>
                                        <g
                                            className="social-svg-icon"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <path d="M 0,0 H 64 V 64 H 0 Z"></path>
                                        </g>
                                        <g
                                            className="social-svg-mask"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: '#FFFFFF',
                                            }}>
                                            <path d="M 0 0 L 0 64 L 64 64 L 64 0 L 0 0 z M 26.404297 16.828125 L 26.769531 17.259766 C 20.186671 19.137498 17.152344 21.990234 17.152344 21.990234 C 17.152344 21.990234 17.957407 21.557233 19.310547 20.943359 C 23.223697 19.246178 26.331328 18.778253 27.611328 18.669922 C 27.830758 18.633812 28.012992 18.597656 28.232422 18.597656 C 30.463282 18.308769 32.987954 18.236508 35.621094 18.525391 C 39.095384 18.922604 42.825476 19.931951 46.628906 21.990234 C 46.628906 21.990234 43.738624 19.282029 37.521484 17.404297 L 38.035156 16.828125 C 38.035156 16.828125 43.044257 16.719236 48.310547 20.619141 C 48.310547 20.619141 53.576172 30.044365 53.576172 41.671875 C 53.576172 41.671875 50.468999 46.907386 42.386719 47.160156 C 42.386719 47.160156 41.069796 45.606565 39.972656 44.234375 C 44.763516 42.898295 46.591797 39.9375 46.591797 39.9375 C 45.092367 40.91248 43.666719 41.598919 42.386719 42.068359 C 40.558139 42.826669 38.802844 43.332214 37.083984 43.621094 C 33.573124 44.271074 30.354188 44.091468 27.611328 43.585938 C 25.526758 43.188727 23.735758 42.610963 22.236328 42.033203 C 21.395188 41.708213 20.480696 41.310228 19.566406 40.804688 C 19.456696 40.732487 19.346048 40.69722 19.236328 40.625 C 19.163228 40.5889 19.126414 40.551755 19.089844 40.515625 C 18.431554 40.154535 18.066406 39.902344 18.066406 39.902344 C 18.066406 39.902344 19.822217 42.789919 24.466797 44.162109 C 23.369647 45.534299 22.015625 47.160156 22.015625 47.160156 C 13.933335 46.907386 10.861328 41.671875 10.861328 41.671875 C 10.861328 30.044375 16.128906 20.619141 16.128906 20.619141 C 21.395196 16.719236 26.404297 16.828125 26.404297 16.828125 z M 25.380859 30.296875 C 23.296289 30.296875 21.650391 32.101957 21.650391 34.304688 C 21.650391 36.507407 23.332859 38.3125 25.380859 38.3125 C 27.465429 38.3125 29.111328 36.507407 29.111328 34.304688 C 29.147928 32.101957 27.465429 30.296875 25.380859 30.296875 z M 38.728516 30.296875 C 36.643946 30.296875 34.998047 32.101957 34.998047 34.304688 C 34.998047 36.507407 36.680516 38.3125 38.728516 38.3125 C 40.813086 38.3125 42.458984 36.507407 42.458984 34.304688 C 42.458984 32.101957 40.813086 30.296875 38.728516 30.296875 z "></path>
                                        </g>
                                    </svg>
                                </div>
                            </a>
                            <a
                                href="https://www.instagram.com/redeemable.app/"
                                className={s.socialIcon}
                                aria-label="instagram">
                                <div className={s.socialContainer}>
                                    <svg
                                        className="social-svg"
                                        viewBox="0 0 64 64"
                                        style={{
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '0px',
                                            left: '0px',
                                            width: '100%',
                                            height: '100%',
                                            fillRule: 'evenodd',
                                        }}>
                                        <g
                                            className="social-svg-background"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="31"></circle>
                                        </g>
                                        <g
                                            className="social-svg-icon"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: 'transparent',
                                            }}>
                                            <path d="M 39.88,25.89 C 40.86,25.89 41.65,25.10 41.65,24.12 41.65,23.14 40.86,22.35 39.88,22.35 38.90,22.35 38.11,23.14 38.11,24.12 38.11,25.10 38.90,25.89 39.88,25.89 Z M 32.00,24.42 C 27.82,24.42 24.42,27.81 24.42,32.00 24.42,36.19 27.82,39.58 32.00,39.58 36.18,39.58 39.58,36.18 39.58,32.00 39.58,27.82 36.18,24.42 32.00,24.42 Z M 32.00,36.92 C 29.28,36.92 27.08,34.72 27.08,32.00 27.08,29.28 29.28,27.08 32.00,27.08 34.72,27.08 36.92,29.28 36.92,32.00 36.92,34.72 34.72,36.92 32.00,36.92 Z M 32.00,19.90 C 35.94,19.90 36.41,19.92 37.96,19.99 39.41,20.05 40.19,20.29 40.71,20.50 41.40,20.77 41.89,21.08 42.41,21.60 42.92,22.12 43.24,22.61 43.51,23.30 43.71,23.82 43.95,24.60 44.02,26.04 44.09,27.60 44.11,28.06 44.11,32.01 44.11,35.95 44.09,36.41 44.02,37.97 43.95,39.41 43.71,40.19 43.51,40.71 43.24,41.40 42.92,41.90 42.41,42.41 41.89,42.93 41.40,43.25 40.71,43.51 40.19,43.71 39.41,43.96 37.96,44.02 36.41,44.09 35.94,44.11 32.00,44.11 28.06,44.11 27.59,44.09 26.04,44.02 24.59,43.96 23.81,43.72 23.29,43.51 22.60,43.24 22.11,42.93 21.59,42.41 21.08,41.90 20.76,41.40 20.49,40.71 20.29,40.19 20.05,39.41 19.98,37.97 19.91,36.41 19.89,35.95 19.89,32.01 19.89,28.06 19.91,27.60 19.98,26.04 20.05,24.60 20.29,23.82 20.49,23.30 20.76,22.61 21.08,22.12 21.59,21.60 22.11,21.08 22.60,20.76 23.29,20.50 23.81,20.30 24.59,20.05 26.04,19.99 27.59,19.91 28.06,19.90 32.00,19.90 Z M 32.00,17.24 C 27.99,17.24 27.49,17.26 25.91,17.33 24.34,17.40 23.27,17.65 22.33,18.01 21.36,18.39 20.54,18.90 19.72,19.72 18.90,20.54 18.39,21.37 18.01,22.33 17.65,23.27 17.40,24.34 17.33,25.92 17.26,27.49 17.24,27.99 17.24,32.00 17.24,36.01 17.26,36.51 17.33,38.09 17.40,39.66 17.65,40.73 18.01,41.67 18.39,42.65 18.90,43.47 19.72,44.29 20.54,45.11 21.37,45.61 22.33,45.99 23.27,46.36 24.34,46.61 25.92,46.68 27.49,46.75 27.99,46.77 32.01,46.77 36.02,46.77 36.52,46.75 38.09,46.68 39.66,46.61 40.74,46.36 41.68,45.99 42.65,45.62 43.47,45.11 44.29,44.29 45.11,43.47 45.62,42.64 46.00,41.67 46.36,40.74 46.61,39.66 46.68,38.09 46.75,36.51 46.77,36.01 46.77,32.00 46.77,27.99 46.75,27.49 46.68,25.91 46.61,24.34 46.36,23.27 46.00,22.33 45.62,21.35 45.11,20.53 44.29,19.71 43.47,18.89 42.65,18.39 41.68,18.01 40.74,17.64 39.67,17.39 38.09,17.32 36.51,17.26 36.01,17.24 32.00,17.24 Z"></path>
                                        </g>
                                        <g
                                            className="social-svg-mask"
                                            style={{
                                                transition:
                                                    'fill 170ms ease-in-out 0s',
                                                fill: '#FFFFFF',
                                            }}>
                                            <path d="M0,0v64h64V0H0z M 42.03,23.99 C 42.03,24.99 41.22,25.79 40.23,25.79 39.23,25.79 38.43,24.99 38.43,23.99 38.43,22.99 39.23,22.19 40.23,22.19 41.22,22.19 42.03,22.99 42.03,23.99 Z M 24.52,31.99 C 24.52,27.74 27.97,24.29 32.22,24.29 36.47,24.29 39.92,27.75 39.92,31.99 39.92,36.24 36.47,39.70 32.22,39.70 27.97,39.70 24.52,36.25 24.52,31.99 Z M 27.22,31.99 C 27.22,34.76 29.46,36.99 32.22,36.99 34.98,36.99 37.22,34.76 37.22,31.99 37.22,29.23 34.98,27.00 32.22,27.00 29.46,27.00 27.22,29.23 27.22,31.99 Z M 38.28,19.79 C 36.70,19.72 36.22,19.70 32.22,19.70 28.22,19.70 27.74,19.71 26.17,19.79 24.69,19.85 23.90,20.11 23.37,20.31 22.67,20.58 22.17,20.90 21.65,21.43 21.13,21.96 20.80,22.46 20.53,23.16 20.33,23.68 20.08,24.48 20.01,25.94 19.94,27.52 19.92,27.99 19.92,32.01 19.92,36.01 19.94,36.48 20.01,38.06 20.08,39.52 20.33,40.32 20.53,40.84 20.80,41.54 21.13,42.05 21.65,42.57 22.17,43.10 22.67,43.41 23.37,43.69 23.90,43.90 24.69,44.15 26.17,44.21 27.74,44.28 28.22,44.30 32.22,44.30 36.22,44.30 36.70,44.28 38.28,44.21 39.75,44.15 40.54,43.89 41.07,43.69 41.77,43.42 42.27,43.10 42.80,42.57 43.32,42.05 43.64,41.54 43.91,40.84 44.12,40.32 44.36,39.52 44.43,38.06 44.50,36.48 44.52,36.01 44.52,32.01 44.52,27.99 44.50,27.52 44.43,25.94 44.36,24.48 44.12,23.68 43.91,23.16 43.64,22.46 43.32,21.96 42.80,21.43 42.27,20.90 41.77,20.59 41.07,20.31 40.54,20.10 39.75,19.85 38.28,19.79 Z M 26.03,17.09 C 27.64,17.02 28.15,17.00 32.22,17.00 36.27,17.00 36.80,17.02 38.38,17.08 38.38,17.08 38.41,17.08 38.41,17.08 40.01,17.15 41.10,17.41 42.06,17.78 43.04,18.17 43.87,18.68 44.71,19.51 45.54,20.34 46.06,21.18 46.44,22.17 46.81,23.13 47.06,24.21 47.14,25.81 47.21,27.41 47.23,27.92 47.23,31.99 47.23,36.07 47.21,36.58 47.14,38.18 47.06,39.78 46.81,40.87 46.44,41.82 46.06,42.80 45.54,43.65 44.71,44.48 43.87,45.31 43.04,45.83 42.06,46.21 41.10,46.58 40.00,46.84 38.41,46.91 36.81,46.98 36.31,47.00 32.23,47.00 28.15,47.00 27.64,46.98 26.04,46.91 24.44,46.84 23.35,46.58 22.40,46.21 21.42,45.82 20.58,45.31 19.75,44.48 18.91,43.65 18.39,42.81 18.01,41.82 17.64,40.86 17.39,39.78 17.32,38.18 17.25,36.58 17.23,36.07 17.23,31.99 17.23,27.92 17.25,27.41 17.32,25.82 17.39,24.21 17.64,23.13 18.01,22.17 18.39,21.20 18.91,20.35 19.75,19.52 20.58,18.69 21.41,18.17 22.40,17.78 23.35,17.42 24.44,17.16 26.03,17.09 Z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div className={s.linkColumn}>
                            <div className={s.linkHeader}>Giftcards</div>
                            <Go
                                to={'/'}
                                data-action={'matic-giftcards-home'}
                                data-category={'footer-link'}>
                                Home
                            </Go>
                        </div>
                        <div className={s.linkColumn}>
                            <div className={s.linkHeader}>Help</div>
                            <div>FAQ</div>
                            <div>Contact Us</div>
                        </div>
                        <div className={s.linkColumn}></div>
                        <div className={s.linkColumn}></div>
                    </div>
                    <div className={s.bottomContent}>
                        <img
                            style={{ display: 'inline-block' }}
                            height="40px"
                            width="40px"
                            src="/img/logos/redeemable.svg"
                        />

                        <span>
                            © Matic Gift Cards {new Date().getFullYear()} All Rights 
                            Reserved. When you visit or interact with Matic Gift Cards, 
                            cookies may be used in order to provide you with a better, 
                            faster, and safer experience.
                        </span>
                    </div>
                </div>
            )}
        </div>
    </div>
);
                                        }
Footer.propTypes = {
    backgroundOnly: PropTypes.bool,
};

export default Footer;
