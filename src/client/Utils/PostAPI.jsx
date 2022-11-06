// @flow
const API_TIMEOUT = 25000; // ms

const relay = {
    sendMetaTx: (
        depositAccountAddress: string,
        signature: string,
        functionSignature: string,
        r: Uint8Array,
        s: Uint8Array,
        v: number,
        claimerAccount: string
    ): Promise<any> => {
        console.log('[relay/redeem]', {
            depositAccountAddress,
            signature,
            functionSignature,
            r,
            s,
            v,
        });
        return new Promise((resolve, reject) => {
            // Start POST Write Message
            var data = new FormData();
            data.append('depositaccountaddress', depositAccountAddress);
            data.append('signature', signature);
            data.append('functionsignature', functionSignature);
            data.append('r', JSON.stringify(r));
            data.append('s', JSON.stringify(s));
            data.append('v', String(v));
            data.append('claimeraccount', claimerAccount);

            const timeoutID = setTimeout(
                function() {
                    console.log('[relay/redeem] Timeout', data);
                    reject(new Error('Timeout'));
                }.bind(this),
                API_TIMEOUT
            );

            fetch('/relay/redeem', {
                method: 'POST',
                body: data,
            })
                .then(res => {
                    clearTimeout(timeoutID);

                    if (!res.ok) {
                        res.text().then(text => {
                            reject(text);
                        });
                    } else {
                        res.arrayBuffer()
                            .then(buf => {
                                console.log('[relay/redeem] Response', { buf });
                                resolve(buf);
                            })
                            .catch(err => {
                                console.log(
                                    '[relay/redeem] Error decoding reply',
                                    { err, res }
                                );
                                reject(
                                    new Error(
                                        '[relay/redeem] Error decoding reply' +
                                            err
                                    )
                                );
                            });
                    }
                })
                .catch(err => {
                    console.log('[relay/redeem] Error sending POST', { err });
                    reject(
                        new Error('[relay/redeem] Error sending POST:' + err)
                    );
                });
        });
    },
};

const PostAPI = {
    relay,
};

export default PostAPI;
