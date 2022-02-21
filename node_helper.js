/* Magic Mirror
 * Module: stocks
 *
 * Authors:
 *    Alex Yakhnin https://github.com/alexyak
 *    Elan Trybuch https://github.com/elaniobro
 *    Ronald Record https://github.com/doctorfree
 *
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var got = require('got');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-stocks: started'); /*eslint-disable-line*/
    },

    getStocks: async function (url) {
        var self = this;

        try {
	        const response = await got(url, { responseType: 'json' });
            if (response.statusCode == 200) {
                var result = JSON.parse(response.body);
                self.sendSocketNotification('STOCKS_RESULT', result);
            }
        } catch (error) {
	        console.log('Got error:', error);
        };
    },

    getStocksMulti: async function (urls) {
        var self = this;
        var count = urls.length;
        var counter = 0;
        var stockResults = [];

        urls.forEach(url => {

            try {
	            const response = await got(url, { responseType: 'json' });
                if (response.statusCode == 200) {
                    stockResults.push(JSON.parse(response.body));
                    counter++;
                    if (counter == count - 1) {
                        self.sendSocketNotification('STOCKS_RESULT', stockResults);
                    }
                };
            } catch (error) {
                var err = error;
                throw new Error(err);
            };
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_STOCKS') {
            this.getStocks(payload);
        }
        if (notification === 'GET_STOCKS_MULTI') {
            this.getStocksMulti(payload);
        }
    }
});

