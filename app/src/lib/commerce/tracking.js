import { trackingApi } from '@sitecore-jss/sitecore-jss-tracking';
import { shopName, sitecoreApiHost, sitecoreApiKey } from '../../temp/config';
import fetch from 'node-fetch';

const trackingApiOptions = {
  host: sitecoreApiHost,
  querystringParams: {
    sc_apikey: sitecoreApiKey,
  },
  fetcher: myFetcher
};

// Supply your own fetcher, see https://sitecore.stackexchange.com/questions/20929/jss-tracking-api-fetch-cors-and-mvc-errors/20931
async function myFetcher(url, data) {
    return await fetch(url, {
        method: 'post', 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body:  JSON.stringify(data)
    });
}

export async function trackEvent(events) {
  try {
    await trackingApi.trackEvent(events, trackingApiOptions);
  } catch (error) {
    console.error(`Failed to track event: ${error}`);
  }
}

async function trackCartlineEvent(id, line) {
  const lineEvent = {
    Product: line.itemId,
    Price: line.amount ? line.amount : 0,
    ProductName: line.displayName,
    Quantity: line.quantity
  };

  trackEvent([{ commerceEventId: id, ShopName: shopName, CartLines: [lineEvent]}]);
}

export async function trackCartlineAdded(line) {
  trackCartlineEvent('Lines Added To Cart', line);
}

export async function trackCartlineRemoved(line) {
  trackCartlineEvent('Lines Removed From Cart', line);
}

export async function abandonSession() {
    const abandonOptions = {
      action: 'flush',
      ...trackingApiOptions,
    };

    try {
        await trackingApi.trackEvent([], abandonOptions);
        alert('Interaction has been terminated and its data pushed to xConnect.');
    }
    catch (error) {
        alert(error)
    }
}
